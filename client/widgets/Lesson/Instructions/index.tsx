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
    }, 1);
    // hack to scroll back to top of div
    if (document) {
      document?.getElementById('markdown-parent')?.scrollTo({ top: 0 });
    }
  }, [step.id]);

  const currentStepNum = props.steps.findIndex(({ id }) => id === step.id) + 1;
  const totalSteps = props.steps.length;

  return (
    <div className="sm:flex lg:overflow-hidden sm:flex-col-reverse w-full lg:w-96 lg:h-full border-r border-bg-nav-offset-faded">
      <div className="flex justify-between items-center px-3 w-full h-16 sm:border-t bg-bg-nav border-bg-nav-offset-faded">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => !showSteps && setShowSteps(true)}
        >
          <Icon
            className="w-4 text-2xl text-text-primary"
            name={showSteps ? 'cancel-squared' : 'list'}
          />
          <div className="ml-3 text-sm font-semibold text-text-primary">
            Step: {currentStepNum}/{totalSteps}
          </div>
        </div>
      </div>
      <div
        className="flex overflow-scroll flex-col flex-1 w-full lg:h-full border-b md:border-b-0 border-bg-nav-offset-faded"
        id="instructions"
      >
        <h3
          className={`w-full flex justify-between items-center bg-bg-nav text-xs ${
            isEditing ? 'p-1.5 border-b border-bg-nav-offset-faded' : ''
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
        <div className={`lg:flex lg:flex-col h-full`} id="markdown-parent">
          {view === 'editor' ? (
            <textarea
              className="w-full h-40 md:h-full border-none text-text-primary bg-bg-primary"
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
              className="py-4 px-6 h-full markdown-body"
              plugins={[gfm]}
            />
          )}
        </div>
        <div className="flex relative flex-col flex-1">
          <Checkpoints {...props} />
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
