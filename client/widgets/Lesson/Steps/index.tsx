import Icon from '@components/Icon';
import {
  RegularStepFragment,
  useCreateStepMutation,
  useDeleteStepMutation,
} from '@generated/graphql';
import { Transition } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';

import styles from './Steps.module.scss';

const Steps: React.FC<Props> = ({
  currentStepId,
  isEditting,
  lessonId,
  setCurrentStepId,
  showSteps,
  steps,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [createStepM] = useCreateStepMutation();
  const [deleteStepM] = useDeleteStepMutation();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isAdding) {
      setTimeout(() => {
        inputRef.current!.focus();
      }, 0);
    }
  }, [isAdding]);

  const createStep = async (name: string) => {
    const step = await createStepM({
      refetchQueries: ['Lesson'],
      variables: { lessonId, name },
    });

    if (!step.data?.createStep?.id) return;

    setCurrentStepId(step.data?.createStep?.id);
    setIsAdding(false);
  };

  const deleteStep = async (id: number, idx: number) => {
    const sortedSteps = steps
      .slice()
      .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1));

    await deleteStepM({
      refetchQueries: ['Lesson'],
      variables: { id },
    });

    setCurrentStepId(sortedSteps[idx - 1].id);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value) {
      createStep(value);
    }

    setIsAdding(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      createStep(event.currentTarget.value);
      setIsAdding(false);
    }
  };

  return (
    <Transition
      className="w-full absolute top-11 left-0 h-full bg-white bg-opacity-90 py-2 px-4 z-10 md:w-1/4"
      enter="transition ease-in-out duration-200 transform"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition ease-in-out duration-300 transform"
      leaveFrom="translate-x-0"
      leaveTo="-translate-x-full"
      show={showSteps}
    >
      <ol>
        {steps
          .slice()
          .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1))
          .map((step, i) => {
            return (
              <li
                className={`${
                  currentStepId === step.id ? 'text-blue-600' : ''
                } list-none cursor-pointer w-full flex justify-between items-center ${
                  styles.STEP
                }`}
                key={step.id}
                onClick={() => setCurrentStepId(step.id)}
              >
                <span>{step.name}</span>
                {isEditting && (
                  <Icon
                    className="text-red-600 hidden"
                    name="minus-circled"
                    onClick={() => {
                      const yes = window.confirm(
                        'Are you sure you want to delete this step?'
                      );

                      if (yes) {
                        deleteStep(step.id, i);
                      }
                    }}
                  />
                )}
              </li>
            );
          })}
      </ol>
      {isAdding && (
        <input
          className="w-full text-sm px-2 py-1"
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          type="text"
        />
      )}
      {isEditting && (
        <button
          className="inline-flex justify-center py-2 px-4 mt-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 whitespace-nowrap"
          onClick={() => setIsAdding(true)}
          type="button"
        >
          Add Step
        </button>
      )}
    </Transition>
  );
};

type Props = {
  currentStepId: number;
  isEditting?: boolean;
  lessonId: number;
  setCurrentStepId: (n: number) => void;
  showSteps: boolean;
  steps: RegularStepFragment[];
};

export default Steps;
