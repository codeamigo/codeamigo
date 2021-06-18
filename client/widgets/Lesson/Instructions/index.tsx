import { debounce } from 'debounce';
import React, { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import Icon from '👨‍💻components/Icon';
import {
  LessonQuery,
  RegularStepFragment,
  useUpdateStepInstructionsMutation,
} from '👨‍💻generated/graphql';

import Checkpoints from '../Checkpoints';

const Instructions: React.FC<Props> = (props) => {
  const { isEditing, setShowSteps, showSteps, step } = props;
  const [markdown, setMarkdown] = useState(step?.instructions);
  const [view, toggleView] = useState<'editor' | 'preview'>(
    isEditing ? 'editor' : 'preview'
  );
  const [updateStepM] = useUpdateStepInstructionsMutation();

  const updateStep = useCallback(
    debounce((id: number, value: string | undefined) => {
      updateStepM({
        variables: { id, instructions: value || '' },
      });
    }, 1000),
    []
  );

  useEffect(() => {
    // hack so that instructions update
    toggleView('preview');
    setMarkdown(step.instructions);
    setTimeout(() => {
      toggleView(isEditing ? 'editor' : 'preview');
    }, 10);
  }, [step.id]);

  const currentStepNum = props.steps.findIndex(({ id }) => id === step.id) + 1;
  const totalSteps = props.steps.length;

  return (
    <div className="sm:flex sm:flex-col w-full lg:h-full lg:overflow-hidden lg:w-1/4 border-r border-bg-nav-offset">
      <div
        className="w-full lg:h-full flex flex-col overflow-scroll flex-1"
        id="instructions"
      >
        <h3
          className={`w-full flex justify-between items-center bg-bg-nav text-xs ${
            isEditing ? 'p-2' : ''
          }`}
        >
          {isEditing ? (
            <>
              <span
                className={`cursor-pointer ${
                  view === 'editor' ? 'text-accent' : 'text-text-primary'
                }`}
                onClick={() => toggleView('editor')}
              >
                Edit Instructions
              </span>
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
          onClick={() => !showSteps && setShowSteps(true)}
        >
          <Icon
            className="text-text-primary text-2xl w-4"
            name={showSteps ? 'cancel-squared' : 'list'}
          />
          <div className="text-text-primary text-sm font-semibold ml-3">
            Step: {currentStepNum}/{totalSteps}
          </div>
        </div>
      </div>
    </div>
  );
};

type Props = {
  isEditing?: boolean;
  isPreviewing?: boolean;
  lesson: LessonQuery['lesson'];
  nextStep: () => void;
  setShowSteps: (val: boolean) => void;
  showSteps: boolean;
  step: RegularStepFragment;
  steps: RegularStepFragment[];
};

export default Instructions;
