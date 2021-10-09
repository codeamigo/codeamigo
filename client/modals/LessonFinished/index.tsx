import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';

const LessonFinished: React.FC<Props> = () => {
  return (
    <div className="p-6 lg:px-4 mx-auto w-96 max-w-lg">
      <div className="text-3xl">🎉</div>
      <div className="text-xl font-semibold text-text-primary">
        You've Finished {modalVar().data.lessonTitle}!!!
      </div>
      <Button
        className="mt-5 ml-auto h-12 text-lg"
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
