import { debounce } from 'debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import {
  LessonQuery,
  RegularStepFragment,
  StepDocument,
  StepQuery,
  useUpdateStepInstructionsMutation,
} from '👨‍💻generated/graphql';
import CheckpointWizard from '👨‍💻widgets/CheckpointWizard';
import StatusIndicatorV2 from '👨‍💻widgets/Lesson/Info/StatusIndicatorV2';
import LessonBottomBarWrapper from '👨‍💻widgets/LessonBottomBarWrapper';

import Checkpoints from '../Checkpoints';

const Instructions: React.FC<Props> = (props) => {
  const { isEditing, setShowSteps, showSteps, step } = props;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [markdown, setMarkdown] = useState(step?.instructions);
  const [showStatusIndicator, setShowStatusIndicator] = useState(false);
  const [view, toggleView] = useState<'editor' | 'preview'>(
    isEditing ? 'editor' : 'preview'
  );
  const [updateStepM] = useUpdateStepInstructionsMutation();

  const updateStep = useCallback(
    debounce((id: number, value: string | undefined) => {
      const q = {
        query: StepDocument,
        variables: { id },
      };

      updateStepM({
        update: (store) => {
          const stepData = store.readQuery<StepQuery>(q);
          if (!stepData?.step) return;

          store.writeQuery<StepQuery>({
            ...q,
            data: {
              step: {
                ...stepData.step,
                instructions: value || '',
              },
            },
          });
        },
        variables: { id, instructions: value || '' },
      });
    }, 1000),
    []
  );

  useEffect(() => {
    // hack to update instructions
    toggleView('preview');
    setMarkdown(step.instructions);
    setTimeout(() => {
      toggleView(isEditing ? 'editor' : 'preview');
      isEditing && textareaRef.current?.focus();
    }, 1);
    // hack to scroll back to top of div
    if (document) {
      document?.getElementById('markdown-parent')?.scrollTo({ top: 0 });
    }
  }, [step.id]);

  return (
    <div className="sm:flex sm:flex-col-reverse w-full lg:w-1/4 lg:h-full border-r border-bg-nav-offset-faded">
      <LessonBottomBarWrapper padding>
        <div
          aria-label="View Steps"
          className="flex items-center cursor-pointer hint--right hint--no-animate"
          onClick={() => !showSteps && setShowSteps(true)}
        >
          <Icon
            className="w-4 text-2xl text-text-primary"
            name={showSteps ? 'cancel-squared' : 'list'}
          />
        </div>
        <div>
          {isEditing ? (
            <div className="group relative z-30 text-sm">
              <Button className="justify-center" nature="secondary">
                Add Checkpoint
              </Button>
              <CheckpointWizard step={step} />
            </div>
          ) : null}
        </div>
      </LessonBottomBarWrapper>
      <div
        className="flex overflow-scroll flex-col flex-1 w-full lg:h-full border-b md:border-b-0 border-bg-nav-offset-faded"
        id="instructions"
      >
        <h3
          className={`w-full flex sticky top-0 left-0 z-10 justify-between items-center bg-bg-nav text-xs ${
            isEditing ? 'p-1.5 border-b border-bg-nav-offset-faded' : ''
          }`}
        >
          {isEditing ? (
            <>
              <span
                className="cursor-pointer text-text-primary"
                onClick={() =>
                  toggleView(view === 'preview' ? 'editor' : 'preview')
                }
              >
                {view === 'preview' ? 'Edit Instructions' : 'Preview'}
              </span>
            </>
          ) : null}
        </h3>
        <div
          className={`lg:flex lg:flex-col h-full relative`}
          id="markdown-parent"
        >
          {view === 'editor' ? (
            <textarea
              className="w-full h-48 lg:h-full border-none text-text-primary bg-bg-primary"
              defaultValue={markdown || ''}
              onBlur={() => setShowStatusIndicator(false)}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setMarkdown(e.currentTarget.value);
                updateStep(step.id, e.currentTarget.value);
              }}
              onFocus={() => setShowStatusIndicator(true)}
              ref={textareaRef}
              style={{ resize: 'none' }}
            ></textarea>
          ) : (
            <ReactMarkdown
              children={markdown || ''}
              className="py-4 px-6 markdown-body"
              plugins={[gfm]}
            />
          )}
          <StatusIndicatorV2 isActive={showStatusIndicator} />
        </div>
        <div className="flex relative flex-col flex-1 bg-bg-primary">
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
};

export default Instructions;
