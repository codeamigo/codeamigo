import { ControlledEditor } from '@monaco-editor/react';
import { debounce } from 'debounce';
import React, { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import Icon from '👨‍💻components/Icon';
import {
  RegularStepFragment,
  useCreateCheckpointMutation,
  useUpdateStepInstructionsMutation,
} from '👨‍💻generated/graphql';

import Checkpoints from '../Checkpoints';

const Instructions: React.FC<Props> = (props) => {
  const { isEditting, step } = props;
  const [markdown, setMarkdown] = useState(step?.instructions);
  const [view, toggleView] = useState<'editor' | 'preview'>(
    isEditting ? 'editor' : 'preview'
  );
  const [updateStepM] = useUpdateStepInstructionsMutation();
  const [createCheckpointM] = useCreateCheckpointMutation();

  const updateStep = useCallback(
    debounce((id: number, value: string | undefined) => {
      updateStepM({
        variables: { id, instructions: value || '' },
      });
    }, 1000),
    []
  );

  useEffect(() => {
    setMarkdown(step.instructions);
  }, [step.id]);

  const createCheckpoint = async () => {
    const len = step.checkpoints?.length || 0;

    await createCheckpointM({
      awaitRefetchQueries: true,
      refetchQueries: ['Checkpoints', 'Step'],
      variables: { checkpointId: len + 1, stepId: step.id },
    });
  };

  return (
    <>
      <div
        className="w-full lg:h-full flex flex-col overflow-scroll flex-1"
        id="instructions"
      >
        <h3>
          {isEditting ? (
            <>
              <span
                className={`cursor-pointer ${
                  view === 'editor' ? 'text-blue-600' : 'text-black'
                }`}
                onClick={() => toggleView('editor')}
              >
                Edit Instructions
              </span>
              |
              <span
                className={`cursor-pointer ${
                  view === 'preview' ? 'text-blue-600' : 'text-black'
                }`}
                onClick={() => toggleView('preview')}
              >
                Preview
              </span>
            </>
          ) : null}
        </h3>
        <div
          className={`${
            view === 'editor' ? 'lg:h-80' : ''
          } min-h-2/5 max-h-3/5 lg:flex lg:flex-col border border-r-0 border-gray-200 overflow-scroll`}
        >
          {view === 'editor' ? (
            <ControlledEditor
              onChange={(_, value) => {
                setMarkdown(value);
                updateStep(step.id, value);
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
        <div className="flex flex-col flex-1 relative">
          <Checkpoints {...props} />
        </div>
      </div>
      <div
        className="h-16 flex px-3 items-center justify-between w-full bg-gray-900"
        style={{
          position: 'relative',
          top: '-4px',
        }}
      >
        <div className="flex items-center">
          <Icon
            className="text-white text-2xl cursor-pointer"
            name="list"
            onClick={props.toggleShowSteps}
          />
        </div>
        {isEditting && (
          <button
            className="text-sm font-medium inline-flex justify-center items-center h-8 px-2 border border-transparent shadow-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            onClick={createCheckpoint}
            type="button"
          >
            Add Checkpoint
          </button>
        )}
      </div>
    </>
  );
};

type Props = {
  isEditting?: boolean;
  nextStep: () => void;
  step: RegularStepFragment;
  toggleShowSteps: () => void;
};

export default Instructions;
