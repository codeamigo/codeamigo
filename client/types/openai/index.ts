export type OpenAIAPIResponse = {
  choices?: { finish_reason: 'length' | 'stop'; text: string }[];
  usage: { total_tokens: number };
};
