import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load biến môi trường từ .env
dotenv.config();

const app = express();
const PORT = 3000;

// Đoạn mã này để thay thế __dirname trong ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, "./index.html")));

// API Key cho OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Route GET / (Trang chủ)
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "./index.html"));
// });

// Endpoint proxy POST /chatbot
app.post("/chatbot", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message không hợp lệ" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 100,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Đã có lỗi xảy ra từ API OpenAI",
      });
    }

    res.json({ reply: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
