import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';

const LessonFinished: React.FC<Props> = () => {
  return (
    <div className="max-w-lg w-96 mx-auto p-6 lg:px-4">
      <div className="text-3xl">🎉</div>
      <div className="text-xl text-text-primary font-semibold">
        You've Finished {modalVar().data.lessonTitle}!!!
      </div>
      <Button
        className="h-12 text-lg ml-auto mt-5"
        onClick={() => {
          modalVar().callback();
          modalVar(InitialModalState);
        }}
      >
        Find Another Lesson
      </Button>
    </div>
  );
};

type Props = {};

export default LessonFinished;
