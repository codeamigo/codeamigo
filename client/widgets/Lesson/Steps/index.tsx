import { Transition } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';

import Button from '👨‍💻components/Button';
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
  const [stepsHeight, setStepsHeight] = useState<string>(
    // 3rem => header
    // 4rem => footer
    'calc(100% - 3rem - 4rem)'
  );

  useEffect(() => {
    if (isAdding) {
      setTimeout(() => {
        inputRef.current!.focus();
      }, 0);
    }
  }, [isAdding]);

  useEffect(() => {
    const changeStepsHeight = () => {
      const instructions = document.getElementById('instructions');
      const height = instructions?.offsetHeight || 0;
      const newHeight = `${height}px`;

      if (newHeight !== stepsHeight) {
        setStepsHeight(newHeight);
      }
    };

    setTimeout(() => {
      changeStepsHeight();
    }, 2000);
    window.addEventListener('resize', changeStepsHeight);

    return () => window.removeEventListener('resize', changeStepsHeight);
  }, []);

  const createStep = async (name: string) => {
    const step = await createStepM({
      refetchQueries: ['Lesson'],
      variables: { currentStepId, lessonId, name },
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
      return createStep(value);
    }

    setIsAdding(false);
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
      className="w-full absolute top-12 left-0 bg-bg-primary bg-opacity-5 py-2 px-4 z-10 lg:w-1/4"
      enter="transition ease-in-out duration-200 transform"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition ease-in-out duration-300 transform"
      leaveFrom="translate-x-0"
      leaveTo="-translate-x-full"
      show={showSteps}
      style={{
        height: stepsHeight,
      }}
    >
      <ol>
        {steps.map((step, i) => {
          return (
            <li
              className={`${
                canGoToStep(step)
                  ? `cursor-pointer hover:text-accent transition-colors duration-150 ${styles.STEP}`
                  : 'cursor-not-allowed opacity-50'
              } ${
                currentStepId === step.id ? 'text-accent' : ''
              } text-text-primary list-none w-full flex justify-between items-center py-2 border-b border-bg-nav-offset`}
              key={step.id}
              onClick={() => {
                if (canGoToStep(step)) {
                  setCurrentStepId(step.id);
                }

                if (!isEditting) return;
              }}
            >
              <div className="flex w-full">
                {isUpdating === step.id ? (
                  <input
                    className="w-full text-md text-text-primary px-0 py-0 border-none border-blue-50 bg-transparent focus:ring-0"
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
                <div className="flex">
                  <Button className="ml-1 py-0" type="submit">
                    Submit
                  </Button>
                  <a
                    className="ml-2 text-text-primary text-sm"
                    onClick={(
                      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                    ) => {
                      e.stopPropagation();
                      setIsAdding(false);
                    }}
                  >
                    Cancel
                  </a>
                </div>
              )}
              {isEditting && !isUpdating && (
                <div className="flex">
                  <Icon
                    className="text-text-primary hidden mr-2"
                    name="pencil"
                    onClick={() => {
                      setIsUpdating(step.id);
                      setTimeout(() => {
                        updateRef.current?.focus();
                      }, 0);
                    }}
                  />
                  <Icon
                    className="text-text-secondary hidden"
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
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {isAdding && (
        <div className="w-full flex py-2 items-center">
          <input
            className="w-full text-md text-text-primary px-0 py-0 border-none border-blue-50 bg-transparent focus:ring-0"
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            type="text"
          />
          <Button className="ml-1 py-0" type="submit">
            Submit
          </Button>
          <a
            className="ml-2 text-text-primary text-sm cursor-pointer"
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              e.stopPropagation();
              setIsAdding(false);
            }}
          >
            Cancel
          </a>
        </div>
      )}
      {isEditting && !isAdding && !isUpdating && (
        <Button
          className="mt-3"
          onClick={() => setIsAdding(true)}
          type="button"
        >
          New Step
        </Button>
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
