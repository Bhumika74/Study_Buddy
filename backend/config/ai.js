const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY
});

module.exports = client;