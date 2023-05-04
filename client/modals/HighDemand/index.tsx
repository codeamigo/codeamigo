import { Form, Formik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import Icon from '👨‍💻components/Icon';

import * as hal from '../../assets/hal.png';

const HighDemand: React.FC<Props> = () => {
  const router = useRouter();

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
          <div className="mx-auto max-w-lg p-6 lg:px-8">
            <h1 className="mb-1 flex items-center gap-1 text-xl font-semibold text-white">
              <Image alt="hal" height={32} src={hal} width={32} />
              <span>Increased Demand</span>
            </h1>
            <div className="text-xs text-neutral-500">
              We are currently experiencing high demand. If you have an OpenAI
              API key, please input it below. If you do not have an API key,
              please consider joining the waitlist.
            </div>
            <div className="my-4">
              <InputField
                label=""
                name="openaiKey"
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="OpenAI API Key"
                type="text"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="cursor-pointer text-xs text-red-600"
                  onClick={() => {
                    modalVar(InitialModalState);
                    router.push('/');
                  }}
                  role="button"
                >
                  Exit
                </span>
                <Button
                  onClick={() =>
                    window.open('https://forms.gle/weRYdVmr2LszmQiK6')
                  }
                  type="button"
                >
                  <Icon className="mr-1.5" name="plus-circled" />
                  <span>Join Waitlist</span>
                </Button>
              </div>
              <Button
                disabled={!values.openaiKey || isSubmitting}
                type="submit"
              >
                <span>Continue</span>
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

type Props = {};

export default HighDemand;
