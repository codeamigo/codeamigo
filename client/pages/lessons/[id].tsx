import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import {
  useLessonQuery,
  useMeQuery,
  useSessionQuery,
} from '👨‍💻generated/graphql';
import Info from '👨‍💻widgets/Lesson/Info';
import Step from '👨‍💻widgets/Lesson/Step';
import Steps from '👨‍💻widgets/Lesson/Steps';

const Lesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const router = useRouter();
  const [currentStepId, setCurrentStepId] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const { data: meData, loading: meLoading } = useMeQuery();

  const { data, loading } = useLessonQuery({
    variables: { id },
  });
  const { data: sessionData, loading: sessionLoading } = useSessionQuery({
    variables: { lessonId: id },
  });

  useEffect(() => {
    if (meLoading) return;

    if (!meData?.me) router.push('/');
  }, [meData]);

  useEffect(() => {
    setShowSteps(false);
  }, [currentStepId]);

  // lesson
  if (loading) return null;

  // no lesson exists
  if (!data || !data.lesson) {
    if (typeof window !== 'undefined') {
      router.push(`/`);
    }
    return null;
  }
  if (!data.lesson.steps) return null;

  // no session exists
  if (!sessionData || !sessionData.session) {
    if (typeof window !== 'undefined') {
      router.push(`/lessons/start/${id}`);
    }
    return null;
  }
  if (!sessionData.session.steps) return null;

  const stepId = currentStepId || sessionData.session.currentStep;

  console.log(sessionData.session.steps);

  return (
    <div className="flex">
      {sessionData ? (
        <Steps
          activeSessionStepId={sessionData.session.currentStep}
          currentStepId={stepId}
          lessonId={data.lesson.id}
          setCurrentStepId={setCurrentStepId}
          setShowSteps={setShowSteps}
          showSteps={showSteps}
          steps={sessionData.session.steps}
        />
      ) : // TODO: loading states
      null}
      <div className="w-full lg:overflow-hidden md:h-screen">
        <Info lesson={data.lesson} />
        {sessionData.session ? (
          <Step
            currentStepId={stepId}
            lesson={data.lesson}
            session={sessionData.session}
            setCurrentStepId={setCurrentStepId}
            setShowSteps={setShowSteps}
            showSteps={showSteps}
          />
        ) : // TODO: loading states
        null}
      </div>
    </div>
  );
};

Lesson.getInitialProps = ({ query }) => ({
  id: query.id as string,
});

export default Lesson;
