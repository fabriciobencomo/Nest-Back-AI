import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import {diskStorage} from 'multer'
import {Response} from 'express'
import { GptService } from './gpt.service';
import { AudioToTextDto, OrthographyDto, TextToAudioDto, TranslateDto } from './dtos';
import { ProsConsDiscusserDto } from './dtos/pros-cons-discusser.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`
          return callback(null, fileName)
        }
      }) 
    })
  )
  async  audioToText (
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({maxSize: 1000 * 1024 * 5, message: 'file is Bigger than 5MB'}),
          new FileTypeValidator({fileType: 'audio/*'})
        ]
      })
    ) file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto
  ){

    return this.gptService.audioToText(file, audioToTextDto)
  }

}


