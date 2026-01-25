import express from "express";
import fetch from "node-fetch";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * Parse user intent (budget + category)
 */
const parseUserIntent = (message) => {
  const text = message.toLowerCase();

  // Budget (optional, not used for filtering)
  let budget = null;
  const match =
    text.match(/(\d{1,3}(?:,?\d{3})*)\s*(?:tk|taka|bdt)?/i) ||
    text.match(/(\d+)k/i);

  if (match) {
    budget = text.includes("k")
      ? parseInt(match[1]) * 1000
      : parseInt(match[1].replace(/,/g, ""));
  }

  // Category detection
  const categories = {
    "Mobile Phones": ["phone", "mobile", "iphone", "samsung", "xiaomi"],
    Headphones: ["headphone", "earphone", "earbuds"],
    Laptops: ["laptop", "notebook", "macbook"],
    Clothes: ["shirt", "tshirt", "pant", "dress"],
    Shoes: ["shoe", "sneaker", "boot"],
    Accessories: ["bag", "charger", "cable"],
  };

  let category = null;
  for (const [cat, keys] of Object.entries(categories)) {
    if (keys.some((k) => text.includes(k))) {
      category = cat;
      break;
    }
  }

  return { budget, category };
};

/**
 * Format products for AI (NO prices)
 */
const formatProductsForAI = (products) => {
  if (!products.length) {
    return "NO PRODUCTS AVAILABLE";
  }

  return products
    .map(
      (p, i) =>
        `${i + 1}. ${p.name} | Category: ${p.category} | ${
          p.stock > 0 ? "In Stock" : "Out of Stock"
        }${p.brand ? ` | Brand: ${p.brand}` : ""}${
          p.description
            ? ` | Features: ${p.description.slice(0, 100)}`
            : ""
        }`
    )
    .join("\n");
};

/**
 * POST /api/chat
 */
router.post("/", async (req, res) => {
  try {
    console.log("✅ /api/chat hit");

    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Invalid message",
        content: "Please enter a valid message.",
      });
    }

    // ✅ API key (declare ONCE)
    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      console.error("❌ GROQ_API_KEY missing");
      return res.status(500).json({
        error: "API key missing",
        content: "AI service is not configured.",
      });
    }

    // Parse intent
    const { budget, category } = parseUserIntent(message);
    console.log("🔍 Intent:", { budget, category });

    // Fetch products
    const filter = { active: true, stock: { $gt: 0 } };
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .select("name category stock brand description")
      .limit(10);

    console.log(`📦 Products found: ${products.length}`);

    const productContext = formatProductsForAI(products);

    // System prompt
    const systemPrompt = `
You are a friendly shopping assistant for "Apnar Dokan".

RULES:
- NEVER mention prices or currency.
- ONLY recommend products from the list.
- Keep replies short (max 4–5 lines).

AVAILABLE PRODUCTS:
${productContext}

If no product is available, politely say so.
`;

    // Call Groq API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.3,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("📥 Groq status:", response.status);

    if (!response.ok) {
      console.error("❌ Groq error:", data);
      return res.status(500).json({
        error: data.error?.message || "Groq API error",
        content: "AI service error. Please try again later.",
      });
    }

    const reply = data.choices?.[0]?.message;

    if (!reply?.content) {
      return res.status(500).json({
        error: "Empty reply",
        content: "No response generated. Please try again.",
      });
    }

    res.json({
      role: "assistant",
      content: reply.content,
    });
  } catch (err) {
    console.error("❌ Chat crash:", err);
    res.status(500).json({
      error: "Server error",
      content: "Something went wrong. Please try again later.",
    });
  }
});

export default router;