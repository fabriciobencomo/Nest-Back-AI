import OpenAI from 'openai';

export const CreateThreadUseCase = async (openAI: OpenAI) => {
  const thread = await openAI.beta.threads.create()
  console.log({ thread })
  return thread
}