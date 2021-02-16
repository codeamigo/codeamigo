import { debounce } from 'debounce';
import React, { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import Button from '👨‍💻components/Button';
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
      refetchQueries: ['Checkpoints', 'Step'],
      variables: { checkpointId: len + 1, stepId: step.id },
    });
  };

  const currentStepNum = props.steps.findIndex(({ id }) => id === step.id) + 1;
  const totalSteps = props.steps.length;

  return (
    <>
      <div
        className="w-full lg:h-full flex flex-col overflow-scroll flex-1"
        id="instructions"
      >
        <h3
          className={`w-full flex justify-between items-center bg-bg-nav text-xs ${
            isEditting ? 'p-2' : ''
          }`}
        >
          {isEditting ? (
            <>
              <span
                className={`cursor-pointer ${
                  view === 'editor' ? 'text-accent' : 'text-text-primary'
                }`}
                onClick={() => toggleView('editor')}
              >
                Edit Instructions
              </span>
              |
              <span
                className={`cursor-pointer ${
                  view === 'preview' ? 'text-accent' : 'text-text-primary'
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
          } min-h-2/5 max-h-3/5 lg:flex lg:flex-col border-b border-bg-nav-offset overflow-scroll`}
        >
          {view === 'editor' ? (
            <textarea
              className="h-full bg-bg-primary text-text-primary border-none"
              defaultValue={markdown || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setMarkdown(e.currentTarget.value);
                updateStep(step.id, e.currentTarget.value);
              }}
              style={{ resize: 'none' }}
            ></textarea>
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
      <div className="h-16 flex px-3 items-center justify-between w-full bg-bg-nav border-t border-bg-nav-offset">
        <div
          className="flex items-center cursor-pointer"
          onClick={props.toggleShowSteps}
        >
          <Icon className="text-white text-2xl" name="list" />
          <div className="text-white text-sm font-semibold ml-3">
            Step: {currentStepNum}/{totalSteps}
          </div>
        </div>
        {isEditting && (
          <Button onClick={createCheckpoint} type="button">
            Add Checkpoint
          </Button>
        )}
      </div>
    </>
  );
};

type Props = {
  isEditting?: boolean;
  nextStep: () => void;
  step: RegularStepFragment;
  steps: RegularStepFragment[];
  toggleShowSteps: () => void;
};

export default Instructions;
