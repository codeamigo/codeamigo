const { Configuration, OpenAIApi } = require('openai');

type Completion = {
  data: {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: [
      {
        text: string;
        index: number;
        logprobs: any;
        finish_reason: 'stop';
      }
    ];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
};

export const complete = async (
  prompt: string,
  suffix: string,
  apiKey: string
): Promise<Completion> => {
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

export const explain = async (
  prompt: string,
  apiKey: string
): Promise<Completion> => {
  try {
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
  } catch (e) {
    console.log('ERROR', e);
    return {
      data: {
        choices: [
          // @ts-ignore
          {
            text:
              'Sorry, we are having trouble connecting to OpenAI. Please try again later.',
          },
        ],
      },
      usage: {
        total_tokens: 0,
      },
    };
  }
};
