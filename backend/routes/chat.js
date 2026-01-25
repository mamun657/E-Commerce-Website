import express from "express";
import fetch from "node-fetch";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * Parse user message to extract budget and category hints
 */
const parseUserIntent = (message) => {
  const lowerMsg = message.toLowerCase();
  
  // Extract budget (e.g., "50000", "50,000", "50k")
  let budget = null;
  const budgetMatch = lowerMsg.match(/(\d{1,3}(?:,?\d{3})*)\s*(?:tk|taka|bdt)?/i) ||
                      lowerMsg.match(/(\d+)k/i);
  if (budgetMatch) {
    budget = budgetMatch[1].includes('k') 
      ? parseInt(budgetMatch[1]) * 1000 
      : parseInt(budgetMatch[1].replace(/,/g, ''));
  }

  // Detect category from message
  const categoryKeywords = {
    'Mobile Phones': ['phone', 'mobile', 'smartphone', 'iphone', 'samsung', 'xiaomi', 'android'],
    'Headphones': ['headphone', 'earphone', 'earbuds', 'headset', 'audio'],
    'Laptops': ['laptop', 'notebook', 'macbook', 'computer'],
    'Smart Watches': ['watch', 'smartwatch', 'fitness band'],
    'Clothes': ['shirt', 'tshirt', 't-shirt', 'pant', 'clothes', 'dress', 'jacket'],
    'Shoes': ['shoe', 'sneaker', 'boot', 'sandal', 'footwear'],
    'Accessories': ['accessory', 'bag', 'case', 'charger', 'cable'],
    'LED TV': ['tv', 'television', 'led', 'smart tv'],
    'Fans': ['fan', 'ceiling fan', 'table fan'],
    'Bikes': ['bike', 'motorcycle', 'cycle', 'scooter']
  };

  let category = null;
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => lowerMsg.includes(kw))) {
      category = cat;
      break;
    }
  }

  return { budget, category };
};

/**
 * Format products for AI context (NO PRICES)
 */
const formatProductsForAI = (products) => {
  if (products.length === 0) {
    return "NO PRODUCTS AVAILABLE matching this criteria.";
  }
  
  return products.map((p, i) => 
    `${i + 1}. ${p.name} | Category: ${p.category} | ${p.stock > 0 ? 'In Stock' : 'Out of Stock'}${p.brand ? ` | Brand: ${p.brand}` : ''}${p.description ? ` | Features: ${p.description.substring(0, 100)}` : ''}`
  ).join('\n');
};

router.post("/", async (req, res) => {
  try {
    console.log("✅ /api/chat hit");

    const { message } = req.body;

    // ✅ Validate input
    if (!message || typeof message !== "string") {
      return res.status(400).json({ 
        error: "Invalid message",
        content: "Please enter a valid message."
      });
    }

    // ✅ Validate API key (with debug info)
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("❌ GROQ_API_KEY is not set in environment variables");
      return res.status(500).json({ 
        error: "API key missing",
        content: "The AI service is not configured. Please contact support."
      });
    }
    
    // Debug: Log key format (safe - only shows prefix)
    console.log("🔑 GROQ_API_KEY format check:", {
      exists: !!apiKey,
      length: apiKey.length,
      prefix: apiKey.substring(0, 4),
      hasSpaces: apiKey !== apiKey.trim(),
      hasQuotes: apiKey.includes('"') || apiKey.includes("'")
    });

    // ✅ Parse user intent (budget, category)
    const { budget, category } = parseUserIntent(message);
    console.log("🔍 Parsed intent:", { budget, category });

    // ✅ Build product filter (ignore budget for filtering, just use category)
    const filter = { active: true, stock: { $gt: 0 } };
    if (category) filter.category = category;
    // Note: We don't filter by budget since we don't show prices

    // ✅ Fetch REAL products from database
    const products = await Product.find(filter)
      .select('name category stock brand description')
      .sort({ 'rating.average': -1 })
      .limit(10);

    console.log(`📦 Found ${products.length} matching products`);

    // ✅ Also fetch some popular products if no specific match
    let fallbackProducts = [];
    if (products.length === 0 && !category) {
      fallbackProducts = await Product.find({ active: true, stock: { $gt: 0 } })
        .select('name category stock brand description')
        .sort({ 'rating.average': -1 })
        .limit(8);
    }

    const productsToShow = products.length > 0 ? products : fallbackProducts;
    const productContext = formatProductsForAI(productsToShow);

    // ✅ Build system prompt with REAL products (NO PRICES)
    const systemPrompt = `
You are a friendly shopping assistant for "Apnar Dokan" e-commerce store.

**STRICT RULES - MUST FOLLOW:**
1. NEVER mention prices, discounts, or currency (BDT, ৳, Taka) in your responses.
2. NEVER do budget calculations or price comparisons.
3. You can ONLY recommend products from the list below.
4. NEVER invent or make up product names or brands.
5. If the product list says "NO PRODUCTS AVAILABLE", say the product is not available.
6. Keep responses short, friendly, and helpful (max 4-5 lines).

**AVAILABLE PRODUCTS IN STORE:**
${productContext}

**RESPONSE FORMAT (when product exists):**
- Confirm availability with a friendly emoji 😊
- Product name (bold with **)
- Category
- Brief feature summary (1 line)
- End with: "👉 Please check the product page for price and full details."

**RESPONSE FORMAT (when asking about prices):**
- Say: "For the most accurate pricing, please check the product directly on our shop page! 🛒"

**RESPONSE FORMAT (when product NOT available):**
- Say: "Sorry, this product is not currently available in our store. Would you like to see similar items?"

User's query category: ${category || 'General browsing'}
`;

    // ✅ Call Groq API with product context
    const apiKey = process.env.GROQ_API_KEY.trim(); // Trim any whitespace
    
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
          temperature: 0.2, // Lower = more factual
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await response.json();

    // Debug: Log full response structure
    console.log("📥 Groq API response status:", response.status);
    
    if (!response.ok) {
      console.error("❌ Groq API error:", JSON.stringify(data, null, 2));
      
      // Handle specific Groq error codes
      const errorCode = data.error?.code || 'unknown';
      const errorMessage = data.error?.message || 'Unknown error';
      
      let userMessage = "Sorry, I'm having trouble connecting to the AI service.";
      
      if (errorCode === 'invalid_api_key') {
        console.error("🔴 CRITICAL: Invalid Groq API key. Check GROQ_API_KEY in Render environment variables.");
        userMessage = "AI service configuration error. Please contact support.";
      } else if (errorCode === 'rate_limit_exceeded') {
        userMessage = "Too many requests. Please wait a moment and try again.";
      } else if (errorCode === 'model_not_found') {
        userMessage = "AI model unavailable. Please try again later.";
      }
      
      return res.status(500).json({ 
        error: errorMessage,
        code: errorCode,
        content: userMessage
      });
    }

    const reply = data.choices?.[0]?.message;
    console.log("💬 Reply object:", reply);

    if (!reply || !reply.content) {
      console.error("❌ No valid reply in Groq response");
      return res.status(500).json({ 
        error: "No reply from Groq",
        content: "Sorry, I couldn't generate a response. Please try again."
      });
    }

    // ✅ Send assistant reply to frontend
    res.json({ role: reply.role || 'assistant', content: reply.content });
  } catch (err) {
    console.error("❌ Chat error:", err.message, err.stack);
    res.status(500).json({ 
      error: "Server error", 
      content: "Sorry, something went wrong. Please try again later."
    });
  }
});

export default router;
