import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import {Response} from 'express'
import { GptService } from './gpt.service';
import { OrthographyDto, TextToAudioDto, TranslateDto } from './dtos';
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

  @Post('traducciones')
  translate (
    @Body() translateDto: TranslateDto
  ){
    return this.gptService.translate(translateDto)
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    const filePath = await this.gptService.textToAudioGetter(fileId);

    res.setHeader('Content-Type','audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);

  }

  @Post('text-to-audio')
  async  textToAudio (
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ){
    const filePath = await this.gptService.textToAudio(textToAudioDto)
    res.setHeader('Content-Type','audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath.speechFile ?? '');
  }

}


