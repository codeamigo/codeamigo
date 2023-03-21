const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY_SECRET,
});
const openai = new OpenAIApi(configuration);

export const complete = async (prompt: string, suffix: string) => {
  var startTime = performance.now();
  const response = await openai.createCompletion({
    frequency_penalty: 0,
    max_tokens: 60,
    model: 'text-davinci-003',
    presence_penalty: 0,
    prompt,
    stop: [';'],
    suffix,
    temperature: 0,
    top_p: 1,
  });
  var endTime = performance.now();
  console.log(
    'OpenAI API call took ' + (endTime - startTime) + ' milliseconds.'
  );

  return response;
};
