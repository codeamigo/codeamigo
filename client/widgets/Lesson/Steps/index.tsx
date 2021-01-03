import Icon from '@components/Icon';
import {
  RegularStepFragment,
  useCreateStepMutation,
  useDeleteStepMutation,
  useUpdateStepNameMutation,
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
    if (event.key === 'Enter') {
      updateStep(id, event.currentTarget.value);
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
                <div className="flex">
                  {isUpdating === step.id ? (
                    <input
                      className="w-full text-sm text-gray-900 px-2 py-1"
                      defaultValue={step.name || ''}
                      onBlur={(e) => handleUpdateBlur(e, step.id)}
                      onKeyDown={(e) => handleUpdateKeyDown(e, step.id)}
                      ref={updateRef}
                      type="text"
                    />
                  ) : (
                    <span>{step.name || ''}</span>
                  )}
                  {isEditting && isUpdating !== step.id && (
                    <Icon
                      className="text-gray-500 ml-2 hover:text-blue-600 transition-colors duration-150"
                      name="pencil"
                      onClick={() => {
                        setIsUpdating(step.id);
                        setTimeout(() => {
                          updateRef.current?.focus();
                        }, 0);
                      }}
                    />
                  )}
                  {isEditting && isUpdating === step.id && (
                    <>
                      <Icon
                        className="text-gray-500 ml-2 hover:text-green-600 transition-colors duration-150"
                        name="check"
                        // handled by blur
                        onClick={() => null}
                      />
                      <Icon
                        className="text-gray-500 ml-2 hover:text-blue-600 transition-colors duration-150"
                        name="cancel-circled"
                        onClick={() => setIsUpdating(false)}
                      />
                    </>
                  )}
                </div>
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
