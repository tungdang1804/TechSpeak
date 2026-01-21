
import { GoogleGenAI } from "@google/genai";

export const createAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};
