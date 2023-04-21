import React from 'react';

import { InitialModalState, ModalType, modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import { Step } from '👨‍💻pages/v2';

const Steps: React.FC<Props> = () => {
  const { callback, data } = modalVar() as ModalType & {
    data: { currentStep: number; steps: Step[]; title: string };
  };
  return (
    <div className="flex flex-col overflow-hidden rounded-md text-sm text-white sm:min-w-[320px]">
      <div className="bg-black px-2.5 py-1.5 font-bold">{data.title}</div>
      {data.steps.map((step: any, i: number) => {
        const passed =
          (step.checkpoints.length &&
            step.checkpoints.every((checkpoint: any) => checkpoint?.passed)) ||
          (!step.checkpoints.length && data.currentStep > i);
        return (
          <div
            className={`flex cursor-pointer items-center gap-3 border-b border-neutral-800 px-2.5 py-1.5 text-xs last:border-b-0 ${
              i % 2 === 0 ? 'bg-neutral-900' : 'bg-black'
            }`}
            key={i}
            onClick={() => {
              callback(i);
              modalVar(InitialModalState);
            }}
          >
            <div
              className={`flex h-4 min-h-[1rem] w-4 min-w-[1rem] items-center justify-center rounded-full border ${
                passed
                  ? 'border-green-500 bg-green-900'
                  : 'border-neutral-500 bg-black'
              }`}
            >
              <Icon
                className={`text-xxs ${
                  passed ? `text-green-500` : 'text-neutral-500'
                }`}
                // @ts-ignore
                name={passed ? 'check' : ''}
              />
            </div>
            {i + 1}. {step.title}
          </div>
        );
      })}
    </div>
  );
};

type Props = {};

export default Steps;
