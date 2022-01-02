import { Transition } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';
import useOnClickOutside from 'use-onclickoutside';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import {
  RegularStepFragment,
  useCreateStepMutation,
  useDeleteStepMutation,
  useUpdateStepNameMutation,
  useUpdateStepPositionMutation,
} from '👨‍💻generated/graphql';
import { LessonInfoHeaderHeight } from '👨‍💻widgets/Lesson/Info';

import styles from './Steps.module.scss';

const Steps: React.FC<Props> = ({
  activeSessionStepId,
  currentStepId,
  isEditing,
  isPreviewing,
  lessonId,
  setCurrentStepId,
  setShowSteps,
  showSteps,
  steps,
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateRef = useRef<HTMLInputElement>(null);
  const [createStepM] = useCreateStepMutation();
  const [updateStepM] = useUpdateStepNameMutation();
  const [deleteStepM] = useDeleteStepMutation();
  const [
    updateStepPosition,
    { loading: updatingSteps },
  ] = useUpdateStepPositionMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState<boolean | number>(false);
  const [dragChange, setDragChange] = useState<{
    active: number | null;
    diff: null | number;
  }>({ active: null, diff: null });
  const [stepsHeight, setStepsHeight] = useState<string>(
    // 3rem => header
    // 4rem => footer
    `calc(100% - ${LessonInfoHeaderHeight}rem - 4rem)`
  );

  useOnClickOutside(wrapperRef, () => {
    setTimeout(() => setShowSteps(false), 150);
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isAdding) {
      timeout = setTimeout(() => {
        inputRef.current!.focus();
      }, 0);
    }

    return () => timeout && clearTimeout(timeout);
  }, [isAdding]);

  useEffect(() => {
    const changeStepsHeight = () => {
      const width = window.outerWidth;
      if (width < 1024) {
        setStepsHeight('100%');
        return;
      }
      const instructions = document.getElementById('instructions');
      const height = instructions?.offsetHeight || 0;
      const newHeight = `${height}px`;

      if (newHeight !== stepsHeight) {
        setStepsHeight(newHeight);
      }
    };

    const timeout = setTimeout(() => {
      changeStepsHeight();
    }, 2000);
    window.addEventListener('resize', changeStepsHeight);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', changeStepsHeight);
    };
  }, []);

  const createStep = async (name: string) => {
    const step = await createStepM({
      refetchQueries: ['Lesson'],
      variables: { currentStepId, lessonId, name },
    });

    if (!step.data?.createStep?.id) return;

    setCurrentStepId(step.data?.createStep?.id);
    setIsAdding(false);
    setTimeout(() => {
      setShowSteps(false);
    }, 500);
  };

  const updateStep = async (id: number, name: string) => {
    updateStepM({
      refetchQueries: ['Lesson'],
      variables: { id, lessonId, name },
    });

    setIsUpdating(false);
  };

  const deleteStep = async (id: number, idx: number) => {
    await deleteStepM({
      refetchQueries: ['Lesson'],
      variables: { id, lessonId },
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
    isEditing ||
    isPreviewing ||
    step.isCompleted ||
    step.id === activeSessionStepId;

  return (
    <Transition
      className="overflow-auto absolute top-28 lg:top-11 left-0 z-40 py-2 px-4 w-full lg:w-3/12 bg-opacity-5 border-r shadow-2xl bg-bg-primary border-bg-nav-offset"
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
      <div className="h-full" ref={wrapperRef}>
        {updatingSteps ? (
          <div className="text-lg font-bold text-text-primary">Loading...</div>
        ) : (
          <ol>
            {steps.map((step, i) => {
              return (
                <>
                  <div
                    className={`${
                      dragChange.active &&
                      dragChange.diff &&
                      dragChange.diff < 0 &&
                      step.position === dragChange.active + dragChange.diff
                        ? 'block'
                        : 'hidden'
                    } h-6`}
                  />
                  <li
                    className={`${
                      canGoToStep(step)
                        ? `cursor-pointer hover:text-accent transition-colors duration-150 ${styles.STEP}`
                        : 'cursor-not-allowed opacity-50'
                    } ${
                      currentStepId === step.id
                        ? 'text-accent'
                        : 'text-text-primary'
                    } ${
                      dragChange.active === step.position &&
                      dragChange.diff !== 0
                        ? 'opacity-0 h-0 py-0 b-0'
                        : 'py-2'
                    } list-none w-full flex justify-between items-center border-b border-bg-nav-offset`}
                    draggable={isEditing}
                    key={step.id}
                    onClick={() => {
                      if (canGoToStep(step)) {
                        setCurrentStepId(step.id);
                        setShowSteps(false);
                      }

                      if (!isEditing) return;
                    }}
                    onDrag={(event) => {
                      if (event.nativeEvent.clientX === 0) return;
                      if (!step.position) return;

                      const HEIGHT = 41;
                      const maxUp: number = step.position - 1;
                      const maxDown: number = steps.length - step.position;
                      const isNegativeChange = event.nativeEvent.offsetY < 0;

                      let changeY = Math.abs(
                        Math.floor(event.nativeEvent.offsetY / HEIGHT)
                      );

                      console.log(step.position, changeY);
                      if (isNegativeChange && changeY > maxUp) {
                        changeY = maxUp;
                      }

                      if (!isNegativeChange && changeY > maxDown) {
                        changeY = maxDown;
                      }

                      setDragChange({
                        active: step.position,
                        diff: isNegativeChange ? -changeY : changeY,
                      });
                    }}
                    onDragEnd={() => {
                      if (dragChange.diff === null) return;
                      if (!dragChange.diff) return;
                      updateStepPosition({
                        refetchQueries: ['Lesson'],
                        variables: {
                          changeY: dragChange.diff,
                          id: step.id,
                          lessonId,
                        },
                      });
                      setDragChange({ active: null, diff: null });
                    }}
                  >
                    <div className="flex overflow-hidden w-full whitespace-nowrap">
                      {isUpdating === step.id ? (
                        <input
                          className="py-0 px-0 w-full bg-transparent border-blue-50 border-none focus:ring-0 text-text-primary"
                          defaultValue={step.name || ''}
                          onBlur={(e) => handleUpdateBlur(e, step.id)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => handleUpdateKeyDown(e, step.id)}
                          ref={updateRef}
                          type="text"
                        />
                      ) : (
                        <span role={`${canGoToStep(step)} ? 'button' : ''}`}>
                          {i + 1}. {step.isCompleted ? '✅' : ''}{' '}
                          {step.name || ''}
                        </span>
                      )}
                    </div>
                    {isEditing && isUpdating === step.id && (
                      <div className="flex">
                        <Button className="py-0 ml-1" type="submit">
                          Submit
                        </Button>
                        <a
                          className="ml-2 text-sm text-text-primary"
                          onClick={(
                            e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                          ) => {
                            setIsAdding(false);
                            e.stopPropagation();
                          }}
                        >
                          Cancel
                        </a>
                      </div>
                    )}
                    {isEditing && !isUpdating && (
                      <div className="flex">
                        <Icon
                          className="hidden mr-2 text-text-primary"
                          name="pencil"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsUpdating(step.id);
                            setTimeout(() => {
                              updateRef.current?.focus();
                            }, 0);
                          }}
                        />
                        <Icon
                          className="hidden text-text-secondary"
                          name="minus-circled"
                          onClick={(e) => {
                            e.stopPropagation();
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
                  <div
                    className={`${
                      dragChange.active &&
                      dragChange.diff &&
                      dragChange.diff > 0 &&
                      step.position === dragChange.active + dragChange.diff
                        ? 'block'
                        : 'hidden'
                    } h-6`}
                  />
                </>
              );
            })}
          </ol>
        )}
        {isAdding && (
          <div className="flex items-center py-2 w-full">
            <input
              className="py-0 px-0 w-full bg-transparent border-blue-50 border-none focus:ring-0 text-text-primary"
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              type="text"
            />
            <Button className="py-0 ml-1" type="submit">
              Submit
            </Button>
            <a
              className="ml-2 text-sm cursor-pointer text-text-primary"
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                e.stopPropagation();
                setIsAdding(false);
              }}
            >
              Cancel
            </a>
          </div>
        )}
        {isEditing && !isAdding && !isUpdating && (
          <Button
            className="mt-3"
            onClick={() => setIsAdding(true)}
            type="button"
          >
            New Step
          </Button>
        )}
      </div>
    </Transition>
  );
};

type Props = {
  activeSessionStepId?: number;
  currentStepId: number;
  isEditing?: boolean;
  isPreviewing?: boolean;
  lessonId: number;
  setCurrentStepId: (n: number) => void;
  setShowSteps: (val: boolean) => void;
  showSteps: boolean;
  steps: RegularStepFragment[];
};

export default Steps;
