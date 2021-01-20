import { Transition } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';

import Icon from '👨‍💻components/Icon';
import {
  RegularStepFragment,
  useCreateStepMutation,
  useDeleteStepMutation,
  useUpdateStepNameMutation,
} from '👨‍💻generated/graphql';

import styles from './Steps.module.scss';

const Steps: React.FC<Props> = ({
  activeSessionStepId,
  currentStepId,
  isEditting,
  lessonId,
  setCurrentStepId,
  showSteps,
  steps,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateRef = useRef<HTMLInputElement>(null);
  const [createStepM] = useCreateStepMutation();
  const [updateStepM] = useUpdateStepNameMutation();
  const [deleteStepM] = useDeleteStepMutation();
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState<boolean | number>(false);

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

  const updateStep = async (id: number, name: string) => {
    updateStepM({
      refetchQueries: ['Lesson'],
      variables: { id, name },
    });

    setIsUpdating(false);
  };

  const deleteStep = async (id: number, idx: number) => {
    await deleteStepM({
      refetchQueries: ['Lesson'],
      variables: { id },
    });

    setCurrentStepId(steps[idx - 1].id);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value) {
      createStep(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (event.key === 'Enter' && value) {
      createStep(value);
    }
  };

  const handleUpdateBlur = (
    event: React.FocusEvent<HTMLInputElement>,
    id: number
  ) => {
    const value = event.currentTarget.value;

    if (value) {
      updateStep(id, value);
    }
  };

  const handleUpdateKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    const value = event.currentTarget.value;

    if (event.key === 'Enter' && value) {
      updateStep(id, value);
    }
  };

  const canGoToStep = (step: RegularStepFragment) =>
    isEditting || step.isCompleted || step.id === activeSessionStepId;

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
        {steps.map((step, i) => {
          return (
            <li
              className={`${
                canGoToStep(step)
                  ? `cursor-pointer hover:text-blue-600 transition-colors duration-150 ${styles.STEP}`
                  : 'cursor-not-allowed opacity-50'
              } ${
                currentStepId === step.id ? 'text-blue-600' : ''
              } list-none w-full flex justify-between items-center`}
              key={step.id}
              onClick={() => {
                if (canGoToStep(step)) {
                  setCurrentStepId(step.id);
                }

                if (!isEditting) return;
                setIsUpdating(step.id);
                setTimeout(() => {
                  updateRef.current?.focus();
                }, 0);
              }}
            >
              <div className="flex w-full">
                {isUpdating === step.id ? (
                  <input
                    className="w-full text-md text-gray-900 px-0 py-0 border-none border-b-2 border-blue-50 bg-transparent focus:ring-0"
                    defaultValue={step.name || ''}
                    onBlur={(e) => handleUpdateBlur(e, step.id)}
                    onKeyDown={(e) => handleUpdateKeyDown(e, step.id)}
                    ref={updateRef}
                    type="text"
                  />
                ) : (
                  <span role={`${canGoToStep(step)} ? 'button' : ''}`}>
                    {step.name || ''} {step.isCompleted ? '✅' : ''}
                  </span>
                )}
              </div>
              {isEditting && isUpdating === step.id && (
                <Icon
                  className="text-gray-500 mr-2 hover:text-green-600 transition-colors duration-150"
                  name="check"
                  // handled by blur
                  onClick={() => null}
                />
              )}
              {isEditting && !isUpdating && (
                <Icon
                  className="text-red-600 hidden"
                  name="minus-circled"
                  onClick={(e) => {
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
  activeSessionStepId?: number;
  currentStepId: number;
  isEditting?: boolean;
  lessonId: number;
  setCurrentStepId: (n: number) => void;
  showSteps: boolean;
  steps: RegularStepFragment[];
};

export default Steps;
