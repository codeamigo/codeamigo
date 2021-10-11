import { useReactiveVar } from '@apollo/client';
import debounce from 'debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import { testFailureVar } from '👨‍💻apollo/cache/lesson';
import Icon from '👨‍💻components/Icon';
import {
  CheckpointsDocument,
  CheckpointsQuery,
  RegularCheckpointFragment,
  RegularStepFragment,
  StepDocument,
  StepQuery,
  useCheckpointsQuery,
  useDeleteCheckpointMutation,
  useUpdateCheckpointMutation,
  useUpdateStepCheckpointMutation,
} from '👨‍💻generated/graphql';
import StatusIndicatorV2 from '👨‍💻widgets/Lesson/Info/StatusIndicatorV2';

const Checkpoints: React.FC<Props> = ({ isEditing, step }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data, loading } = useCheckpointsQuery({
    variables: { stepId: step.id },
  });
  const [updateCheckpointM] = useUpdateCheckpointMutation();
  const [deleteCheckpointM] = useDeleteCheckpointMutation();
  const [updateStepCheckpoint] = useUpdateStepCheckpointMutation();
  const [view, toggleView] = useState<'editor' | 'preview'>(
    isEditing ? 'editor' : 'preview'
  );
  const [activeCheckpoint, setActiveCheckpoint] = useState<
    RegularCheckpointFragment | undefined
  >(undefined);
  const [showStatusIndicator, setShowStatusIndicator] = useState(false);
  const testFailure = useReactiveVar(testFailureVar);

  // When user COMPLETES a checkpoint
  useEffect(() => {
    if (!data?.checkpoints) return;
    if (isEditing) return;

    const checkpoint = data.checkpoints.find(
      ({ id }) => id === step.currentCheckpointId
    );

    setActiveCheckpoint(checkpoint);
  }, [step.currentCheckpointId, data?.checkpoints]);

  // When user changes the active checkpoint
  useEffect(() => {
    if (isEditing) {
      toggleView('editor');
    }
    if (activeCheckpoint) {
      const q = {
        query: StepDocument,
        variables: { id: step.id },
      };

      updateStepCheckpoint({
        update: (store) => {
          const stepData = store.readQuery<StepQuery>(q);
          if (!stepData?.step) return;

          store.writeQuery<StepQuery>({
            ...q,
            data: {
              step: {
                ...stepData.step,
                currentCheckpointId: activeCheckpoint.id,
              },
            },
          });
        },
        variables: { checkpointId: activeCheckpoint.id, id: step.id },
      });
    }
  }, [activeCheckpoint?.id]);

  const updateCheckpoint = useCallback(
    debounce((value: string | undefined) => {
      if (!activeCheckpoint) return;

      const q = {
        query: CheckpointsDocument,
        variables: { stepId: step.id },
      };

      updateCheckpointM({
        update: (store, { data }) => {
          const checkpointsData = store.readQuery<CheckpointsQuery>(q);
          if (!checkpointsData?.checkpoints) return;

          store.writeQuery<CheckpointsQuery>({
            ...q,
            data: {
              checkpoints: checkpointsData.checkpoints.map((checkpoint) => {
                if (checkpoint.id !== activeCheckpoint.id) return checkpoint;

                return {
                  ...checkpoint,
                  description: data?.updateCheckpoint?.description || '',
                };
              }),
            },
          });
        },
        variables: { description: value || '', id: activeCheckpoint.id },
      });
    }, 1000),
    [activeCheckpoint]
  );

  useEffect(() => {
    if (isEditing) {
      toggleView('editor');
      setActiveCheckpoint(data?.checkpoints[data.checkpoints.length - 1]);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 1);
    }
  }, [data?.checkpoints.length]);

  if (loading) return null;
  if (!data?.checkpoints) return null;

  const { checkpoints } = data;

  const deleteCheckpoint = async (id: number) => {
    const len = data?.checkpoints?.length || 0;

    if (activeCheckpoint?.id === id) {
      setCheckpoint(checkpoints[len - 1 - 1]);
    }

    await deleteCheckpointM({
      refetchQueries: ['Checkpoints', 'Step'],
      variables: { id },
    });
  };

  const setCheckpoint = (checkpoint?: RegularCheckpointFragment) => {
    if (!checkpoint) {
      setActiveCheckpoint(undefined);
      return;
    }

    if (canSetCheckpoint(checkpoint)) {
      if (isCurrentCheckpoint(checkpoint.id)) {
        setActiveCheckpoint(undefined);
      } else {
        setActiveCheckpoint(checkpoint);
      }
    }
  };

  const isCurrentCheckpoint = (id: number) => id === activeCheckpoint?.id;
  const canSetCheckpoint = (checkpoint: RegularCheckpointFragment) =>
    isEditing ||
    checkpoint.isTested ||
    checkpoint.isCompleted ||
    checkpoint.id === step.currentCheckpointId;

  return (
    <>
      {checkpoints.length
        ? checkpoints.map((checkpoint, i) => {
            return (
              <div key={checkpoint.id}>
                <h3
                  className={`w-full flex justify-between items-center bg-bg-nav p-2 text-xs ${
                    canSetCheckpoint(checkpoint)
                      ? 'cursor-pointer'
                      : isCurrentCheckpoint(checkpoint.id)
                      ? ''
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => setCheckpoint(checkpoint)}
                >
                  <span className="flex items-center">
                    <Icon
                      className="mr-2 w-2 text-text-primary"
                      name={
                        isCurrentCheckpoint(checkpoint.id)
                          ? 'down-dir'
                          : 'right-dir'
                      }
                    />
                    <Icon
                      className="mr-2 text-text-primary"
                      name={
                        checkpoint.type === 'output'
                          ? 'terminal'
                          : checkpoint.type === 'match'
                          ? 'regexicon'
                          : 'jest'
                      }
                    />
                    <span className="text-text-primary">
                      Checkpoint {i + 1}{' '}
                    </span>
                  </span>
                  {!isEditing &&
                    (checkpoint.isTested || checkpoint.isCompleted) && (
                      <span>✅</span>
                    )}
                  {!isEditing &&
                    testFailure &&
                    isCurrentCheckpoint(checkpoint.id) &&
                    (!checkpoint.isTested || !checkpoint.isCompleted) && (
                      <span>❌</span>
                    )}
                  {isEditing && isCurrentCheckpoint(checkpoint.id) && (
                    <div className="flex">
                      <Icon
                        className="text-lg leading-none text-text-primary"
                        name={
                          view === 'editor' &&
                          isCurrentCheckpoint(checkpoint.id)
                            ? 'eye'
                            : 'doc-text-inv'
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrentCheckpoint(checkpoint.id)) {
                            toggleView(
                              view === 'editor' ? 'preview' : 'editor'
                            );
                          }
                        }}
                      />
                      {i === checkpoints.length - 1 ? (
                        <button
                          className="inline-flex justify-center py-0.5 px-1 ml-2 text-xs font-medium bg-red-600 hover:bg-red-700 rounded-md border border-transparent focus:ring-1 focus:ring-red-500 focus:ring-offset-1 shadow-sm disabled:opacity-50 focus:outline-none text-text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            const yes = window.confirm(
                              'Are you sure you want to delete this checkpoint?'
                            );
                            if (yes) {
                              deleteCheckpoint(checkpoint.id);
                            }
                          }}
                          type="button"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  )}
                </h3>
                {isCurrentCheckpoint(checkpoint.id) &&
                checkpoint.type !== 'spec' &&
                isEditing ? (
                  <div className="p-3 pt-0 bg-bg-nav">
                    <span className="py-0.5 px-1 text-xs font-semibold text-white rounded-md border bg-accent-faded border-accent">
                      {checkpoint.type === 'output'
                        ? `Expected output: ${checkpoint.output}`
                        : `Regex: /${checkpoint.matchRegex}/g`}
                    </span>
                  </div>
                ) : null}
                {isCurrentCheckpoint(checkpoint.id) && (
                  <div>
                    {view === 'editor' ? (
                      <textarea
                        className="block w-full h-52 border-none text-text-primary bg-bg-primary"
                        defaultValue={checkpoint.description || ''}
                        onBlur={() => setShowStatusIndicator(false)}
                        onChange={(
                          e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                          updateCheckpoint(e.currentTarget.value);
                        }}
                        onFocus={() => setShowStatusIndicator(true)}
                        ref={textareaRef}
                        style={{ resize: 'none' }}
                      />
                    ) : (
                      <ReactMarkdown
                        children={checkpoint.description || ''}
                        className="py-4 px-6 markdown-body"
                        key={checkpoint.description}
                        plugins={[gfm]}
                      />
                    )}
                    {showStatusIndicator && (
                      <StatusIndicatorV2 isActive={showStatusIndicator} />
                    )}
                  </div>
                )}
              </div>
            );
          })
        : null}
    </>
  );
};

type Props = {
  isEditing?: boolean;
  nextStep: () => void;
  step: RegularStepFragment;
};

export default Checkpoints;
