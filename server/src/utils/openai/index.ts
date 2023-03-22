const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY_SECRET,
});
const openai = new OpenAIApi(configuration);

const numChoices = 2;
const stopSequences = Array.from(
  { length: numChoices },
  (_, i) => `<|endoftext${i + 1}|>`
);

export const complete = async (prompt: string, suffix: string) => {
  var startTime = performance.now();
  const response = await openai.createCompletion({
    frequency_penalty: 0,
    max_tokens: 5,
    model: 'text-davinci-003',
    n: numChoices,
    presence_penalty: 0,
    prompt,
    stop: stopSequences,
    suffix,
    temperature: 1,
    top_p: 1,
  });
  var endTime = performance.now();
  console.log(
    'OpenAI API call took ' + (endTime - startTime) + ' milliseconds.'
  );

  return response;
};
