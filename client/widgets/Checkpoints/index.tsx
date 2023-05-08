import React from 'react';

import Icon from '👨‍💻components/Icon';
import { CheckpointsQuery } from '👨‍💻generated/graphql';

const Checkpoints: React.FC<Props> = ({ checkpoints }) => {
  return (
    <div>
      {checkpoints?.map((checkpoint) => {
        return (
          <div
            className="relative z-20 flex items-center gap-2 border-b border-neutral-800 bg-black p-2 px-3"
            key={checkpoint.description}
          >
            <div
              className={`flex h-4 min-h-[1rem] w-4 min-w-[1rem] items-center justify-center rounded-full border ${
                checkpoint.isCompleted
                  ? 'border-green-500 bg-green-900'
                  : 'border-neutral-500 bg-black'
              }`}
            >
              <Icon
                className={`text-xxs ${
                  checkpoint.isCompleted ? `text-green-500` : 'text-neutral-500'
                }`}
                // @ts-ignore
                name={checkpoint.isCompleted ? 'check' : ''}
              />
            </div>
            <pre className="whitespace-normal text-white">
              {checkpoint.description}
            </pre>
          </div>
        );
      })}
    </div>
  );
};

type Props = {
  checkpoints?: CheckpointsQuery['checkpoints'];
};

export default Checkpoints;
