import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useLessonQuery, useMeQuery } from '👨‍💻generated/graphql';
import Info from '👨‍💻widgets/Lesson/Info';
import Step from '👨‍💻widgets/Lesson/Step';
import Steps from '👨‍💻widgets/Lesson/Steps';

const EditLesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const [currentStepId, setCurrentStepId] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const router = useRouter();
  const { data: meData } = useMeQuery();
  const { data } = useLessonQuery({
    variables: { id },
  });

  if (!data) return null;
  if (!data.lesson) return null;
  if (!data.lesson.steps) return null;

  if (data.lesson.owner.id !== meData?.me?.id) {
    if (typeof window !== 'undefined') {
      router.push('/');
      return null;
    }
  }

  const stepId = currentStepId || data.lesson.steps[0].id;

  return (
    <div className="flex">
      <Steps
        currentStepId={stepId}
        isEditting
        lessonId={data.lesson.id}
        setCurrentStepId={setCurrentStepId}
        setShowSteps={setShowSteps}
        showSteps={showSteps}
        steps={data.lesson.steps}
      />
      <div className="w-full overflow-hidden lg:h-screen">
        <Info isEditting lesson={data.lesson} />
        <Step
          currentStepId={stepId}
          isEditting
          lesson={data.lesson}
          setShowSteps={setShowSteps}
          showSteps={showSteps}
        />
      </div>
    </div>
  );
};

EditLesson.getInitialProps = ({ query }) => ({
  id: query.id as string,
});

export default EditLesson;
