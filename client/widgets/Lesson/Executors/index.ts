import {
  RegularCheckpointFragment,
  RegularStepFragment,
} from '👨‍💻generated/graphql';
import { Props as OwnProps } from '👨‍💻widgets/Lesson/Step';

export type Props = OwnProps & {
  checkpoints: RegularStepFragment['checkpoints'];
  ctaRef: React.RefObject<HTMLButtonElement>;
  currentStepNum: number;
  editorRef: React.RefObject<HTMLDivElement>;
  filesHeight?: number;
  filesRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
  maxDragWidth: number | null;
  nextStep: () => void;
  onDragEnd: () => void;
  onRunMatchTest: (checkpoint: RegularCheckpointFragment) => void;
  onTestStart: () => void;
  prevStep: () => void;
  previewRef: React.RefObject<HTMLIFrameElement>;
  step: RegularStepFragment;
  totalStepsNum: number;
  updateWidths: (x: number) => void;
};
