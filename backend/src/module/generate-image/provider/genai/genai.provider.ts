import { Injectable, Inject, InternalServerErrorException, HttpException, NotFoundException } from "@nestjs/common";
import { GoogleGenAI, Modality, HarmCategory, HarmBlockThreshold, MediaResolution } from "@google/genai";
import { GenerateImageProviderAbstract } from "../../abstract/generate-image-provider.abstract";
import * as fs from "fs";

@Injectable()
export class GenaiProvider implements GenerateImageProviderAbstract {
  constructor(
    @Inject("GOOGLE_CLIENT") private readonly googleClient: GoogleGenAI,
  ) { }

  async createImage(prompt: string) {
    try {
      const response = await this.googleClient.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const candidate = response.candidates?.[0];
      if (!candidate) throw new NotFoundException("Candidate not found")

      const content = candidate.content;
      if (!content?.parts || content?.parts.length === 0) throw new NotFoundException("Content not found")

      for (const part of content.parts) {
        if (part.text) {
        } else if (part.inlineData?.data) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          const fileName = `gemini-naativea-image.png`;
          fs.writeFileSync(fileName, buffer);
        }
      }
    } catch (error) {
      if (error instanceof HttpException) throw error
      console.error("An error ocurred while creating image with prompt", prompt, error)
      throw new InternalServerErrorException("An error ocurred while creating image with prompt")
    }
  }
}