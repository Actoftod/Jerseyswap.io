import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
      console.error('[GeminiService] API key not found');
      return;
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  private getBase64(dataUrl: string): string {
    return dataUrl.split(',')[1] ?? dataUrl;
  }

  private getMimeType(dataUrl: string): string {
    const match = dataUrl.match(/^data:(image\/\w+);base64,/);
    return match ? match[1] : 'image/png';
  }

  async prepareAthletePlate(imageDataUrl: string): Promise<string> {
    if (!this.ai) return imageDataUrl;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-preview-image-generation',
        contents: [
          {
            parts: [
              { text: 'Optimize this athlete image for jersey swapping: enhance lighting, sharpen details, ensure correct portrait framing. Keep the exact same person and pose. Output a clean high-quality athlete portrait.' },
              { inlineData: { data: this.getBase64(imageDataUrl), mimeType: this.getMimeType(imageDataUrl) } }
            ]
          }
        ],
        config: { responseModalities: ['IMAGE', 'TEXT'] }
      });
      const imagePart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
      if (imagePart?.inlineData?.data) {
        return `data:${imagePart.inlineData.mimeType ?? 'image/png'};base64,${imagePart.inlineData.data}`;
      }
    } catch (err) {
      console.error('[GeminiService] prepareAthletePlate error:', err);
    }
    return imageDataUrl;
  }

  async performJerseySwap(
    imageDataUrl: string,
    teamName: string,
    number: string,
    removeBackground: boolean,
    customPrompt?: string
  ): Promise<string> {
    if (!this.ai) return imageDataUrl;
    try {
      const prompt = customPrompt
        ? `${SYSTEM_INSTRUCTION}\n\nAdditional directive: ${customPrompt}\n\nSwap this athlete into a ${teamName} jersey #${number}.${removeBackground ? ' Remove background, place on clean studio backdrop.' : ''}`
        : `${SYSTEM_INSTRUCTION}\n\nTransform this athlete to wear the official ${teamName} jersey with number #${number}. IDENTITY_LOCK: preserve exact face and body. Ultra-realistic Nike x Apple aesthetic.${removeBackground ? ' Remove background entirely, pure studio environment.' : ''}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-preview-image-generation',
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { data: this.getBase64(imageDataUrl), mimeType: this.getMimeType(imageDataUrl) } }
            ]
          }
        ],
        config: { responseModalities: ['IMAGE', 'TEXT'] }
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
      if (imagePart?.inlineData?.data) {
        return `data:${imagePart.inlineData.mimeType ?? 'image/png'};base64,${imagePart.inlineData.data}`;
      }
    } catch (err) {
      console.error('[GeminiService] performJerseySwap error:', err);
    }
    return imageDataUrl;
  }

  async performGenerativeEdit(
    imageDataUrl: string,
    prompt: string,
    tool: string,
    maskDataUrl?: string
  ): Promise<string> {
    if (!this.ai) return imageDataUrl;
    try {
      const parts: any[] = [
        { text: `${SYSTEM_INSTRUCTION}\n\nTool: ${tool.toUpperCase()}\nDirective: ${prompt}` },
        { inlineData: { data: this.getBase64(imageDataUrl), mimeType: this.getMimeType(imageDataUrl) } }
      ];
      if (maskDataUrl) {
        parts.push({ inlineData: { data: this.getBase64(maskDataUrl), mimeType: 'image/png' } });
        parts[0] = { text: `${parts[0].text}\nApply edit ONLY to white regions of the provided mask.` };
      }

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash-preview-image-generation',
        contents: [{ parts }],
        config: { responseModalities: ['IMAGE', 'TEXT'] }
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
      if (imagePart?.inlineData?.data) {
        return `data:${imagePart.inlineData.mimeType ?? 'image/png'};base64,${imagePart.inlineData.data}`;
      }
    } catch (err) {
      console.error('[GeminiService] performGenerativeEdit error:', err);
    }
    return imageDataUrl;
  }

  async performFlashImageEdit(imageDataUrl: string, prompt: string): Promise<string> {
    return this.performGenerativeEdit(imageDataUrl, prompt, 'flash');
  }

  async generatePlayerStats(teamName: string): Promise<any> {
    if (!this.ai) return this.defaultStats(teamName);
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ parts: [{ text: `Generate realistic player stats and profile for a ${teamName} athlete. Return ONLY valid JSON: { "name": string, "team": string, "number": string, "background": string, "highlights": string[], "stats": { [key: string]: number } }` }] }]
      });
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch (err) {
      console.error('[GeminiService] generatePlayerStats error:', err);
    }
    return this.defaultStats(teamName);
  }

  private defaultStats(teamName: string) {
    return {
      name: 'ELITE ATHLETE',
      team: teamName,
      number: '23',
      background: `Standout performer for ${teamName} with exceptional athleticism and leadership on the field.`,
      highlights: ['All-Pro Selection', 'Championship Run', 'Record Breaker', 'Team Captain'],
      stats: { SPD: 94, STR: 88, AGI: 91, AWR: 87, OVR: 90 }
    };
  }

  async queryScoutMode(query: string): Promise<{ text: string; sources: { uri: string; title: string }[] }> {
    if (!this.ai) return { text: 'Scout mode offline. API key required.', sources: [] };
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ parts: [{ text: `You are a sports intelligence scout. Answer this query with verified sports data: ${query}` }] }],
        config: { tools: [{ googleSearch: {} }] } as any
      });
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No data found.';
      const groundingMetadata = (response.candidates?.[0] as any)?.groundingMetadata;
      const sources = (groundingMetadata?.groundingChunks ?? []).map((chunk: any) => ({
        uri: chunk.web?.uri ?? '',
        title: chunk.web?.title ?? 'Source'
      })).filter((s: any) => s.uri);
      return { text, sources };
    } catch (err) {
      console.error('[GeminiService] queryScoutMode error:', err);
      return { text: 'Neural downlink error. Please retry.', sources: [] };
    }
  }

  async queryCoachMode(query: string): Promise<{ text: string; suggestions: string[] }> {
    if (!this.ai) return { text: 'Coach mode offline. API key required.', suggestions: [] };
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{
          parts: [{
            text: `You are an elite sports design coach with expertise in kit design, color theory, and athlete branding. 
Answer this design question with expert advice and end with 3 brief follow-up suggestion labels (max 5 words each) as JSON array.
Format: {"response": "...", "suggestions": ["...", "...", "..."]}
Question: ${query}`
          }]
        }]
      });
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return { text: parsed.response ?? text, suggestions: parsed.suggestions ?? [] };
      }
      return { text, suggestions: [] };
    } catch (err) {
      console.error('[GeminiService] queryCoachMode error:', err);
      return { text: 'Neural downlink interrupted.', suggestions: [] };
    }
  }

  async generateNeuralBio(name: string, role: string, keywords: string[]): Promise<string> {
    if (!this.ai) return 'Neural architecture finalized. Athlete profile locked.';
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{
          parts: [{
            text: `Write a 2-sentence elite athlete/designer bio for ${name}. Role: ${role}. Style traits: ${keywords.join(', ')}. Use a cinematic, high-performance sports brand tone. No hashtags.`
          }]
        }]
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? 'Neural architecture finalized.';
    } catch (err) {
      console.error('[GeminiService] generateNeuralBio error:', err);
      return 'Neural architecture finalized. Legacy protocol active.';
    }
  }
}
