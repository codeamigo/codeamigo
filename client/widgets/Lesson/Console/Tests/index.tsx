import { useSandpack } from '@codesandbox/sandpack-react';
import React from 'react';
import { useEffect } from 'react';

const Tests: React.FC<Props> = () => {
  const { dispatch } = useSandpack();

  useEffect(() => {
    const handleTestResults = (msg: MessageEvent<any>) => {
      if (msg.data.type === 'test') {
        console.log(msg);
      }
    };

    window.addEventListener('message', handleTestResults);

    return () => window.removeEventListener('message', handleTestResults);
  }, []);

  const runTests = () => {
    // @ts-ignore
    dispatch({ type: 'run-all-tests' });
  };

  return (
    <div>
      <div className="text-text-primary" onClick={() => runTests()}>
        Run tests
      </div>
    </div>
  );
};

type Props = {};

export default Tests;
