import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import { translateUseCase } from './use-cases/translate.use-case';
import { TextToAudioDto } from './dtos/text-to-audio.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GptService {


  private openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
  })

  async ortographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {prompt: orthographyDto.prompt});
  }

  async translate(translateDto: TranslateDto) {
    return await translateUseCase(this.openai, {prompt: translateDto.prompt, lang: translateDto.lang });
  }

  async textToAudio(textToAudioDtoDto: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, {prompt: textToAudioDtoDto.prompt, voice: textToAudioDtoDto.voice });
  }

  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios/',
      `${fileId}.mp3`,
    );

    const wasFound = fs.existsSync(filePath);

    if (!wasFound) throw new NotFoundException(`File ${fileId} not found`);

    return filePath;
  }


  async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, {prompt: prosConsDiscusserDto.prompt});
  }

  async prosConsDiscusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openai, {prompt: prosConsDiscusserDto.prompt});
  }
}
