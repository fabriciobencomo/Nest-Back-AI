import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import {Response} from 'express'
import { GptService } from './gpt.service';
import { OrthographyDto } from './dtos';
import { ProsConsDiscusserDto } from './dtos/pros-cons-discusser.dto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('ortography-check')
  ortographyCheck(
    @Body() orthographyDto: OrthographyDto 
  ) {
    return this.gptService.ortographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsSiscusser (
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto
  ){
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto)
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream (
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response
  ){
    const stream = await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto)
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK)
    for await(const chunk of stream) {
      const piece = chunk.choices[0].delta.content || ''
      res.write(piece)
    }

    res.end()
  }
}
