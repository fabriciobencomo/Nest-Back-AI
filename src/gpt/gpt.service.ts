/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';
import { OrthographyDto } from './dtos/orthography.dto';

@Injectable()
export class GptService {
  async ortographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase({prompt: orthographyDto.prompt});
  }
}
