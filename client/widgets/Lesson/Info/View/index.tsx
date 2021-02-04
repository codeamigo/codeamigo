import React from 'react';

import { LessonQuery } from '👨‍💻generated/graphql';

const InfoForm: React.FC<Props> = ({ lesson }) => {
  return (
    <div className="w-full text-center border-0 focus:ring-0 p-0 text-xl bg-bg-nav text-white">
      {lesson?.title}
    </div>
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
};

export default InfoForm;
