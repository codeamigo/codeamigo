import React from 'react';

import Icon from '👨‍💻components/Icon';
import { RegularCheckpointFragment } from '👨‍💻generated/graphql';
import { TestBundlerErrType, TestResultType } from '👨‍💻widgets/Console/types';
import {
  FromPreviewMsgType,
  FromTestRunnerMsgType,
} from '👨‍💻widgets/Lesson/Editor/types';

const root = 'ROOT_DESCRIBE_BLOCK';
const errStart = 'at Object.eval';

const TestSummary: React.FC<Props> = ({ checkpoint, list }) => {
  if (!checkpoint) return null;
  const results = list.flatMap(
    (value) => JSON.parse(value.result) as TestResultType
  );

  let bundlerErr: TestBundlerErrType | null = null;
  try {
    // @ts-ignore
    bundlerErr = results && results[0].severity;
  } catch (e) {
    // nothing
  }

  const passed = results.filter((value) => value.status === 'pass');
  const testPath = (path: string[]) =>
    path?.filter((p) => p !== root).join(' > ');
  const parseError = (error: string) => {
    return error.split(errStart)[0].split('\n');
  };

  return (
    <div>
      <div className="px-2 py-1 sticky top-0 bg-gray-700 border-gray-300 border-b-2">
        <div className="flex justify-between items-center text-gray-300">
          <span>{checkpoint.test} </span>
          {list.length ? (
            <div className="text-sm">
              <span className="text-green-400 mr-2">
                {passed.length} Passed
              </span>
              <span className="text-gray-400">{results.length} Total</span>
            </div>
          ) : null}
        </div>
      </div>
      {bundlerErr ? (
        <div className="text-sm text-text-primary px-2 py-1 break-words">
          {JSON.stringify(results[0])}
        </div>
      ) : (
        results.map((result, i) => {
          return (
            <div className="text-sm" key={i}>
              <div className="flex justify-between text-text-primary px-2 py-1">
                <span>{testPath(result?.testPath)}</span>
                <Icon
                  className={
                    result?.status === 'pass'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                  name={result?.status === 'pass' ? 'check' : 'cancel-circled'}
                />
              </div>
              <div className="px-2 py-1">
                {result?.errors?.map((value, j) => (
                  <div key={j}>
                    {parseError(value).map((val, k) => {
                      return (
                        <div className="text-red-400" key={k}>
                          {val}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

type Props = {
  checkpoint?: RegularCheckpointFragment;
  list: FromTestRunnerMsgType[];
};

export default TestSummary;
