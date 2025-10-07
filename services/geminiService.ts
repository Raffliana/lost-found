
import { GoogleGenAI } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  
  const base64EncodedData = await base64EncodedDataPromise;

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const generateDescriptionWithGemini = async (title: string, imageFile: File | null): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return Promise.resolve(`AI suggestion could not be generated. This is a great opportunity to write a detailed description for: ${title}`);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const model = 'gemini-2.5-flash';
  const prompt = `Based on the title "${title}" and the provided image, write a detailed and friendly description for a lost and found post at a university. Be descriptive and helpful. Mention key visual details. Keep it concise, around 2-4 sentences.`;
  
  try {
    // FIX: Conditionally construct the `parts` array to ensure correct type inference for multimodal content.
    // This avoids the error when adding an image part to an array initially inferred as text-only.
    let parts;
    if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        parts = [imagePart, { text: prompt }];
    } else {
        parts = [{ text: prompt }];
    }
    
    const response = await ai.models.generateContent({
        model,
        contents: { parts }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return `Error generating description. Please write one manually for: ${title}`;
  }
};