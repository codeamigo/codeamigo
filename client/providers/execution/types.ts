import { TokenUsageStatusType } from 'types';

import {
  CheckpointsQuery,
  CodeModulesQuery,
  LessonQuery,
  Step,
} from '👨‍💻generated/graphql';

export type FCProviderType = {
  checkpoints: CheckpointsQuery['checkpoints'];
  codeModules: CodeModulesQuery['codeModules'];
  currentCheckpoint: number;
  files: { [key: string]: { code: string } };
  hoverSelection: string | null;
  isLessonPurchased: boolean;
  isLoggedIn: boolean;
  isStepComplete: boolean;
  leftPanelHeight: {
    editor: string;
    instructions: string;
  };
  lesson: LessonQuery['lesson'];
  loading: boolean;
  maxTokensUsed: boolean;
  onReady: () => void;
  setCheckpoints: React.Dispatch<
    React.SetStateAction<CheckpointsQuery['checkpoints'] | undefined>
  >;
  setCurrentCheckpoint: React.Dispatch<React.SetStateAction<number>>;
  setEditorReady: React.Dispatch<React.SetStateAction<boolean>>;
  setHoverSelection: React.Dispatch<React.SetStateAction<string | null>>;
  setIsStepComplete: React.Dispatch<React.SetStateAction<boolean>>;
  setLeftPanelHeight: React.Dispatch<
    React.SetStateAction<{
      editor: string;
      instructions: string;
    }>
  >;
  setTokensUsed: React.Dispatch<React.SetStateAction<number | null>>;
  step: Step;
  tokenUsageStatus: TokenUsageStatusType;
  tokensUsed: number | null;
};
