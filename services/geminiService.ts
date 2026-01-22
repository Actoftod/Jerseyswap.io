import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
      console.error('Gemini API key not found or empty');
      this.genAI = null;
      return;
    }
    
    // Basic format validation for Google API keys
    if (!apiKey.startsWith('AI') || apiKey.length < 20) {
      console.error('Gemini API key appears to be invalid (should start with "AI" and be at least 20 characters)');
      this.genAI = null;
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  async prepareAthletePlate(image: string): Promise<string> {
    // For now, return the image as-is (placeholder implementation)
    // In production, this would process/optimize the image
    return image;
  }

  async performJerseySwap(
    image: string,
    teamName: string,
    number: string,
    removeBackground: boolean,
    customPrompt?: string
  ): Promise<string> {
    try {
      if (!this.genAI) {
        throw new Error('Gemini service not initialized');
      }

      const prompt = customPrompt || `Transform this athlete image to wear a ${teamName} jersey with number ${number}. ${removeBackground ? 'Remove the background.' : ''} Make it look professional and realistic.`;
      
      const imageParts = {
        inlineData: {
          data: image.split(',')[1],
          mimeType: 'image/jpeg',
        },
      };

      const result = await this.model.generateContent([prompt, imageParts]);
      const response = await result.response;
      const text = response.text();
      
      // For now, return original image as AI image generation isn't directly supported
      // In production, you'd need to use appropriate image generation API
      return image;
    } catch (error) {
      console.error('Error performing jersey swap:', error);
      return image;
    }
  }

  async generatePlayerStats(teamName: string): Promise<any> {
    try {
      if (!this.genAI) {
        throw new Error('Gemini service not initialized');
      }

      const prompt = `Generate realistic player statistics and background story for a ${teamName} player. Return as JSON with fields: background (string), highlights (array of strings), stats (object with keys like games, points, assists, etc.)`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response or return default stats
      try {
        return JSON.parse(text);
      } catch {
        return {
          background: `Elite athlete representing ${teamName}`,
          highlights: ['Team Leader', 'All-Star Selection', 'Championship Run'],
          stats: { games: 82, points: 24.5, assists: 7.2, rebounds: 5.8 }
        };
      }
    } catch (error) {
      console.error('Error generating player stats:', error);
      return {
        background: `Professional athlete for ${teamName}`,
        highlights: ['Strong Performance', 'Team Player'],
        stats: { games: 70, points: 18.0, assists: 5.0 }
      };
    }
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
