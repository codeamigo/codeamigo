import { Form, Formik } from 'formik';
import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import { useMeQuery } from '👨‍💻generated/graphql';

import { MAX_TOKENS_DEMO, MAX_TOKENS_USER } from '../../constants';

const Usage: React.FC<Props> = () => {
  const { data } = modalVar();
  const { data: meData } = useMeQuery();

  const { tokenUsageStatus, tokensUsed } = data;

  const maxTokens = meData?.me ? MAX_TOKENS_USER : MAX_TOKENS_DEMO;

  const percentageUsed = Math.min(100, (tokensUsed / maxTokens) * 100);

  return (
    <Formik
      initialValues={{ openaiKey: '' }}
      onSubmit={async (values) => {
        try {
          if (!values.openaiKey) throw new Error('Please enter an API key');
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/completions`,
            {
              body: JSON.stringify({
                apiKey: values.openaiKey,
                prompt: 'This is a test prompt',
                suffix: 'This is a test suffix',
              }),
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
            }
          );
          const data = await res.json();

          if (!data.length) throw new Error('Invalid API key');
          localStorage.setItem('openaiKey', values.openaiKey);
          modalVar(InitialModalState);
        } catch (e) {
          window.alert(e);
        }
      }}
    >
      {({ handleChange, isSubmitting, setFieldValue, values }) => (
        <Form>
          <div className="mx-auto min-w-[300px] max-w-[320px] p-4">
            <h1 className="mb-1 flex justify-center gap-1 text-xl font-semibold text-white">
              <span>Usage Limit</span>
            </h1>
            <div className="my-1 mb-2 text-center text-xs text-neutral-500">
              We give demo users {MAX_TOKENS_DEMO} tokens to try for free and
              registered users {MAX_TOKENS_USER} tokens.
            </div>
            <div className="my-4 flex items-center justify-center gap-1">
              <pre className="text-xs text-white">{tokensUsed}</pre>
              <div
                className={`h-2 w-full rounded-full p-[2px] transition-all duration-300 ${
                  tokenUsageStatus === 'safe'
                    ? 'bg-blue-900'
                    : tokenUsageStatus === 'warning'
                    ? 'bg-yellow-900'
                    : 'bg-red-900'
                }`}
              >
                <div
                  className={`h-full rounded-full bg-blue-500 transition-all duration-300 ${
                    tokenUsageStatus === 'safe'
                      ? 'bg-blue-500'
                      : tokenUsageStatus === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: Math.max(5, percentageUsed) + '%',
                  }}
                />
              </div>
              <pre className="text-xs text-white">{maxTokens}</pre>
            </div>
            <div className="flex flex-col gap-1 text-xs text-white">
              <pre>Tokens Used: {tokensUsed}</pre>
              <pre
                className={
                  !meData?.me
                    ? 'text-green-600'
                    : 'text-neutral-700 line-through'
                }
              >
                Demo User: {MAX_TOKENS_DEMO} Tokens
              </pre>
              <pre
                className={
                  meData?.me
                    ? 'text-green-600'
                    : 'text-neutral-700 line-through'
                }
              >
                Registered User: {MAX_TOKENS_USER} Tokens
              </pre>
            </div>
            {/* <div className="my-4">
              <InputField
                className="text-xs placeholder:text-xs"
                label="Input your API key to use your own tokens."
                name="openaiKey"
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="OpenAI API Key"
                type="text"
              />
            </div> */}
            <div className="mt-4 flex items-center justify-between">
              {!meData?.me ? (
                <span
                  className="text-xs text-blue-600"
                  onClick={() =>
                    modalVar({
                      callback: () => null,
                      name: 'login',
                      persistent: false,
                    })
                  }
                  role="button"
                >
                  Register
                </span>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2">
                {!meData?.me ? (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      window.open('https://forms.gle/weRYdVmr2LszmQiK6');
                    }}
                  >
                    <Icon className="mr-1.5" name="plus-circled" />
                    <span>Join Waitlist</span>
                  </Button>
                ) : null}
                <Button
                  onClick={() => modalVar(InitialModalState)}
                  type="button"
                >
                  <span>Close</span>
                </Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

type Props = {};

export default Usage;
