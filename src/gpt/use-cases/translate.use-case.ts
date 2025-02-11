/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async(openai:OpenAI, options: Options) => {

  const {prompt, lang} = options

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: `
          Traduce el siguiente texto al idioma ${lang}:${ prompt }
           ` 
        },
    ],
    temperature: 0.3,
    max_tokens: 250,
    });

  const content = completion.choices[0].message.content;
  if (content === null) {
    throw new Error("Completion content is null");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    content
  }
}