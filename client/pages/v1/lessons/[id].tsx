import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
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

    if (!meData?.me) router.replace(`/lessons/preview/${id}`);
  }, [meData]);

  useEffect(() => {
    setShowSteps(false);
  }, [currentStepId]);

  // lesson
  if (loading) return null;

  // no lesson exists
  if (!data || !data.lesson) {
    if (typeof window !== 'undefined') {
      router.replace(`/lessons/preview/${id}`);
    }
    return null;
  }
  if (!data.lesson.steps) return null;

  // no session exists
  if (!sessionData || !sessionData.session) {
    if (typeof window !== 'undefined') {
      router.replace(`/lessons/start/${id}`);
    }
    return null;
  }

  if (!sessionData.session.steps) return null;

  if (sessionData.session.requiresUpdate) {
    modalVar({
      callback: () => null,
      data: {
        lessonId: sessionData.session.lesson.id,
        lessonTitle: sessionData.session.lesson.title,
        sessionId: sessionData.session.id,
      },
      name: 'updateSession',
      persistent: false,
    });
  }

  const stepId = currentStepId || sessionData.session.currentStep;

  return (
    <div className="flex">
      <Head>
        <title>codeamigo - {data.lesson.title}</title>
      </Head>
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
      <div className="w-full md:h-screen lg:overflow-hidden">
        <Info
          isLessonOwner={meData?.me?.id === data.lesson.owner.id}
          lesson={data.lesson}
        />
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
