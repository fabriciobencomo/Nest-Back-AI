/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';

interface Options {
  prompt: string;
  voice: string;
}

export const textToAudioUseCase = async(openai:OpenAI, options: Options) => {

  const {prompt, voice} = options

  const voices = {
    'alloy': 'alloy',
    'ash': 'ash',
    'coral': 'coral',
    'echo': 'echo',
    'fable': 'fable',
    'onyx': 'onyx',
    'nova': 'nova',
    'sage': 'sage',
    'shimmer': 'shimmer',
  }

  const selectedVoice = voices[voice] ?? 'nova'
  
  const folderPath = path.resolve(__dirname, '../../../generated/audios/')

  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`)

  fs.mkdirSync(folderPath, {recursive: true})

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3'
  })

  const buffer = Buffer.from(await mp3.arrayBuffer());

  fs.writeFileSync(speechFile, buffer)

  return {speechFile}

  return {
    prompt,
    selectedVoice
  }



  // const completion = await openai.chat.completions.create({
  //   model: "gpt-4o-mini",
  //   messages: [
  //       { role: "system", content: `
  //         Te serán proveídos texto con posibles errores orográficos y gramaticales, Debes de responder en formato JSON, 
  //         Tu tarea es corregirlos y retornar información, soluciones, también debes de dar un porcentaje de acierto por
  //          el usuario, si no hay errores, debes de retornar un mensaje de felicitaciones
  //          Ejemplo de Salida:
  //          {
  //           userScore: number,
  //           errors: string[], // ['error -> solución']
  //           message: string, Usa emojis y texto para felicitar
  //          }
  //          ` },
  //       {
  //           role: "user",
  //           content: prompt,
  //       },
  //   ],
  //   temperature: 0.3,
  //   max_tokens: 150,
  //   response_format: {
  //     type: 'json_object'
  //   }
  //   });

  // const content = completion.choices[0].message.content;
  // if (content === null) {
  //   throw new Error("Completion content is null");
  // }
  // const jsonResp = JSON.parse(content);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  // return {
  //   ...jsonResp
  // }
}