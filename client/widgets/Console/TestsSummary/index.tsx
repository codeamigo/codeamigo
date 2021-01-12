import React from 'react';

import { RegularCheckpointFragment } from '👨‍💻generated/graphql';
import { TestResultType } from '👨‍💻widgets/Console/types';
import { FromPreviewMsgType } from '👨‍💻widgets/Lesson/Editor/types';

const TestSummary: React.FC<Props> = ({ checkpoint, list }) => {
  if (!checkpoint) return null;
  if (!list.length) return null;

  const results = list.flatMap(
    (value) => JSON.parse(value.result) as TestResultType
  );

  const passed = results.filter((value) => value.status === 'pass');

  return (
    <div className="px-2 py-1 sticky top-0 bg-gray-700 text-sm">
      <div className="flex justify-between text-white">
        <span>{checkpoint.test} </span>
        <div>
          <span className="text-green-600 mr-2">{passed.length} Passed</span>
          <span className="text-gray-400">{results.length} Total</span>
        </div>
      </div>
    </div>
  );
};

type Props = {
  checkpoint?: RegularCheckpointFragment;
  list: FromPreviewMsgType[];
};

export default TestSummary;
