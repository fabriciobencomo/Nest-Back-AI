/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';

@Injectable()
export class GptService {


  private openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
  })

  async ortographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {prompt: orthographyDto.prompt});
  }

  async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, {prompt: prosConsDiscusserDto.prompt});
  }

  async prosConsDiscusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openai, {prompt: prosConsDiscusserDto.prompt});
  }
}
