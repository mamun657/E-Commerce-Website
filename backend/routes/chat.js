import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("✅ /api/chat hit");

    const { message } = req.body;

    // ✅ Validate input
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message" });
    }

    // ✅ Validate API key
    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY missing");
      return res.status(500).json({ error: "API key missing" });
    }

    // ✅ Call Groq API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // ✅ WORKING MODEL
          temperature: 0.3,
          messages: [
            // 🔥 SYSTEM PROMPT (THIS IS WHERE IT GOES)
            {
              role: "system",
              content: `
You are a smart e-commerce shopping assistant.

Rules:
- Keep replies short and friendly (max 4–5 lines).
- When user asks for recommendations, suggest 2–3 items immediately.
- Do NOT ask multiple questions.
- Ask at most ONE simple follow-up question if needed.
- Sound confident, like a store assistant.

Example:
If user asks "Recommend a gift item",
suggest products directly instead of asking many questions.
              `,
            },

            // 👤 USER MESSAGE
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Groq API error:", data);
      return res.status(500).json({ error: "Groq API failed" });
    }

    const reply = data.choices?.[0]?.message;

    if (!reply) {
      return res.status(500).json({ error: "No reply from Groq" });
    }

    // ✅ Send assistant reply to frontend
    res.json(reply);
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: "Server crash" });
  }
});

export default router;
