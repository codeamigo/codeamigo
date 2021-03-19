import { NextPage } from 'next';
import React, { useState } from 'react';

import { useLessonQuery } from '👨‍💻generated/graphql';
import Info from '👨‍💻widgets/Lesson/Info';
import Step from '👨‍💻widgets/Lesson/Step';
import Steps from '👨‍💻widgets/Lesson/Steps';

const PreviewLesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const [currentStepId, setCurrentStepId] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const { data } = useLessonQuery({
    variables: { id },
  });

  if (!data) return null;
  if (!data.lesson) return null;
  if (!data.lesson.steps) return null;

  const stepId = currentStepId || data.lesson.steps[0].id;

  return (
    <div className="flex">
      <Steps
        currentStepId={stepId}
        lessonId={data.lesson.id}
        setCurrentStepId={setCurrentStepId}
        setShowSteps={setShowSteps}
        showSteps={showSteps}
        steps={data.lesson.steps}
      />
      <div className="w-full overflow-hidden lg:h-screen">
        <Info lesson={data.lesson} />
        <Step
          currentStepId={stepId}
          isPreviewing
          lesson={data.lesson}
          setShowSteps={setShowSteps}
          showSteps={showSteps}
        />
      </div>
    </div>
  );
};

PreviewLesson.getInitialProps = ({ query }) => ({
  id: query.id as string,
});

export default PreviewLesson;
