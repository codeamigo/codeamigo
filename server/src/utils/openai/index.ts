const { Configuration, OpenAIApi } = require('openai');

export const complete = async (
  prompt: string,
  suffix: string,
  apiKey: string
) => {
  const configuration = new Configuration({
    apiKey: apiKey || process.env.OPENAI_API_KEY_SECRET,
  });
  const openai = new OpenAIApi(configuration);

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

export const explain = async (prompt: string, apiKey: string) => {
  const configuration = new Configuration({
    apiKey: apiKey || process.env.OPENAI_API_KEY_SECRET,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    frequency_penalty: 0,
    max_tokens: 100,
    model: 'text-davinci-003',
    n: 1,
    presence_penalty: 0,
    prompt,
    // eslint-disable-next-line
    stop: ["\"\"\""],
    temperature: 0,
    top_p: 1,
  });

  return response;
};
