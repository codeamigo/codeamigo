import { ControlledEditor } from '@monaco-editor/react';
import { debounce } from 'debounce';
import React, { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import {
  RegularStepFragment,
  SessionQuery,
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

  const nextStep = () => {
    if (!props.session?.steps) return;
    if (!props.setCurrentStepId) return;

    const next = props.session.steps.find(
      (nextStep) => nextStep.createdAt > step.createdAt
    );

    if (!next) return;

    props.setCurrentStepId(next?.id);
  };

  return (
    <>
      <div className="w-full lg:h-full flex flex-col">
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
          ) : (
            <span>Instructions</span>
          )}
        </h3>
        <div className="h-80 lg:min-h-3/5 lg:flex lg:flex-col rounded-md border border-gray-200 overflow-scroll">
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
        <div className="flex flex-col">
          <Checkpoints {...props} nextStep={nextStep} />
        </div>
      </div>
    </>
  );
};

type Props = {
  isEditting?: boolean;
  session?: SessionQuery['session'];
  setCurrentStepId?: (n: number) => void;
  step: RegularStepFragment;
};

export default Instructions;
