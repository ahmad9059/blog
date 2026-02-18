// Health/debug endpoint to diagnose serverless function issues
module.exports = function handler(req, res) {
  const diagnostics = {
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      GEMINI_API_KEY_SET: !!process.env.GEMINI_API_KEY,
      GEMINI_API_KEY_LENGTH: process.env.GEMINI_API_KEY
        ? process.env.GEMINI_API_KEY.length
        : 0,
      NODE_VERSION: process.version,
    },
    data: {
      knowledgeLoaded: false,
      knowledgeCount: 0,
      embeddingsLoaded: false,
      embeddingsCount: 0,
    },
  };

  try {
    const knowledge = require("./knowledge.json");
    diagnostics.data.knowledgeLoaded = true;
    diagnostics.data.knowledgeCount = Array.isArray(knowledge)
      ? knowledge.length
      : Object.keys(knowledge).length;
  } catch (e) {
    diagnostics.data.knowledgeError = e.message;
  }

  try {
    const embeddings = require("./embeddings.json");
    diagnostics.data.embeddingsLoaded = true;
    diagnostics.data.embeddingsCount = Array.isArray(embeddings)
      ? embeddings.length
      : Object.keys(embeddings).length;
    if (Array.isArray(embeddings) && embeddings.length > 0) {
      diagnostics.data.firstEmbeddingVectorLength =
        embeddings[0].vector?.length || 0;
    }
  } catch (e) {
    diagnostics.data.embeddingsError = e.message;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(diagnostics);
};
