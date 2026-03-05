import { Module } from '@nestjs/common';

import { AiSuggestionController } from './ai-suggestion.controller';
import { AiSuggestionService } from './ai-suggestion.service';

@Module({
  controllers: [AiSuggestionController],
  providers: [AiSuggestionService],
})
export class AiSuggestionModule {}
