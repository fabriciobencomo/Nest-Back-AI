import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async(openai:OpenAI, options: Options) => {

  const {prompt} = options

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: `
          Te serán proveídos texto con posibles errores orográficos y gramaticales, Debes de responder en formato JSON, 
          Tu tarea es corregirlos y retornar información, soluciones, también debes de dar un porcentaje de acierto por
           el usuario, si no hay errores, debes de retornar un mensaje de felicitaciones
           Ejemplo de Salida:
           {
            userScore: number,
            errors: string[], // ['error -> solución']
            message: string, Usa emojis y texto para felicitar
           }
           ` },
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature: 0.3,
    max_tokens: 150
    });

  return completion.choices[0].message;

  return {
    prompt,
    apiKey: process.env.OPEN_AI_KEY
  }
}