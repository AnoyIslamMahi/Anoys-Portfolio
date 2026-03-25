import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an AI assistant for Lazerlit, a creative studio specializing in high-quality design and animation services.
Your goal is to provide helpful, professional, and friendly responses to visitors on the website's live chat.

Key Services of Lazerlit:
1. Graphics & Logo Design: Custom logos, branding, and Fortnite thumbnails.
2. Motion Graphics & Animation: Dynamic intro animations, logo reveals, and high-energy promos.
3. Video Editing & Promo: Professional editing for commercials and social media.
4. Streaming Overlay & Branding: Custom assets for Twitch, YouTube, and Facebook Gaming (overlays, alerts, stingers).

Guidelines:
- Be concise and professional.
- Funnel visitors to Lazerlit's Fiverr profile (https://www.fiverr.com/s/R7Yvg5D) whenever they express interest in starting a project, asking for custom quotes, or looking for a secure platform to hire.
- If a visitor asks about pricing, mention that they can check the packages on Fiverr or leave their details here for a custom quote.
- If they ask for examples, mention the portfolio sections on the website or the live portfolio on Fiverr.
- Always refer to the studio as "Lazerlit".
- If you don't know something, politely ask them to wait for a human admin.
- Keep responses under 3 sentences unless more detail is requested.
`;

export const getAIResponse = async (message: string, history: { role: string, text: string }[] = []) => {
  try {
    let apiKey = process.env.GEMINI_API_KEY;
    
    // Fallback for different environment setups
    if (!apiKey || apiKey === "undefined") {
      apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    }

    if (!apiKey || apiKey === "undefined") {
      console.error("GEMINI_API_KEY is missing or undefined");
      throw new Error("GEMINI_API_KEY is missing");
    }

    console.log("API Key present:", !!apiKey);
    console.log("Attempting AI call with model: gemini-3-flash-preview");
    const ai = new GoogleGenAI({ apiKey });
    
    const formattedHistory = history
      .slice(-10)
      .filter(h => h.text && h.text.trim())
      .map(h => ({ 
        role: h.role === 'visitor' ? 'user' : 'model', 
        parts: [{ text: h.text }] 
      }));

    console.log("Formatted History:", JSON.stringify(formattedHistory));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    return response.text;
  } catch (error: any) {
    console.error("Detailed AI Error:", error);
    if (error.message) console.error("Error Message:", error.message);
    if (error.stack) console.error("Error Stack:", error.stack);
    
    return "I'm sorry, I'm having a bit of trouble connecting right now. A human admin will be with you shortly!";
  }
};
