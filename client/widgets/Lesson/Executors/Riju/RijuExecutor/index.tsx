import React from 'react';

import { Props } from '👨‍💻widgets/Lesson/Executors';
import RijuTemplate from '👨‍💻widgets/Lesson/Executors/Riju/RijuExecutor/template';
import { modToFile } from '👨‍💻widgets/Lesson/Executors/utils';

const RijuExecutor: React.FC<Props> = (props) => {
  const files = props.step.codeModules?.reduce(modToFile, {});

  return <RijuTemplate {...props} files={files} />;
};

export default RijuExecutor;
