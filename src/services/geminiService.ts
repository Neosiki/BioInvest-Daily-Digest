import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function fetchCuratedNews(): Promise<NewsItem[]> {
  const prompt = `
    You are an expert AI curator for global healthcare, pharma, and biotech investment news.
    Search for the latest, most impactful global news in these sectors.
    Select exactly 10 top news items based on investment importance.
    
    Weighting criteria:
    - High: Clinical trial results (Phase 2/3), FDA/EMA approvals
    - Medium: Large M&A, partnerships, large funding
    - Normal: Innovative tech (gene editing, AI drug discovery), indication expansion
    
    For each news item, provide:
    - category: "Clinical", "FDA/EMA", "M&A", "Innovation", or "Other"
    - weight: "High", "Medium", or "Normal"
    - titleKr: Title in Korean
    - titleEn: Title in English
    - summaryKr: Summary in Korean (2-3 sentences)
    - summaryEn: Summary in English (2-3 sentences)
    - investmentPointsKr: 2-3 key investment points in Korean
    - investmentPointsEn: 2-3 key investment points in English
    - sentimentScore: Market sentiment score from 0 to 100 (0 = very negative, 100 = very positive)
    - url: A valid source URL (make sure it's a real URL if possible, or a highly likely one)
    - date: YYYY-MM-DD format
    - expertQuote: An object containing a highly professional quote from an authoritative figure (e.g., a renowned scientist, biotech investor, or industry expert) that adds credibility and insight to the news. Include "quote" (the quote text in Korean), "author" (the name of the person), and "title" (their title or affiliation).
    
    IMPORTANT: You MUST return the result ONLY as a valid JSON array of objects. Do not include any other text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    let text = response.text || "";
    // Extract JSON from markdown if present
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      text = jsonMatch[1];
    }
    
    const news: NewsItem[] = JSON.parse(text);
    return news;
  } catch (error) {
    console.error("Error fetching news from Gemini:", error);
    throw error;
  }
}
