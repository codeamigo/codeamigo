import Icon from '@components/Icon';
import { LessonQuery } from '@generated/graphql';
import React from 'react';

const InfoForm: React.FC<Props> = ({ lesson, toggleShowSteps }) => {
  return (
    <div className="w-full text-center border-0 focus:ring-0 p-0 text-xl bg-gray-800 text-white">
      {lesson?.title}
    </div>
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
  toggleShowSteps: () => void;
};

export default InfoForm;
