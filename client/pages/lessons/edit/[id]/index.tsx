import { useLessonQuery } from '@generated/graphql';
import Info from '@widgets/Lesson/Info';
import Step from '@widgets/Lesson/Step';
import Steps from '@widgets/Lesson/Steps';
import { NextPage } from 'next';
import React, { useState } from 'react';

const EditLesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const [currentStepId, setCurrentStepId] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const { data } = useLessonQuery({
    variables: { id },
  });

  const toggleShowSteps = () => {
    setShowSteps(!showSteps);
  };

  if (!data) return null;
  if (!data.lesson) return null;
  if (!data.lesson.steps) return null;

  const stepId = currentStepId || data.lesson.steps[0].id;

  return (
    <div className="flex">
      <Steps
        currentStepId={stepId}
        isEditting
        lessonId={data.lesson.id}
        setCurrentStepId={setCurrentStepId}
        showSteps={showSteps}
        steps={data.lesson.steps}
      />
      <div className="w-full overflow-hidden lg:h-screen">
        <Info
          isEditting
          lesson={data.lesson}
          toggleShowSteps={toggleShowSteps}
        />
        <Step
          currentStepId={stepId}
          isEditting
          lesson={data.lesson}
          toggleShowSteps={toggleShowSteps}
        />
      </div>
    </div>
  );
};

EditLesson.getInitialProps = ({ query }) => ({
  id: query.id as string,
});

export default EditLesson;
