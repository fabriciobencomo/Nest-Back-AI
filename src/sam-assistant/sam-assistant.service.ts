import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { checkCompleteStatusUseCase, createMessageUseCase, CreateThreadUseCase } from './use-cases';
import { QuestionDto } from './dtos/question.dto';
import { createRunUseCase } from './use-cases/create-run.use-case';

@Injectable()
export class SamAssistantService {

    private openai = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY
    })

    async createThread() {
      return CreateThreadUseCase(this.openai)
    }

    async userQuestion(questionDto: QuestionDto) {
      const { threadId, question } = questionDto
      const message = await createMessageUseCase(this.openai, {threadId, question})

      const run = await createRunUseCase(this.openai, {threadId, assistantId:"asst_b7dPZcEQ8dus49cipmzCeDoH"})

      await checkCompleteStatusUseCase(this.openai, {threadId, runId: run.id})
    
    }
    
}
