/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';
import { OrthographyDto } from './dtos/orthography.dto';
import OpenAI from 'openai';

@Injectable()
export class GptService {


  private openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
  })

  async ortographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {prompt: orthographyDto.prompt});
  }
}
