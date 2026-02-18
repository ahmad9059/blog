// =============================================================================
// RAG Chat API — Vercel Serverless Function
// Embeds user query → retrieves relevant knowledge → generates response as Ahmad
// =============================================================================

// Load knowledge base and embeddings at cold start
// Using require() ensures Vercel's bundler includes these files
// Wrapped in try-catch to prevent total function crash on load failure
let knowledge = null;
let embeddingsData = null;
let knowledgeMap = {};
let embeddingsMap = {};
let normsMap = {};  // Pre-computed norms for faster cosine similarity
let loadError = null;

try {
  knowledge = require("./knowledge.json");
  embeddingsData = require("./embeddings.json");

  // Build lookup maps
  knowledge.forEach((chunk) => {
    knowledgeMap[chunk.id] = chunk;
  });

  // Pre-compute norms at cold start (avoids sqrt on every query comparison)
  embeddingsData.forEach((item) => {
    embeddingsMap[item.id] = item.vector;
    let norm = 0;
    for (let i = 0; i < item.vector.length; i++) {
      norm += item.vector[i] * item.vector[i];
    }
    normsMap[item.id] = Math.sqrt(norm);
  });
} catch (e) {
  loadError = e.message;
  console.error("Failed to load knowledge/embeddings:", e.message);
}

// -----------------------------------------------------------------------------
// Rate Limiter — sliding window per IP
// -----------------------------------------------------------------------------
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// Periodically clean expired rate limit entries (prevent memory leak on long-lived instances)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW * 5);

// -----------------------------------------------------------------------------
// Cosine Similarity — uses pre-computed norms for document vectors
// -----------------------------------------------------------------------------
function cosineSimilarity(queryVec, docVec, docNorm) {
  let dot = 0, queryNorm = 0;
  for (let i = 0; i < queryVec.length; i++) {
    dot += queryVec[i] * docVec[i];
    queryNorm += queryVec[i] * queryVec[i];
  }
  return dot / (Math.sqrt(queryNorm) * docNorm);
}

// -----------------------------------------------------------------------------
// Embedding — calls Gemini embedding API with timeout
// -----------------------------------------------------------------------------
const EMBEDDING_MODEL = "gemini-embedding-001";
const GEMINI_MODEL = "gemini-2.5-flash";
const API_TIMEOUT = 15000; // 15 second timeout for API calls

async function fetchWithTimeout(url, options, timeout = API_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function getQueryEmbedding(text, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;

  const response = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text }] },
      taskType: "RETRIEVAL_QUERY",
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Embedding API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  return data.embedding.values;
}

// -----------------------------------------------------------------------------
// Retrieval — top-K with similarity threshold and category diversity
// -----------------------------------------------------------------------------
const SIMILARITY_THRESHOLD = 0.3; // Minimum similarity to include a chunk
const MAX_CHUNKS = 7;             // Maximum chunks to include
const MIN_CHUNKS = 3;             // Always include at least this many

function retrieveChunks(queryVector, topK = MAX_CHUNKS) {
  const scores = [];

  for (const [id, vector] of Object.entries(embeddingsMap)) {
    const similarity = cosineSimilarity(queryVector, vector, normsMap[id]);
    scores.push({ id, similarity });
  }

  scores.sort((a, b) => b.similarity - a.similarity);

  // Take top-K but apply similarity threshold (keep at least MIN_CHUNKS)
  const results = [];
  const seenCategories = new Set();

  for (const s of scores) {
    if (results.length >= topK) break;

    // After MIN_CHUNKS, enforce threshold to avoid injecting noise
    if (results.length >= MIN_CHUNKS && s.similarity < SIMILARITY_THRESHOLD) break;

    const chunk = knowledgeMap[s.id];
    if (!chunk) continue;

    results.push({ ...chunk, similarity: s.similarity });
    seenCategories.add(chunk.category);
  }

  return results;
}

// -----------------------------------------------------------------------------
// Query Enhancement — combine recent conversation context for better retrieval
// -----------------------------------------------------------------------------
function buildEnhancedQuery(message, history) {
  // For the first message or short conversations, just use the message
  if (!history || history.length === 0) return message;

  // Take last 2 user messages for context (helps with follow-up questions like "tell me more")
  const recentUserMessages = history
    .filter((m) => m.role === "user")
    .slice(-2)
    .map((m) => m.content);

  // If the current message is very short (likely a follow-up), prepend context
  if (message.split(" ").length <= 5 && recentUserMessages.length > 0) {
    return recentUserMessages.join(" ") + " " + message;
  }

  return message;
}

// -----------------------------------------------------------------------------
// System Prompt — comprehensive persona with knowledge coverage hints
// -----------------------------------------------------------------------------
function buildSystemPrompt(contextChunks) {
  const context = contextChunks
    .map((c, i) => `[${i + 1}. ${c.category.toUpperCase()}: ${c.title}]\n${c.content}`)
    .join("\n\n");

  // Build category summary from retrieved chunks
  const categories = [...new Set(contextChunks.map((c) => c.category))];

  return `You are Ahmad Hassan, a Software Engineer and Full Stack Developer from Pakistan. You are the AI version of Ahmad, responding to visitors on his portfolio website (itsahmad.vercel.app).

PERSONA:
- Always respond in FIRST PERSON as Ahmad ("I", "my", "me")
- Be conversational, warm, and professional — like Ahmad is chatting directly
- Show genuine enthusiasm about your work without being over-the-top

RESPONSE RULES:
- Keep responses concise: 1-3 short paragraphs for simple questions, up to 4 for detailed ones
- Use markdown: **bold** for emphasis, [text](url) for links, bullet lists for multiple items
- When mentioning projects or certifications, ALWAYS include the relevant URL as a clickable link
- Never make up information not present in the context below
- If the context doesn't cover something, say "I don't have that specific info on my portfolio, but feel free to ask about my projects, skills, certifications, or experience!"
- For greetings (hi, hello, hey), respond warmly and briefly suggest what you can help with
- For off-topic questions (coding help, general knowledge, etc.), politely redirect: "That's a great question, but I'm here specifically to tell you about my work and experience. Want to know about my projects or skills?"

KNOWLEDGE COVERAGE (topics you can answer about):
Bio & background, education, work at VieroMind, open-source contributions, competitive programming, blog & writing, tools & setup (Arch Linux, Neovim, Hyprland), 7 projects (HyprFlux, SehatScan, HisaabScore, RAF-SP, UAM Tracker, MindOasis, CodingHawks), 21 certifications (AWS, Meta, Google, GitHub, etc.), 9 achievements & competition results, 34 blog articles (system design, AWS CCP notes, shell scripting, JavaScript/web dev, databases, and more — you can share links to specific articles), contact info & social links.

RETRIEVED CONTEXT (${contextChunks.length} relevant sections from ${categories.join(", ")}):
${context}`;
}

// -----------------------------------------------------------------------------
// History Sanitization — trim and validate conversation history
// -----------------------------------------------------------------------------
function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-8) // Last 8 messages (4 turns) — enough context without token waste
    .filter((msg) => msg && typeof msg.content === "string" && msg.content.length <= 1000)
    .map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content.trim() }],
    }));
}

// =============================================================================
// Request Handler
// =============================================================================
module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const ip = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests. Please wait a moment." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY env var");
    return res.status(500).json({ error: "Server configuration error: missing API key" });
  }

  if (loadError) {
    console.error("Data load failed at cold start:", loadError);
    return res.status(500).json({ error: "Server configuration error: failed to load knowledge data", detail: loadError });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    if (trimmedMessage.length > 500) {
      return res.status(400).json({ error: "Message too long (max 500 characters)" });
    }

    // Step 1: Build enhanced query with conversation context for better retrieval
    const enhancedQuery = buildEnhancedQuery(trimmedMessage, history);

    // Step 2: Embed the (enhanced) query
    const queryVector = await getQueryEmbedding(enhancedQuery, apiKey);

    // Step 3: Retrieve relevant context chunks (with threshold filtering)
    const relevantChunks = retrieveChunks(queryVector);

    // Step 4: Build system prompt with retrieved context
    const systemPrompt = buildSystemPrompt(relevantChunks);

    // Step 5: Build conversation history for Gemini
    const conversationHistory = sanitizeHistory(history);

    // Add current user message
    conversationHistory.push({
      role: "user",
      parts: [{ text: trimmedMessage }],
    });

    // Step 6: Call Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetchWithTimeout(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      }),
    }, 30000); // 30s timeout for generation (longer than embedding)

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);

      if (geminiResponse.status === 429) {
        return res.status(429).json({
          error: "I'm getting too many requests right now. Please try again in a minute.",
        });
      }
      if (geminiResponse.status === 403) {
        return res.status(500).json({
          error: "API configuration error. Please try again later.",
        });
      }
      return res.status(500).json({
        error: "Failed to generate response",
        detail: `Gemini ${geminiResponse.status}: ${errorText}`,
      });
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("No text in Gemini response:", JSON.stringify(geminiData));
      return res.status(500).json({ error: "Empty response from AI" });
    }

    // Step 7: Stream response as SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send the full text in chunks to simulate streaming
    const words = responseText.split(" ");
    const chunkSize = 3;

    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(" ");
      const suffix = i + chunkSize < words.length ? " " : "";
      res.write(`data: ${JSON.stringify({ text: chunk + suffix })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Chat API error:", error.message, error.stack);

    // Handle timeout specifically
    if (error.name === "AbortError") {
      if (!res.headersSent) {
        return res.status(504).json({
          error: "The request took too long. Please try again with a simpler question.",
        });
      }
    }

    if (!res.headersSent) {
      res.status(500).json({
        error: "An error occurred processing your request",
        detail: error.message,
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
};
