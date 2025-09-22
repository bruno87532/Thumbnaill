import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { OpenAIModule } from './providers/openai/openai.module'; 

@Module({
  imports: [OpenAIModule], 
  providers: [AiService],
  exports: [AiService]
})
export class AiModule {}
