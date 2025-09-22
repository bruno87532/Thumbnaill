import { Injectable, Inject, InternalServerErrorException, HttpException, NotFoundException } from "@nestjs/common";
import { GoogleGenAI, Modality, HarmCategory, HarmBlockThreshold, Content } from "@google/genai";
import { GenerateImageProviderAbstract } from "../../abstract/generate-image-provider.abstract";
import * as fs from "fs";

@Injectable()
export class GenaiProvider implements GenerateImageProviderAbstract {
  constructor(
    @Inject("GOOGLE_CLIENT") private readonly googleClient: GoogleGenAI,
  ) { }

  async createImage(
    prompt: string,
    categories: {
      category: HarmCategory,
      threshold: HarmBlockThreshold
    }[],
    inlineData: {
      mimeType: "image/png" | "image/jpeg" | "image/webp",
      data: string
    }[]
  ) {
    try {
      const response = await this.googleClient.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              ...inlineData.map((img) => ({
                inlineData: {
                  mimeType: img.mimeType,
                  data: img.data
                }
              }))
            ],
          },
        ] as Content, 
        config: {
          responseModalities: ["IMAGE", "TEXT"],
          safetySettings: [
            ...categories
          ]
        }
      });

      const candidate = response.candidates?.[0];
      if (!candidate) throw new NotFoundException("Candidate not found")

      const content = candidate.content;
      if (!content?.parts || content?.parts.length === 0) throw new NotFoundException("Content not found")

      for (const part of content.parts) {
        if (part.text) {
          console.log(part.text)
        } else if (part.inlineData?.data) {
          console.log("salvando")
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