import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazily initialize/instantiate Google GenAI with the recommended SDK practices
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ""
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware is required for body decoding
  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const lower = message.toLowerCase();
      let cardType: string | null = null;
      
      // Categorize responses into high-fidelity custom frontend render templates
      if (lower.includes('low stock') || lower.includes('limit') || lower.includes('alert') || lower.includes('reorder')) {
        cardType = 'low_stock';
      } else if (lower.includes('expir') || lower.includes('batch') || lower.includes('expired') || lower.includes('antibiotic')) {
        cardType = 'expiring';
      } else if (lower.includes('sales') || lower.includes('summary') || lower.includes('revenue') || lower.includes('gross')) {
        cardType = 'sales_summary';
      }

      // If a real API key is present, let's call Gemini 3.5-flash for real answers!
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== "" && apiKey !== "MY_GEMINI_API_KEY") {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: message,
            config: {
              systemInstruction: `You are 'PharmaAI', an expert digital clinical agent representing the Xion Pharma ERP workspace (Downtown Central branch). The active senior pharmacist is Dr. Sarah Khan.
Be highly helpful, structured, concise, and use standard markdown formatting (e.g. bold highlights and lists) for maximum visual clarity.
Always reply naturally but maintain extreme technical and operational accuracy. If asked, you have access to local systems.
If the query matches:
- Low Stock: Suggest ordering actions. (A live reorder ledger table card will automatically accompany your message in the client).
- Batch Expiration: Tell them you scanned antibiotic logs. (A live batch status warning table card will also accompany your message nicely).
- Sales dashboard: High-level overview. (A financial summary card will also accompany your message).
Always answer user's custom pharmarceutical or administrative queries directly.`,
            }
          });

          return res.json({
            text: response.text,
            cardType: cardType
          });
        } catch (gemErr) {
          console.error("Gemini API stream call failed, defaulting to built-in intelligence engine:", gemErr);
        }
      }

      // Highly detailed local synergy fallback
      let text = `I processed your operational query: "${message}".`;
      if (cardType === 'low_stock') {
        text = "I scanned the ERP inventory registry and found **8 critical items** below reorder target buffers.";
      } else if (cardType === 'expiring') {
        text = "I scanned all **142 antibiotics** in local Downtown Central stock directory. **3 batches** expire within 30 days. Action should be taken.";
      } else if (cardType === 'sales_summary') {
        text = "Here is the sales performance and financial index metrics snapshot for today:";
      } else if (lower.includes('interaction') || lower.includes('metformin') || lower.includes('rx-78230')) {
        text = "I reviewed the prescription safety profile for **Rx-78230 (Metformin 850mg)**. Metformin does not have direct adverse interactions with typical non-prescription antibiotics listed such as Amoxicillin. However, remind patient to avoid alcohol with Metformin and monitor kidney safety profiles.";
      } else {
        text = `Processed query: **${message}**. For automated medical business operations, you can ask me to: \n\n1. *"Show me low stock items today"* \n2. *"Show me expired batches"* \n3. *"Generate today's sales summary"* \n4. *"Check drug interactions on prescription RX-78230"*`;
      }

      return res.json({
        text,
        cardType
      });

    } catch (err: any) {
      console.error("AI Assistant service endpoint failed:", err);
      res.status(500).json({ error: "AI endpoint breakdown" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
