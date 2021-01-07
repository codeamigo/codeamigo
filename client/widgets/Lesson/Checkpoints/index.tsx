import {
  RegularCheckpointFragment,
  RegularStepFragment,
  useCheckpointsQuery,
  useCreateCheckpointMutation,
  useDeleteCheckpointMutation,
  useUpdateCheckpointMutation,
} from '@generated/graphql';
import { ControlledEditor } from '@monaco-editor/react';
import debounce from 'debounce';
import React, { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import Icon from '../../../components/Icon';

const Checkpoints: React.FC<Props> = ({ isEditting, nextStep, step }) => {
  const { data, loading } = useCheckpointsQuery({
    variables: { stepId: step.id },
  });
  const [createCheckpointM] = useCreateCheckpointMutation();
  const [updateCheckpointM] = useUpdateCheckpointMutation();
  const [deleteCheckpointM] = useDeleteCheckpointMutation();
  const [view, toggleView] = useState<'editor' | 'preview'>(
    isEditting ? 'editor' : 'preview'
  );
  const [activeCheckpoint, setActiveCheckpoint] = useState<
    RegularCheckpointFragment | undefined
  >(undefined);
  const [markdown, setMarkdown] = useState(activeCheckpoint?.description);

  useEffect(() => {
    if (activeCheckpoint && isEditting) return;

    if (nextCheckpoint?.id !== activeCheckpoint?.id) {
      setActiveCheckpoint(nextCheckpoint);
    }
  }, [data?.checkpoints]);

  useEffect(() => {
    setMarkdown(activeCheckpoint?.description);
    if (isEditting) toggleView('editor');
  }, [activeCheckpoint?.id]);

  const updateCheckpoint = useCallback(
    debounce((value: string | undefined) => {
      if (!activeCheckpoint) return;

      updateCheckpointM({
        refetchQueries: ['Checkpoints', 'Step'],
        variables: { description: value || '', id: activeCheckpoint.id },
      });
    }, 1000),
    [activeCheckpoint]
  );

  if (loading) return null;
  if (!data?.checkpoints) return null;

  const { checkpoints } = data;

  const nextCheckpoint = isEditting
    ? checkpoints[0]
    : checkpoints.find((checkpoint) => !checkpoint.isCompleted);

  const createCheckpoint = async () => {
    const len = data?.checkpoints?.length || 0;

    await createCheckpointM({
      refetchQueries: ['Checkpoints', 'Step'],
      variables: { checkpointId: len + 1, stepId: step.id },
    });
  };

  const deleteCheckpoint = async (id: number) => {
    const len = data?.checkpoints?.length || 0;

    if (activeCheckpoint?.id === id) {
      setActiveCheckpoint(checkpoints[len - 1 - 1]);
    }

    await deleteCheckpointM({
      refetchQueries: ['Checkpoints', 'Step'],
      variables: { id },
    });
  };

  const isCurrentCheckpoint = (id: number) => id === activeCheckpoint?.id;

  return (
    <>
      {checkpoints.length
        ? checkpoints.map((checkpoint, i) => {
            return (
              <div key={checkpoint.id}>
                <h3
                  className="w-full flex justify-between items-center bg-gray-100 p-2 text-xs cursor-pointer"
                  onClick={() => {
                    if (isCurrentCheckpoint(checkpoint.id)) {
                      setActiveCheckpoint(undefined);
                    } else {
                      setActiveCheckpoint(checkpoint);
                    }
                  }}
                >
                  <span className="flex items-center">
                    <Icon
                      className="text-gray-600 mr-2"
                      name={
                        isCurrentCheckpoint(checkpoint.id)
                          ? 'down-dir'
                          : 'right-dir'
                      }
                    />
                    <span>Checkpoint {i + 1} </span>
                  </span>
                  {!isEditting && checkpoint.isCompleted && <span>✅</span>}
                  {isEditting && (
                    <div className="flex">
                      <Icon
                        className="text-gray-700 text-lg leading-none"
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
                          className="inline-flex justify-center py-0.5 px-1 ml-2 border border-transparent shadow-xs text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50"
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
                {isCurrentCheckpoint(checkpoint.id) && (
                  <div
                    className={`${
                      isEditting ? 'h-24' : ''
                    } min-h-24 overflow-scroll`}
                  >
                    {view === 'editor' ? (
                      <ControlledEditor
                        onChange={(_, value) => {
                          setMarkdown(value || '');
                          updateCheckpoint(value);
                        }}
                        options={{
                          automaticLayout: true,
                          minimap: { enabled: false },
                          quickSuggestions: false,
                          scrollBeyondLastLine: false,
                          wordWrap: 'on',
                        }}
                        value={markdown}
                      />
                    ) : (
                      <ReactMarkdown
                        children={markdown || ''}
                        className="markdown-body px-6 py-4"
                        plugins={[gfm]}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })
        : null}
      {isEditting && (
        <div className="mt-4">
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            onClick={createCheckpoint}
            type="button"
          >
            Add Checkpoint
          </button>
        </div>
      )}
      {!isEditting &&
        (checkpoints.some((checkpoint) => !!checkpoint.isCompleted) ||
          !checkpoints.length) && (
          <div className="mt-4">
            <button
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              onClick={nextStep}
              type="button"
            >
              Next Step
            </button>
          </div>
        )}
    </>
  );
};

type Props = {
  isEditting?: boolean;
  nextStep: () => void;
  step: RegularStepFragment;
};

export default Checkpoints;
