import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("✅ /api/chat hit");

    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message" });
    }

    // Validate API key
    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY missing");
      return res.status(500).json({ error: "API key missing" });
    }

    // Call Groq API
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
          messages: [
            {
              role: "system",
              content:
                "You are a helpful e-commerce assistant. Answer clearly and shortly.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.3,
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

    // Send assistant reply to frontend
    res.json(reply);
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: "Server crash" });
  }
});

export default router;
