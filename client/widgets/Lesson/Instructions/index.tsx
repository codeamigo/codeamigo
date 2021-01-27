import { ControlledEditor } from '@monaco-editor/react';
import { debounce } from 'debounce';
import React, { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import {
  RegularStepFragment,
  SessionDocument,
  SessionQuery,
  useCompleteStepMutation,
  useSetNextStepMutation,
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
  const [completeStep] = useCompleteStepMutation();
  const [setNextStep] = useSetNextStepMutation();

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

    const q = {
      query: SessionDocument,
      variables: { lessonId: props.session?.lesson.id },
    };

    if (next) {
      setNextStep({
        update: (store) => {
          const sessionData = store.readQuery<SessionQuery>(q);
          if (!sessionData?.session) return;

          store.writeQuery<SessionQuery>({
            ...q,
            data: {
              session: {
                ...sessionData.session,
                currentStep: next.id,
              },
            },
          });
        },
        variables: { sessionId: props.session.id, stepId: next.id },
      });
    }

    completeStep({
      update: (store, { data }) => {
        const sessionData = store.readQuery<SessionQuery>(q);
        if (!sessionData?.session) return;
        if (!sessionData?.session?.steps) return;

        store.writeQuery<SessionQuery>({
          ...q,
          data: {
            session: {
              ...sessionData.session,
              steps: sessionData.session.steps.map((step) => {
                if (step.id !== data?.completeStep?.id) return step;

                return {
                  ...step,
                  isCompleted: true,
                };
              }),
            },
          },
        });
      },
      variables: { id: props.step.id },
    });

    if (!next) return;

    // TODO: replace setCurrentStepId w/ session.currentStep
    // isEditting ? set lesson current step : set session
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
          ) : null}
        </h3>
        <div
          className={`${
            view === 'editor' ? 'lg:h-80' : ''
          } max-h-3/5 lg:flex lg:flex-col border border-r-0 border-gray-200 overflow-scroll`}
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
        <div className="flex flex-col relative">
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
