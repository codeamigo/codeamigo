const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY_SECRET,
});
const openai = new OpenAIApi(configuration);

export const complete = async (prompt: string) => {
  var startTime = performance.now();
  const response = await openai.createCompletion({
    frequency_penalty: 0,
    max_tokens: 12,
    model: 'code-davinci-002',
    presence_penalty: 0,
    prompt,
    temperature: 0,
    top_p: 1,
  });
  var endTime = performance.now();
  console.log(
    'OpenAI API call took ' + (endTime - startTime) + ' milliseconds.'
  );

  return response;
};
