import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AiSuggestionService } from './ai-suggestion.service';
import { SymptomCheckDto } from './dto/symptom-check.dto';

@Controller('ai-suggestion')
export class AiSuggestionController {
  constructor(private readonly aiSuggestionService: AiSuggestionService) {}

  @Post('check-symptoms')
  @UseGuards(AuthGuard('jwt'))
  async checkSymptoms(@Body() dto: SymptomCheckDto) {
    return this.aiSuggestionService.suggestSpecializations(dto.symptoms);
  }
}
