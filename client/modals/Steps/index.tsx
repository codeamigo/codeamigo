import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import { Step } from '👨‍💻pages/v2';

const Steps: React.FC<Props> = () => {
  const { data } = modalVar() as { data: { steps: Step[]; title: string } };
  return (
    <div className="flex flex-col overflow-hidden rounded-md text-sm text-white">
      <div className="bg-black px-2.5 py-1.5 font-bold">{data.title}</div>
      {data.steps.map((step, i) => {
        return (
          <div
            className={`cursor-pointer border-b border-neutral-800 px-2.5 py-1.5 text-xs last:border-b-0 ${
              i % 2 === 0 ? 'bg-neutral-900' : 'bg-black'
            }`}
            key={i}
          >
            {i + 1}. {step.title}
          </div>
        );
      })}
    </div>
  );
};

type Props = {};

export default Steps;
