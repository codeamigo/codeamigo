import { useLessonQuery, useSessionQuery } from '@generated/graphql';
import Info from '@widgets/Lesson/Info';
import Step from '@widgets/Lesson/Step';
import Steps from '@widgets/Lesson/Steps';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useGlobalState } from '../../state';

const Lesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const router = useRouter();
  const [user] = useGlobalState('user');
  const [currentStepId, setCurrentStepId] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    if (user.loading) return;

    if (!user.data?.me) router.push('/');
  }, [user]);

  const { data } = useLessonQuery({
    variables: { id },
  });
  const { data: sessionData } = useSessionQuery({
    fetchPolicy: 'cache-and-network',
    variables: { lessonId: id },
  });

  const toggleShowSteps = () => {
    setShowSteps(!showSteps);
  };

  if (!data) return null;
  if (!data.lesson) return null;
  if (!data.lesson.steps) return null;

  if (!sessionData) {
    router.push(`/lessons/start/${id}`);
    return null;
  }
  if (!sessionData.session) return null;
  if (!sessionData.session.steps) return null;

  const stepId = currentStepId || sessionData.session.currentStep;

  return (
    <div className="flex">
      <Steps
        currentStepId={stepId}
        lessonId={data.lesson.id}
        setCurrentStepId={setCurrentStepId}
        showSteps={showSteps}
        steps={sessionData.session.steps}
      />
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
