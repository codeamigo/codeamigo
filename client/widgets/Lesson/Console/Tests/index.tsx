import { useSandpack } from '@codesandbox/sandpack-react';
import React from 'react';
import { useEffect } from 'react';

const Tests: React.FC<Props> = () => {
  const { dispatch } = useSandpack();

  useEffect(() => {
    // @ts-ignore
    dispatch({ type: 'run-all-tests' });
  }, []);

  useEffect(() => {
    const handleTestResults = (msg: MessageEvent<any>) => {
      console.log(msg);
    };

    window.addEventListener('message', handleTestResults);

    return () => window.removeEventListener('message', handleTestResults);
  });

  return <div></div>;
};

type Props = {};

export default Tests;
