import { useSandpack } from '@codesandbox/sandpack-react';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import Icon from '👨‍💻components/Icon';
import {
  CodeSandboxTestMsgType,
  TestDataType,
} from '👨‍💻widgets/Lesson/Console/Tests/types';

const Tests: React.FC<Props> = () => {
  const { dispatch } = useSandpack();
  const [suites, setSuites] = useState<TestDataType[]>();
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    const handleTestResults = (msg: MessageEvent<CodeSandboxTestMsgType>) => {
      if (msg.data.type !== 'test') return;

      switch (msg.data.event) {
        case 'test_end':
          setSuites((curr) => [...(curr || []), msg.data.test]);
        case 'total_test_end':
          setIsRunning(false);
          break;
        case 'total_test_start':
          setIsRunning(true);
          setSuites([]);
          break;
      }

      console.log(msg.data);
    };

    window.addEventListener('message', handleTestResults);

    return () => window.removeEventListener('message', handleTestResults);
  }, []);

  const runTests = () => {
    if (isRunning) return;
    // @ts-ignore
    dispatch({ type: 'run-all-tests' });
  };

  return (
    <div className="h-1/2">
      <div
        className="text-text-primary overflow-scroll"
        onClick={() => runTests()}
      >
        <div className="flex justify-between items-center border-b-2">
          <div className="px-4 py-3 text-xl font-semibold sticky top-0">
            Test Summary
          </div>
          <div
            className="flex px-4 py-3 text-md font-medium cursor-pointer"
            onClick={() => runTests()}
            role="button"
          >
            <Icon className="mr-2" name={isRunning ? 'pause' : 'play'} />
            {isRunning ? 'Running' : 'Run Tests'}
          </div>
        </div>
      </div>
      <div className="p-4">
        {suites?.map((suite) =>
          suite.status === 'fail' ? (
            <div className="mb-4">
              <div
                className={`text-lg ${
                  suite.status === 'fail' ? 'text-red-400' : 'text-green-500'
                }`}
              >
                {suite.blocks.join(' > ')} {'> ' + suite.name}
              </div>
              {suite.errors.map((val) =>
                val.message.split('//').map((value) => {
                  return (
                    <div className="text-text-primary text-md">{value}</div>
                  );
                })
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

type Props = {};

export default Tests;
