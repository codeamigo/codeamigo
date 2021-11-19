import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import {
  getDonations,
  getLessonCurrentStepId,
  getOrSetLessonsItem,
  setLessonItem,
} from '👨‍💻apollo/localStorage';
import {
  SessionQuery,
  useLessonQuery,
  useUpdateLessonViewsMutation,
} from '👨‍💻generated/graphql';
import Info from '👨‍💻widgets/Lesson/Info';
import Step from '👨‍💻widgets/Lesson/Step';
import Steps from '👨‍💻widgets/Lesson/Steps';

const PreviewLesson: NextPage<{ id: string }> = (props) => {
  const id = parseInt(props.id);
  const [currentStepId, setCurrentStepId] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [updateLessonViews] = useUpdateLessonViewsMutation();
  const { data } = useLessonQuery({
    variables: { id },
  });

  useEffect(() => {
    updateLessonViews({ variables: { id } });
  }, []);

  useEffect(() => {
    getOrSetLessonsItem();
  }, []);

  useEffect(() => {
    if (!currentStepId) return;
    setLessonItem(id, currentStepId);
  }, [currentStepId]);

  useEffect(() => {
    const donations = getDonations();

    // if (!donations.hasDonated && !donations.dontAskAgain) {
    //   modalVar({
    //     callback: () => null,
    //     name: 'donate',
    //   });
    // }
  }, []);

  if (!data) return null;
  if (!data.lesson) return null;
  if (!data.lesson.steps) return null;

  const stepId =
    currentStepId || getLessonCurrentStepId(id) || data.lesson.steps[0].id;

  return (
    <div className="flex">
      <Steps
        currentStepId={stepId}
        isPreviewing
        lessonId={data.lesson.id}
        setCurrentStepId={setCurrentStepId}
        setShowSteps={setShowSteps}
        showSteps={showSteps}
        steps={data.lesson.steps}
      />
      <div className="lg:overflow-hidden w-full md:h-screen">
        <Info isPreviewing lesson={data.lesson} />
        <Step
          currentStepId={stepId}
          isPreviewing
          lesson={data.lesson}
          setCurrentStepId={setCurrentStepId}
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
