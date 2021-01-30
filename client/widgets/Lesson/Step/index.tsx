import React from 'react';

import {
  LessonQuery,
  SessionDocument,
  SessionQuery,
  useCompleteStepMutation,
  useSetNextStepMutation,
  useStepQuery,
} from '👨‍💻generated/graphql';
import Console from '👨‍💻widgets/Console';
import Editor from '👨‍💻widgets/Lesson/Editor';
import Instructions from '👨‍💻widgets/Lesson/Instructions';

const Step: React.FC<Props> = ({
  currentStepId: id,
  session,
  setCurrentStepId,
  ...rest
}) => {
  const [completeStep] = useCompleteStepMutation();
  const [setNextStep] = useSetNextStepMutation();
  const { data } = useStepQuery({
    fetchPolicy: 'cache-and-network',
    variables: { id },
  });

  if (!data) return null;
  if (!data.step) return null;

  const nextStep = () => {
    if (!session?.steps) return;
    if (!setCurrentStepId) return;
    if (!data.step) return;

    const next = session.steps.find(
      (nextStep) =>
        data.step?.createdAt && nextStep.createdAt > data.step.createdAt
    );

    const q = {
      query: SessionDocument,
      variables: { lessonId: session?.lesson.id },
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
        variables: { sessionId: session.id, stepId: next.id },
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
      variables: { id: data.step.id },
    });

    if (!next) return;

    // TODO: replace setCurrentStepId w/ session.currentStep
    // isEditting ? set lesson current step : set session
    setCurrentStepId(next?.id);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:h-full-minus">
        <div className="flex w-full lg:h-full lg:overflow-scroll lg:w-1/4">
          <Instructions nextStep={nextStep} step={data.step} {...rest} />
        </div>
        <div className="flex w-full lg:h-full lg:overflow-scroll lg:w-2/4">
          <Editor nextStep={nextStep} step={data.step} {...rest} />
        </div>
        <div className="flex flex-col justify-between w-full lg:h-full lg:w-1/4">
          <iframe
            className="w-full h-full"
            id="frame"
            src={process.env.NEXT_PUBLIC_PREVIEW_URL}
          ></iframe>
          <Console step={data.step} />
        </div>
      </div>
    </>
  );
};

type Props = {
  currentStepId: number;
  isEditting?: boolean;
  lesson: LessonQuery['lesson'];
  session?: SessionQuery['session'];
  setCurrentStepId?: (n: number) => void;
  toggleShowSteps: () => void;
};

export default Step;
