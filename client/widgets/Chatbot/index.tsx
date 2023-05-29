import { Form, Formik } from 'formik';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { TokenUsageStatusType } from 'types';
import { OpenAIAPIResponse } from 'types/openai';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import { CheckpointsQuery } from '👨‍💻generated/graphql';

import * as hal from '../../assets/hal.png';

const defaultQuestions = [
  'What is this code doing?',
  "Why isn't my code accepted?",
];

const Chatbot: React.FC<Props> = ({
  checkpoints,
  code,
  disabled,
  hoverSelection,
  questions,
  setTokensUsed,
  tokenUsageStatus,
  tokensUsed,
}: Props) => {
  const [height, setHeight] = useState(0);
  const [responses, setResponses] = useState<
    { question: string; value: string }[]
  >([]);
  const [textStreams, setTextStreams] = useState<
    {
      question: string;
      stream: string[];
    }[]
  >([]);
  const [isBusy, setIsBusy] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const streamedTextsRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isBusy) return;

    if (hoverSelection) {
      const prompt =
        'Code: ' +
        code +
        '### Explain what ' +
        hoverSelection +
        ' does in the code above.';
      fetchExplain(prompt, hoverSelection);
    }
  }, [hoverSelection]);

  const fetchExplain = async (prompt: string, question: string) => {
    try {
      // const oldStream = textStreams.find(
      //   (stream) => stream.question === question
      // );
      // if (oldStream) {
      //   const oldDiv = document.getElementById(oldStream.question);
      //   if (oldDiv && streamedTextsRef.current) {
      //     streamedTextsRef.current.scrollTo({
      //       behavior: 'smooth',
      //       top: oldDiv.offsetTop - (formRef?.current?.offsetHeight || 0) || 0,
      //     });
      //     oldDiv.classList.add('animate-pulse');
      //     setTimeout(() => {
      //       oldDiv.classList.remove('animate-pulse');
      //     }, 5000);
      //   }
      //   throw new Error('Already asked this question');
      // }
      if (disabled) throw new Error('Disabled');
      if (isBusy) throw new Error('Busy');
      setIsBusy(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/explain`,
        {
          body: JSON.stringify({
            apiKey: localStorage.getItem('openaiKey'),
            prompt,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );

      const explainations: OpenAIAPIResponse = await response.json();
      let value =
        `${explainations.choices?.[0]?.text}` || 'There was an error.';
      if (explainations.choices?.[0]?.finish_reason === 'length') {
        value += '...';
      }
      setResponses((prev) => [...prev, { question, value }]);
      streamText(value, question, responses.length);
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 10);

      const tokensUsed = explainations.usage.total_tokens;
      setTokensUsed((prev) => (prev || 0) + tokensUsed);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };

  const streamText = (text: string, question: string, streamIndex: number) => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        streamedTextsRef.current?.scrollTo({
          behavior: 'smooth',
          top: streamedTextsRef.current?.scrollHeight,
        });
        index++;
      }

      setTextStreams((prev) => {
        const newStreams = [...prev];
        newStreams[streamIndex] = {
          question,
          stream: text.slice(0, index).split(''),
        };
        return newStreams;
      });

      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, 50);
  };

  return (
    <div
      className={`flex max-h-[50%] flex-col border-t border-neutral-800 bg-black`}
    >
      <div className="relative h-full overflow-scroll" ref={streamedTextsRef}>
        <div className="sticky top-0 z-10 bg-black px-4 py-2" ref={formRef}>
          <div className="mb-2 flex items-center gap-2 sm:mb-1">
            <Image
              height={'24px'}
              src={hal}
              style={{ minHeight: '24px', minWidth: '24px' }}
              width={'24px'}
            />
            <pre className="whitespace-normal text-white">
              Hello, I'm Codeamigo. I'm here to help you with this tutorial.
            </pre>
          </div>
          <div className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2">
            <Formik
              initialValues={{ question: '' }}
              onSubmit={async (values) => {
                if (!values.question) return;
                const prompt = `I'm learning how to code. Question: ${values.question}`;
                await fetchExplain(prompt, values.question);
              }}
            >
              {({ setFieldValue, setValues, submitForm, values }) => (
                <Form className="relative">
                  <textarea
                    autoFocus
                    className="min-h-[40px] w-full resize-none rounded-md border border-neutral-800 bg-black px-3 py-2 text-sm text-white !outline-0 !ring-0 transition-colors placeholder:text-neutral-400 focus:border-neutral-700 disabled:opacity-50"
                    disabled={isBusy || disabled}
                    name="question"
                    onChange={(e) => {
                      setFieldValue('question', e.target.value);
                    }}
                    onInput={(e) => {
                      setHeight(0);
                      setTimeout(() => {
                        // @ts-ignore
                        setHeight(e.target.scrollHeight);
                      }, 1);
                    }}
                    onKeyDown={(e) => {
                      if (e.which === 13 && !e.shiftKey) {
                        e.preventDefault();

                        submitForm();
                      }
                    }}
                    placeholder={
                      disabled
                        ? ''
                        : isDesktop
                        ? 'Ask me anything, or hover over some code to see what I can do.'
                        : 'Ask me anything.'
                    }
                    ref={textAreaRef}
                    style={{ height: `${height}px` }}
                    value={values.question}
                  />
                  {isBusy ? (
                    <Icon
                      className="absolute right-3 top-1.5 animate-spin text-lg text-neutral-500"
                      name="cog"
                    />
                  ) : disabled ? (
                    <pre
                      className="absolute left-3 top-2.5 cursor-pointer rounded-md border border-red-500 bg-red-950 px-1 py-0.5 text-xs text-red-500"
                      onClick={() => {
                        modalVar({
                          callback: () => null,
                          data: {
                            tokenUsageStatus,
                            tokensUsed,
                          },
                          name: 'usage',
                          persistent: false,
                        });
                      }}
                    >
                      Max Tokens Exceeded
                    </pre>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {[
                      ...defaultQuestions.filter((q) => {
                        if (
                          q === "Why isn't my code accepted?" &&
                          !checkpoints?.length
                        ) {
                          return false;
                        }

                        return true;
                      }),
                      ...questions,
                    ].map((question) => {
                      return (
                        <pre
                          className="inline-block cursor-pointer rounded-md border border-blue-500 bg-blue-950 px-1 py-0.5 text-xs text-blue-500"
                          onClick={() => {
                            setValues({ question });
                            submitForm();
                          }}
                        >
                          {question}
                        </pre>
                      );
                    })}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        {textStreams.map(({ question, stream }, index) => {
          return (
            <div
              className={`border-b border-neutral-800 px-4 py-2 text-sm first:border-t last:border-b-0 ${
                index % 2 === 0 ? 'bg-neutral-900' : 'bg-black'
              }`}
              id={question}
            >
              <div className="mb-1">
                <pre className="inline-block rounded-md border border-green-500 bg-green-950 px-1 py-0.5 text-xs text-green-500">
                  {question}
                </pre>
              </div>
              {stream.map((char, i) => {
                if (stream.length === 0) return null;
                if ((char === '\n' && i === 0) || (char === '\n' && i === 1))
                  return null;
                if (char === '\n') return <br />;
                return <span className="text-white">{char}</span>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

type Props = {
  checkpoints: CheckpointsQuery['checkpoints'];
  code: string;
  disabled: boolean;
  hoverSelection: string | null;
  questions: string[];
  setTokensUsed: React.Dispatch<React.SetStateAction<number | null>>;
  tokenUsageStatus: TokenUsageStatusType;
  tokensUsed: number | null;
};

export default Chatbot;
