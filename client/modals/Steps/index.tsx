import React from 'react';

import { InitialModalState, ModalType, modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import {
  CheckpointsQuery,
  Step,
  UserLessonPositionQuery,
} from '👨‍💻generated/graphql';

type StepsDataType = {
  checkpoints?: CheckpointsQuery['checkpoints'];
  currentStep: number;
  steps: Pick<Step, 'slug' | 'title'>[];
  title: string;
  userLessonPosition?: UserLessonPositionQuery['userLessonPosition'];
};

const Steps: React.FC<Props> = () => {
  const { callback, data } = modalVar() as ModalType;
  const modalData: StepsDataType = data;
  return (
    <div className="flex flex-col overflow-hidden rounded-md text-sm text-white sm:min-w-[320px]">
      <div className="bg-black px-2.5 py-1.5 font-bold">{modalData.title}</div>
      {modalData.steps.map((step: Pick<Step, 'slug' | 'title'>, i: number) => {
        const checkpoints = modalData.checkpoints?.filter(
          (checkpoint: any) => checkpoint.step.slug === step.slug
        );

        const passed =
          (modalData.userLessonPosition?.currentPosition || 0) > i ||
          (checkpoints?.length &&
            checkpoints.every((checkpoint: any) => checkpoint?.isCompleted));
        return (
          <div
            className={`flex cursor-pointer items-center gap-3 border-b border-neutral-800 px-2.5 py-1.5 text-xs last:border-b-0 ${
              i % 2 === 0 ? 'bg-neutral-900' : 'bg-black'
            }`}
            key={i}
            onClick={() => {
              callback(step.slug);
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
