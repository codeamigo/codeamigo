import { useReactiveVar } from '@apollo/client';
import { useSandpack } from '@codesandbox/sandpack-react';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { isTestingVar } from '👨‍💻apollo/cache/lesson';
import Icon from '👨‍💻components/Icon';
import {
  CodeSandboxTestMsgType,
  TestDataType,
} from '👨‍💻widgets/Lesson/Console/Tests/types';

const Tests: React.FC<Props> = ({ runTests, stepId }) => {
  const [suites, setSuites] = useState<TestDataType[]>();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const isTesting = useReactiveVar(isTestingVar);

  useEffect(() => {
    const handleTestResults = (msg: MessageEvent<CodeSandboxTestMsgType>) => {
      if (msg.data.type !== 'test') return;

      switch (msg.data.event) {
        case 'test_end':
          setSuites((curr) => {
            if (curr?.find((val) => val.name === msg.data.test.name))
              return curr;

            return [...(curr || []), msg.data.test];
          });
          break;
        case 'total_test_end':
          setIsRunning(false);
          isTestingVar(false);
          break;
        case 'total_test_start':
          setIsRunning(true);
          setSuites([]);
          break;
      }
    };

    window.addEventListener('message', handleTestResults);

    return () => window.removeEventListener('message', handleTestResults);
  }, []);

  useEffect(() => {
    setSuites([]);
  }, [stepId]);

  const handleRunTests = () => {
    isTestingVar(true);
    if (isRunning || isTesting) return;
    runTests();
  };

  console.log(suites);

  return (
    <div>
      <div className="text-text-primary">
        <div className="flex justify-between items-center border-b-2">
          <div className="sticky top-0 py-3 px-4 text-xl font-semibold text-text-primary">
            Test Summary
          </div>
          <div
            className="flex items-center py-3 px-4 font-medium cursor-pointer"
            onClick={() => handleRunTests()}
            role="button"
          >
            <Icon
              className="mr-2 text-lg"
              name={isRunning || isTesting ? 'pause' : 'play'}
            />
            {isRunning || isTesting ? 'Running' : 'Run Tests'}
          </div>
        </div>
      </div>
      <div className="p-4">
        {suites?.map((suite, i) => (
          <div className="mb-4" key={i}>
            <div
              className={`text-md font-bold ${
                suite.status === 'fail' ? 'text-red-400' : 'text-green-500'
              }`}
            >
              {suite.status === 'pass' ? <>✅</> : null}{' '}
              {suite.blocks.join(' > ')} {'> ' + suite.name}
            </div>
            {suite.errors.map(
              (val) =>
                val.message &&
                val.message.split('//').map((value, i) => {
                  return (
                    <div className="mb-1 text-text-primary" key={i}>
                      {value}
                    </div>
                  );
                })
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

type Props = {
  runTests: () => void;
  stepId: number;
};

export default Tests;
