import React from 'react';

import { LessonQuery } from '👨‍💻generated/graphql';

const InfoForm: React.FC<Props> = ({ lesson }) => {
  return (
    <div className="w-full text-center border-0 focus:ring-0 p-0 text-xl bg-transparent overflow-x-hidden text-text-primary overflow-ellipsis whitespace-nowrap">
      {lesson?.title}
    </div>
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
};

export default InfoForm;
