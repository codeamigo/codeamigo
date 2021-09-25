import React from 'react';

import { RegularStepFragment } from '👨‍💻generated/graphql';
import RijuTemplate from '👨‍💻widgets/Lesson/Executors/Riju/RijuExecutor/template';
import { modToFile } from '👨‍💻widgets/Lesson/Executors/utils';
import { Props as OwnProps } from '👨‍💻widgets/Lesson/Step';

const RijuExecutor: React.FC<Props> = (props) => {
  const files = props.step.codeModules?.reduce(modToFile, {});

  return <RijuTemplate {...props} files={files} />;
};

export type Props = OwnProps & {
  editorRef: React.RefObject<HTMLDivElement>;
  filesHeight?: number;
  filesRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
  maxDragWidth: number | null;
  nextStep: () => void;
  onDragEnd: () => void;
  previewRef: React.RefObject<HTMLDivElement>;
  step: RegularStepFragment;
  updateWidths: (x: number) => void;
};

export default RijuExecutor;
