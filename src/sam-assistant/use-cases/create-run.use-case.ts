import OpenAI from "openai";

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openAI: OpenAI, options: Options) => {

  const {threadId, assistantId = 'asst_b7dPZcEQ8dus49cipmzCeDoH'} = options

  const run = await openAI.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions
    
  });
  console.log({ run });
  return run;

}