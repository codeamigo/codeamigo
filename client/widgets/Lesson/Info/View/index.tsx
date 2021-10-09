import React from 'react';

import { LessonQuery } from '👨‍💻generated/graphql';

const InfoForm: React.FC<Props> = ({ lesson }) => {
  return (
    <div className="overflow-x-hidden p-0 w-full text-center text-text-primary overflow-ellipsis whitespace-nowrap bg-transparent border-0 focus:ring-0">
      {lesson?.title}
    </div>
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
};

export default InfoForm;
