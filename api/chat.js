// Load knowledge base and embeddings at cold start
// Using require() ensures Vercel's bundler includes these files
// Wrapped in try-catch to prevent total function crash on load failure
let knowledge = null;
let embeddingsData = null;
let knowledgeMap = {};
let embeddingsMap = {};
let loadError = null;

try {
  knowledge = require("./knowledge.json");
  embeddingsData = require("./embeddings.json");

  // Build lookup maps: id -> { chunk, vector }
  knowledge.forEach((chunk) => {
    knowledgeMap[chunk.id] = chunk;
  });
  embeddingsData.forEach((item) => {
    embeddingsMap[item.id] = item.vector;
  });
} catch (e) {
  loadError = e.message;
  console.error("Failed to load knowledge/embeddings:", e.message);
}

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max requests per window

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

// Cosine similarity
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Get embedding for a query using Gemini
async function getQueryEmbedding(text, apiKey) {
  const model = "gemini-embedding-001";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: `models/${model}`,
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

// Retrieve top-K relevant chunks
function retrieveChunks(queryVector, topK = 5) {
  const scores = [];
  
  for (const [id, vector] of Object.entries(embeddingsMap)) {
    const similarity = cosineSimilarity(queryVector, vector);
    scores.push({ id, similarity });
  }
  
  scores.sort((a, b) => b.similarity - a.similarity);
  
  return scores.slice(0, topK).map((s) => ({
    ...knowledgeMap[s.id],
    similarity: s.similarity,
  }));
}

// Build the system prompt
function buildSystemPrompt(contextChunks) {
  const context = contextChunks
    .map((c) => `[${c.category.toUpperCase()}: ${c.title}]\n${c.content}`)
    .join("\n\n");

  return `You are Ahmad Hassan, a Software Engineer and Full Stack Developer from Pakistan. You are the AI version of Ahmad, speaking on his portfolio website. 

IMPORTANT RULES:
- Always respond in FIRST PERSON as Ahmad (use "I", "my", "me")
- Be conversational, friendly, concise, and helpful
- Only answer based on the provided context about Ahmad
- If someone asks something not covered in the context, politely say you don't have that specific information but suggest what you can help with
- Keep responses relatively short (2-4 paragraphs max) unless the user asks for detail
- When mentioning projects, certifications, or links, include the relevant URLs
- Don't make up information that isn't in the context
- You can use markdown formatting (bold, links, lists) in your responses
- If someone asks unrelated questions (like coding help, general knowledge, etc.), gently redirect them to ask about Ahmad's portfolio, projects, skills, or experience

CONTEXT ABOUT AHMAD:
${context}`;
}

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

    if (message.length > 500) {
      return res.status(400).json({ error: "Message too long (max 500 characters)" });
    }

    // Step 1: Embed the user query
    const queryVector = await getQueryEmbedding(message, apiKey);

    // Step 2: Retrieve relevant context chunks
    const relevantChunks = retrieveChunks(queryVector, 5);

    // Step 3: Build system prompt with context
    const systemPrompt = buildSystemPrompt(relevantChunks);

    // Step 4: Build conversation history for Gemini
    const conversationHistory = [];
    
    // Add recent history (last 10 messages)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      conversationHistory.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }

    // Add current user message
    conversationHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Step 5: Call Gemini API (non-streaming for compatibility)
    const geminiModel = "gemini-2.0-flash";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
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
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);
      return res.status(500).json({ 
        error: "Failed to generate response", 
        detail: `Gemini ${geminiResponse.status}: ${errorText}` 
      });
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("No text in Gemini response:", JSON.stringify(geminiData));
      return res.status(500).json({ error: "Empty response from AI" });
    }

    // Send response as SSE for frontend compatibility
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send the full text in chunks to simulate streaming
    const words = responseText.split(" ");
    const chunkSize = 3; // Send 3 words at a time
    
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(" ");
      const suffix = i + chunkSize < words.length ? " " : "";
      res.write(`data: ${JSON.stringify({ text: chunk + suffix })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Chat API error:", error.message, error.stack);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "An error occurred processing your request",
        detail: error.message,
        step: "unknown"
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
};
