const OpenAI = require("openai");
const fs = require("fs");
const PDFParser = require("pdf2json");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// Helper: extract text from PDF buffer using pdf2json
const extractPDFText = (filePath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(new Error(err.parserError));
    });

    pdfParser.on("pdfParser_dataReady", () => {
      // getRawTextContent() gives plain text with form feeds between pages
      const raw = pdfParser.getRawTextContent();
      // Clean up: replace form feeds and excessive whitespace
      const cleaned = raw
        .replace(/\f/g, "\n")
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      resolve(cleaned);
    });

    pdfParser.loadPDF(filePath);
  });
};

// ---------------- CHAT ----------------
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an AI tutor helping students learn." },
        { role: "user", content: message }
      ]
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI chat failed" });
  }
};

// ---------------- ANALYZE MATERIAL ----------------
exports.analyzeMaterial = async (req, res) => {
  try {
    const { content } = req.body;

    let materialText = "";
    if (Array.isArray(content)) {
      const firstMessage = content[0];
      if (firstMessage && Array.isArray(firstMessage.content)) {
        for (const block of firstMessage.content) {
          if (block.type === "text") materialText += block.text + "\n";
        }
      } else if (firstMessage && typeof firstMessage.content === "string") {
        materialText = firstMessage.content;
      } else {
        materialText = JSON.stringify(content);
      }
    } else {
      materialText = JSON.stringify(content);
    }

    if (materialText.length > 3000) materialText = materialText.slice(0, 3000);

    const prompt = `You must respond ONLY with valid JSON. No text before or after. No markdown fences.

Format:
{
  "summary": "3-5 sentence summary",
  "topics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "keyPoints": ["point1", "point2", "point3", "point4", "point5"],
  "studyTips": "short personalized study advice"
}

Study material:
${materialText}`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an expert academic AI tutor. Always respond with valid JSON only." },
        { role: "user", content: prompt }
      ]
    });

    let aiText = response.choices[0].message.content.trim();
    const first = aiText.indexOf("{");
    const last = aiText.lastIndexOf("}");
    if (first !== -1 && last !== -1) aiText = aiText.substring(first, last + 1);

    res.json({ content: [{ text: aiText }] });

  } catch (error) {
    console.error("Analyze Error:", error);
    res.status(500).json({
      content: [{
        text: JSON.stringify({
          summary: "AI analysis failed. Please try again.",
          topics: [],
          keyPoints: [],
          studyTips: "Please try again."
        })
      }]
    });
  }
};

// ---------------- QUIZ ----------------
exports.generateQuiz = async (req, res) => {
  try {
    const { content } = req.body;

    let materialText = "";
    if (Array.isArray(content)) {
      const firstMessage = content[0];
      if (firstMessage && Array.isArray(firstMessage.content)) {
        for (const block of firstMessage.content) {
          if (block.type === "text") materialText += block.text + "\n";
        }
      } else {
        materialText = JSON.stringify(content);
      }
    } else {
      materialText = JSON.stringify(content);
    }

    if (materialText.length > 2500) materialText = materialText.slice(0, 2500);

    const prompt = `Create a 5-question multiple choice quiz from the study material below.

Return ONLY valid JSON, no markdown, no explanation:
{
  "questions": [
    {
      "question": "Question text?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

The "correct" field is the 0-based index of the correct option.

Material:
${materialText}`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You generate educational quizzes. Respond with JSON only." },
        { role: "user", content: prompt }
      ]
    });

    let aiText = response.choices[0].message.content.trim();
    const first = aiText.indexOf("{");
    const last = aiText.lastIndexOf("}");
    if (first !== -1 && last !== -1) aiText = aiText.substring(first, last + 1);

    res.json({ content: [{ text: aiText }] });

  } catch (error) {
    console.error("Quiz Error:", error);
    res.status(500).json({ error: "Quiz generation failed" });
  }
};

// ---------------- ASK QUESTION ABOUT DOCUMENT ----------------
exports.askPDF = async (req, res) => {
  try {
    const { question, documentText } = req.body;

    if (!question) return res.status(400).json({ error: "Question is required" });

    const context = documentText
      ? `Study Material:\n${documentText.slice(0, 3000)}\n\nAnswer based on the material above.`
      : "Answer the student's question as best you can.";

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful AI tutor. Answer questions clearly and concisely based on the provided study material." },
        { role: "user", content: `${context}\n\nQuestion: ${question}` }
      ]
    });

    res.json({ answer: response.choices[0].message.content });

  } catch (error) {
    console.error("Ask error:", error);
    res.status(500).json({ error: "Question answering failed" });
  }
};

// ---------------- FILE UPLOAD (PDF via multer) ----------------
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract text using pdf2json (works reliably on Node 22)
    let extractedText = "";
    try {
      extractedText = await extractPDFText(req.file.path);
    } catch (pdfErr) {
      console.error("PDF extraction error:", pdfErr.message);
      extractedText = "";
    }

    // Clean up temp file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // If we got no text (scanned/image PDF), fall back gracefully
    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(200).json({
        summary: "This PDF appears to be image-based or scanned. AI analysis requires text-based PDFs. Please try a text-based PDF or paste the content as a .txt file.",
        topics: [],
        keyPoints: [],
        studyTips: "Use a text-based PDF for best results.",
        extractedText: ""
      });
    }

    const textForAI = extractedText.slice(0, 3000);

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `Analyze this study material and respond ONLY with valid JSON, no markdown:
{
  "summary": "3-5 sentence summary",
  "topics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "keyPoints": ["point1", "point2", "point3", "point4", "point5"],
  "studyTips": "brief study advice"
}`
        },
        { role: "user", content: textForAI }
      ]
    });

    let aiText = response.choices[0].message.content.trim();
    const first = aiText.indexOf("{");
    const last = aiText.lastIndexOf("}");
    if (first !== -1 && last !== -1) aiText = aiText.substring(first, last + 1);

    let parsed = {};
    try {
      parsed = JSON.parse(aiText);
    } catch {
      parsed = {
        summary: "Could not parse AI response. Please try again.",
        topics: [],
        keyPoints: [],
        studyTips: "Please try uploading again."
      };
    }

    res.json({ ...parsed, extractedText: extractedText.slice(0, 5000) });

  } catch (error) {
    console.error("Upload AI Error:", error);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Upload processing failed: " + error.message });
  }
};