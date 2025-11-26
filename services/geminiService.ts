import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY || ''; // In a real app, strict handling.
  if (!apiKey) {
    console.warn("API Key not found in env");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a holiday greeting based on member details.
 */
export const generateHolidayGreeting = async (
  name: string,
  highlights: { category: string; text: string }[],
  tone: 'funny' | 'sincere' | 'poetic' = 'sincere'
): Promise<string> => {
  try {
    const ai = getAIClient();
    
    const highlightsText = highlights.map(h => `${h.category}: ${h.text}`).join('; ');
    
    const prompt = `Write a short (max 2 sentences) holiday greeting card message from ${name}. 
    Tone: ${tone}.
    incorporate these life updates if possible: ${highlightsText}.
    Make it sound natural and cozy.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Happy Holidays!";
  } catch (error) {
    console.error("Gemini Greeting Error:", error);
    return "Wishing you joy and peace this holiday season!";
  }
};

/**
 * Generates an image description or placeholder logic.
 * Per instructions, we use gemini-2.5-flash-image for generation.
 */
export const generateMemberImage = async (prompt: string): Promise<string> => {
  try {
    const ai = getAIClient();
    
    const fullPrompt = `A cozy, festive holiday portrait of ${prompt}. Digital art style, warm lighting, soft bokeh background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: fullPrompt,
      config: {
        imageConfig: {
           aspectRatio: "3:4"
        }
      }
    });

    // Extract image from parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data returned");

  } catch (error) {
    console.error("Gemini Image Error:", error);
    // Fallback to random picsum if AI fails (or no key provided)
    return `https://picsum.photos/seed/${Math.random()}/400/600`;
  }
};