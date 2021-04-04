import React from 'react';

import { RegularStepFragment } from '👨‍💻generated/graphql';
import Console from '👨‍💻widgets/Lesson/Output/Console';
import Preview from '👨‍💻widgets/Lesson/Output/Preview';

const Output: React.FC<Props> = ({ ...rest }) => {
  return (
    <div className="flex flex-col justify-between w-full lg:h-full lg:w-1/4">
      <Preview />
      <Console {...rest} />
    </div>
  );
};

type Props = {
  step: RegularStepFragment;
};

export default Output;
