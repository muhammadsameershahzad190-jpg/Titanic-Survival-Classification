
import { GoogleGenAI, Type } from "@google/genai";
import { Passenger, PredictionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeTitanicData = async (sampleData: Passenger[]) => {
  const model = "gemini-3-pro-preview";
  const prompt = `Analyze this subset of the Titanic passenger dataset and provide key insights:
  ${JSON.stringify(sampleData.slice(0, 20))}
  
  Please provide:
  1. A summary of the most influential factors for survival.
  2. Interesting patterns between age, class, and survival.
  3. A technical suggestion for preprocessing this specific data for a Random Forest classifier.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  return response.text;
};

export const predictSurvival = async (passenger: Partial<Passenger>): Promise<PredictionResult> => {
  const model = "gemini-3-pro-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Based on historical Titanic data patterns, predict if this passenger would survive.
    Passenger Details:
    Class: ${passenger.Pclass}
    Sex: ${passenger.Sex}
    Age: ${passenger.Age}
    Fare: ${passenger.Fare}
    SibSp (Siblings/Spouses): ${passenger.SibSp}
    Parch (Parents/Children): ${passenger.Parch}
    
    Provide your response in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          survived: { type: Type.BOOLEAN, description: "Whether the passenger is predicted to survive." },
          probability: { type: Type.NUMBER, description: "Confidence score between 0 and 1." },
          reasoning: { type: Type.STRING, description: "Detailed explanation based on historical data." },
          keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Most important factors for this prediction." }
        },
        required: ["survived", "probability", "reasoning", "keyFeatures"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
