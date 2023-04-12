const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY_SECRET,
});
const openai = new OpenAIApi(configuration);

export const complete = async (prompt: string, suffix: string) => {
  const response = await openai.createCompletion({
    frequency_penalty: 0,
    max_tokens: 5,
    model: 'text-davinci-003',
    n: 1,
    presence_penalty: 0,
    prompt,
    suffix,
    temperature: 1,
    top_p: 1,
  });

  return response;
};
