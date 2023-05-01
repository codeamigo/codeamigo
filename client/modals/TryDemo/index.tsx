import { useRouter } from 'next/router';
import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';

const TryDemo: React.FC<Props> = () => {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-lg p-6 lg:px-8">
      <h1 className="mb-1 flex items-center gap-1 text-lg font-semibold text-white sm:text-xl">
        <span>Want to try the demo?</span>
      </h1>
      <div className="text-xs text-neutral-500">
        You might want to play around with the demo before you continue with
        this lesson. Learn how to use the Codeamigo Assistant by clicking the
        button below.
      </div>
      <div className="mt-4">
        <Button
          onClick={() => {
            localStorage.setItem('tried-demo', 'true');
            router.push('/v2/lesson/hello-codeamigo/step/intro');
            modalVar(InitialModalState);
          }}
        >
          <span>Try the Demo</span>
        </Button>
        <Button
          onClick={() => {
            localStorage.setItem('tried-demo', 'true');
            modalVar(InitialModalState);
          }}
        >
          <span>Continue this Lesson</span>
        </Button>
      </div>
    </div>
  );
};

type Props = {};

export default TryDemo;
