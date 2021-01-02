import { useLessonQuery, useSessionQuery } from '@generated/graphql';
import Info from '@widgets/Lesson/Info';
import Step from '@widgets/Lesson/Step';
import Steps from '@widgets/Lesson/Steps';
import { NextPage } from 'next';
import React, { useState } from 'react';

const Lesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const [currentStepId, setCurrentStepId] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const { data } = useLessonQuery({
    variables: { id },
  });
  const { data: sessionData } = useSessionQuery({
    variables: { lessonId: id },
  });

  const toggleShowSteps = () => {
    setShowSteps(!showSteps);
  };

  if (!data) return null;
  if (!data.lesson) return null;
  if (!data.lesson.steps) return null;

  if (!sessionData) return null;
  if (!sessionData.session) return null;
  if (!sessionData.session.steps) return null;

  const stepId = currentStepId || sessionData.session.currentStep;

  return (
    <div className="flex">
      {showSteps && (
        <div className="w-full absolute top-0 left-0 h-full bg-white bg-opacity-90 py-2 px-4 pl-10 z-10 md:w-2/12">
          <Steps
            currentStepId={stepId}
            lessonId={data.lesson.id}
            setCurrentStepId={setCurrentStepId}
            steps={sessionData.session.steps}
            toggleShowSteps={toggleShowSteps}
          />
        </div>
      )}
      <div className="w-full overflow-hidden lg:h-screen">
        <Info lesson={data.lesson} toggleShowSteps={toggleShowSteps} />
        <Step
          currentStepId={stepId}
          lesson={data.lesson}
          toggleShowSteps={toggleShowSteps}
        />
      </div>
    </div>
  );
};

Lesson.getInitialProps = ({ query }) => ({
  id: query.id as string,
});

export default Lesson;
