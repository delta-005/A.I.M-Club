
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeApplication = async (application: any) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
        Analyze this student application for the A.I.M. (AI & ML) Club. 
        Role applied for: ${application.role}
        Year of study: ${application.yearOfStudy}
        Responses: ${JSON.stringify(application.answers)}
        
        Provide:
        1. A concise 3-sentence summary of their profile.
        2. A fit score (1-10) overall.
        3. A technical interest score (1-10).
        4. A communication/clarity score (1-10).
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    technicalScore: { type: Type.NUMBER },
                    communicationScore: { type: Type.NUMBER }
                },
                required: ["summary", "score", "technicalScore", "communicationScore"]
            }
        }
    });

    return JSON.parse(response.text || '{"summary": "Failed to analyze.", "score": 0, "technicalScore": 0, "communicationScore": 0}');
};