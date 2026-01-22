import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not found');
      this.genAI = null;
      return;
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  async generateImage(prompt: string, image: string, systemInstruction?: string): Promise<string | null> {
    try {
      if (!this.genAI) {
        throw new Error('Gemini service not initialized');
      }
      
      const imageParts = {
        inlineData: {
          data: image.split(',')[1],
          mimeType: 'image/jpeg',
        },
      };

      const result = await this.model.generateContent([prompt, imageParts]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  }
}
