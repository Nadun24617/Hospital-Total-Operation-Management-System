import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface SpecializationSuggestion {
  id: number;
  name: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface SuggestionResult {
  specializations: SpecializationSuggestion[];
  reasoning: string;
  disclaimer: string;
}

const FALLBACK_RESULT: SuggestionResult = {
  specializations: [{ id: 10, name: 'General Medicine', confidence: 'medium' }],
  reasoning:
    'Unable to analyze symptoms at this time. We recommend starting with General Medicine.',
  disclaimer:
    'AI suggestion is temporarily unavailable. A General Medicine doctor can refer you to the right specialist.',
};

const DISCLAIMER =
  'This is an AI-powered suggestion, not a medical diagnosis. Please consult the doctor for proper evaluation.';

@Injectable()
export class AiSuggestionService {
  private readonly logger = new Logger(AiSuggestionService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelName = 'gemini-2.0-flash';

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY', '');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async suggestSpecializations(symptoms: string): Promise<SuggestionResult> {
    const model = this.genAI.getGenerativeModel({ model: this.modelName });

    const prompt = `You are a medical triage assistant for a hospital management system.
Given the patient's symptoms below, suggest which medical specialization(s) they should visit.

AVAILABLE SPECIALIZATIONS (use ONLY these, by exact id and name):
1 - Cardiology
2 - Dermatology
3 - Orthopedics
4 - Pediatrics
5 - Gynecology & Obstetrics
6 - General Surgery
7 - Neurology
8 - Psychiatry
9 - Endocrinology
10 - General Medicine

PATIENT SYMPTOMS: "${symptoms}"

Respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "specializations": [
    { "id": <number>, "name": "<exact name from list>", "confidence": "high" | "medium" | "low" }
  ],
  "reasoning": "<1-2 sentence explanation>"
}

Rules:
- Return 1 to 3 specializations, most relevant first.
- Always include General Medicine (id 10) as the last option if not already included.
- confidence: "high" = strong symptom match, "medium" = possible match, "low" = general fallback.
- Do NOT diagnose. Only suggest which specialist to visit.`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      const cleaned = text
        .replace(/```json?\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      return {
        specializations: parsed.specializations ?? [],
        reasoning: parsed.reasoning ?? '',
        disclaimer: DISCLAIMER,
      };
    } catch (error) {
      this.logger.error('Gemini API call failed', error);
      return FALLBACK_RESULT;
    }
  }
}
