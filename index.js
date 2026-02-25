  import "dotenv/config";
  import express from "express";
  import cors from "cors";
  import mongoose from "mongoose";
  import { GoogleGenAI } from "@google/genai";
import authRoutes from "./routes/authRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";


  const app = express();
  app.use(cors());
  app.use(express.json());

app.use("/api/auth", authRoutes);
console.log("MONGO_URL:", process.env.MONGO_URL);
  // ✅ MongoDB
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB error:", err));

  // ✅ Gemini
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY, // 🔥 keep in .env
  });

  // ✅ Itinerary API
  app.post("/api/itinerary", verifyToken,async (req, res) => {
    try {
      const { destination, startDate, endDate, budget, from } = req.body;

      if (!destination || !startDate || !endDate || !budget || !from) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const prompt = `
  You are a travel planner API.

  Return ONLY valid JSON. No markdown. No explanation. No text outside JSON.

  Use EXACTLY this structure:

  {
    "trip_name": "",
    "dates": "",
    "origin": "",
    "destination": "",
    "total_budget_inr": 0,
    "background_image_url": "",
    "budget_breakdown": {
      "travel": "",
      "accommodation": "",
      "food": "",
      "local_transport": "",
      "activities": "",
      "contingency": "",
      "total_calculated": ""
    },
    "recommended_hotel_option_budget": {
      "name": "",
      "location": "",
      "price_range_per_night": "",
      "amenities": ""
    },
    "recommended_travel": {
      "bus": {
        "mode": "",
        "duration": "",
        "price_range": "",
        "why_recommended": ""
      },
      "train": {
        "mode": "",
        "duration": "",
        "price_range": "",
        "why_recommended": ""
      }
    },
    "itinerary": [
      {
        "date": "",
        "day": "",
        "theme": "",
        "activities": [],
        "meals": {
          "breakfast": "",
          "lunch": "",
          "dinner": ""
        },
        "accommodation": "",
        "transport": ""
      }
    ],
    "important_notes": []
  }

  Now generate itinerary for:
  Destination: ${destination}
  From: ${from}
  Dates: ${startDate} to ${endDate}
  Budget: ${budget} INR

  Fill realistic values and multiple days in itinerary array.
  `;

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = result.text.trim();

      const json = JSON.parse(text); // 🔥 because prompt forces pure JSON

      res.json(json);
    } catch (err) {
      console.error("SERVER ERROR:", err);
      res.status(500).json({
        error: "Itinerary generation failed",
        details: err.message,
      });
    }
  });

  const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
