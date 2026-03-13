import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { getCachedSwap, setCachedSwap, buildSwapCacheKey } from "./storageService";

export class GeminiService {
  private getAI() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("JERSEYSWAP_CRITICAL: API_KEY is undefined.");
    }
    return new GoogleGenAI({ apiKey: apiKey || "" });
  }

  // ─── Text-only helpers ────────────────────────────────────────────────────

  async generateNeuralBio(name: string, role: string, keywords: string[]): Promise<string> {
    const ai = this.getAI();
    const prompt = `Generate a short, high-energy "Scouting Report" style bio for a ${role} named ${name}. 
    Use these keywords as the vibe: ${keywords.join(", ")}. 
    Keep it under 50 words. Focus on "legacy," "neural dominance," and "next-gen impact."`;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite sports brand copywriter for Nike and EA Sports.",
          temperature: 0.8,
        },
      });
      return response.text || "Neural bio synthesis complete.";
    } catch (err) {
      console.error(err);
      return `A dominant force in the ${role} arena, ${name} is defined by ${keywords.join(" and ")}.`;
    }
  }

  async queryScoutMode(query: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: query,
      config: { tools: [{ googleSearch: {} }] },
    });
    const sources =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => {
          if (chunk.web) return { uri: chunk.web.uri, title: chunk.web.title };
          return null;
        })
        .filter(Boolean) || [];
    return { text: response.text || "No intelligence found.", sources };
  }

  async queryCoachMode(query: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `User design advice: ${query}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["text", "suggestions"],
        },
      },
    });
    return JSON.parse(
      response.text || '{"text":"Neural error.","suggestions":[]}'
    );
  }

  async generatePlayerStats(teamName: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate scouting background and stats for ${teamName}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            background: { type: Type.STRING },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            stats: {
              type: Type.OBJECT,
              properties: {
                SPD: { type: Type.NUMBER },
                ACC: { type: Type.NUMBER },
                STR: { type: Type.NUMBER },
                AWR: { type: Type.NUMBER },
                AGI: { type: Type.NUMBER },
                OVR: { type: Type.NUMBER },
              },
            },
          },
          required: ["background", "highlights", "stats"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  }

  // ─── Image-in / Image-out helpers ─────────────────────────────────────────

  /** Quick flash edit — no masking, prompt-only */
  async performFlashImageEdit(base64Image: string, prompt: string): Promise<string> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
                mimeType: "image/jpeg",
              },
            },
            {
              text: `Apply this edit to the image: ${prompt}. Maintain athlete identity and Nike/Apple design aesthetics.`,
            },
          ],
        },
        config: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData
      );
      return part
        ? `data:image/png;base64,${part.inlineData!.data}`
        : base64Image;
    } catch (error) {
      console.error("Flash Image Edit failed:", error);
      throw error;
    }
  }

  /** Pre-process / normalise the athlete photo before a swap */
  async prepareAthletePlate(base64Image: string): Promise<string> {
    const prompt = `NEURAL PRE-PROCESSING: Analyze this image. Identify the athlete. 
Face must remain 100% identical. Ensure the image is optimised for a design swap 
while preserving the original environment.`;
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
                mimeType: "image/jpeg",
              },
            },
            { text: prompt },
          ],
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseModalities: ["TEXT", "IMAGE"],
        },
      });
      const part = response.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData
      );
      return part
        ? `data:image/png;base64,${part.inlineData!.data}`
        : base64Image;
    } catch (error) {
      console.error("Preparation failed:", error);
      return base64Image;
    }
  }

  /** Core jersey swap — checks prompt cache first */
  async performJerseySwap(
    base64Image: string,
    teamName: string,
    number: string,
    removeBackground = false,
    customPrompt = ""
  ): Promise<string> {
    const cacheKey = buildSwapCacheKey(teamName, number, removeBackground, customPrompt);
    const cached = getCachedSwap(cacheKey);
    if (cached) return cached;

    const bgInstruction = removeBackground
      ? "Isolate the athlete and place them on a clean, professional stadium or studio background."
      : "Preserve the original background exactly as it is.";
    const designAdditions = customPrompt
      ? ` Additional design directive: ${customPrompt}.`
      : "";
    const prompt = `IDENTITY LOCK PROTOCOL: Replace clothing with official ${teamName} uniform (Number ${number}). Photorealistic 8K render. ${bgInstruction}${designAdditions}`;
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
                mimeType: "image/jpeg",
              },
            },
            { text: prompt },
          ],
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseModalities: ["TEXT", "IMAGE"],
        },
      });
      const part = response.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData
      );
      const result = part ? `data:image/png;base64,${part.inlineData!.data}` : "";
      if (result) setCachedSwap(cacheKey, result);
      return result;
    } catch (error) {
      console.error("Swap failed:", error);
      throw error;
    }
  }

  /** Masked generative edit (fill, bg replace, lighting, erase) */
  async performGenerativeEdit(
    base64Image: string,
    prompt: string,
    tool: "fill" | "bg" | "lighting" | "erase",
    maskBase64?: string
  ): Promise<string> {
    const fullPrompt = `Generative Edit (${tool}): ${prompt}.${maskBase64 ? " The second image is a mask indicating the region to edit." : ""}`;
    const ai = this.getAI();
    try {
      const parts: any[] = [
        {
          inlineData: {
            data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
            mimeType: "image/jpeg",
          },
        },
      ];
      if (maskBase64) {
        parts.push({
          inlineData: {
            data: maskBase64.replace(/^data:image\/\w+;base64,/, ""),
            mimeType: "image/png",
          },
        });
      }
      parts.push({ text: fullPrompt });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseModalities: ["TEXT", "IMAGE"],
        },
      });
      const part = response.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData
      );
      return part ? `data:image/png;base64,${part.inlineData!.data}` : "";
    } catch (error) {
      console.error("Generative Edit failed:", error);
      throw error;
    }
  }

  /** Query live trade rumors and suggest destination-team jersey swaps */
  async queryTradeRumors(playerOrTeam: string): Promise<{
    rumors: Array<{ player: string; fromTeam: string; toTeam: string; likelihood: string; summary: string }>;
    suggestedSwapTeam: string | null;
    analysis: string;
  }> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Current NFL/NBA/MLB trade rumors and contract news for: ${playerOrTeam}. List the top rumors, likely destinations, and suggest which team jersey they should be swapped into for a JerseySwap.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rumors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  player:      { type: Type.STRING },
                  fromTeam:    { type: Type.STRING },
                  toTeam:      { type: Type.STRING },
                  likelihood:  { type: Type.STRING },
                  summary:     { type: Type.STRING },
                },
                required: ["player", "fromTeam", "toTeam", "likelihood", "summary"],
              },
            },
            suggestedSwapTeam: { type: Type.STRING },
            analysis:          { type: Type.STRING },
          },
          required: ["rumors", "suggestedSwapTeam", "analysis"],
        },
      },
    });
    try {
      return JSON.parse(response.text || "{}");
    } catch {
      return { rumors: [], suggestedSwapTeam: null, analysis: "No trade intel found." };
    }
  }

  /** Analyze a swap image and return a Brand Score breakdown */
  async queryBrandScore(base64Image: string): Promise<{
    overall: number;
    lighting: number;
    logoPlacement: number;
    colorAccuracy: number;
    fabricRealism: number;
    verdict: string;
    tips: string[];
  }> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
                mimeType: "image/jpeg",
              },
            },
            {
              text: `You are a professional sports apparel brand director. Analyze this jersey swap image and return a Brand Score JSON. Score each dimension 0-100. Be honest and specific about what to improve.`,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overall:       { type: Type.NUMBER },
              lighting:      { type: Type.NUMBER },
              logoPlacement: { type: Type.NUMBER },
              colorAccuracy: { type: Type.NUMBER },
              fabricRealism: { type: Type.NUMBER },
              verdict:       { type: Type.STRING },
              tips:          { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["overall", "lighting", "logoPlacement", "colorAccuracy", "fabricRealism", "verdict", "tips"],
          },
        },
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Brand score failed:", error);
      return { overall: 0, lighting: 0, logoPlacement: 0, colorAccuracy: 0, fabricRealism: 0, verdict: "Analysis failed.", tips: [] };
    }
  }

  /** Generate a new image purely from a text prompt (no source image required) */
  async generateImageFromPrompt(prompt: string): Promise<string> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: { parts: [{ text: prompt }] },
        config: { responseModalities: ["TEXT", "IMAGE"] },
      });
      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (!part?.inlineData?.data) throw new Error("No image returned");
      return `data:image/png;base64,${part.inlineData.data}`;
    } catch (error) {
      console.error("generateImageFromPrompt failed:", error);
      throw error;
    }
  }
}
