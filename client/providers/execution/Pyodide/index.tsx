import { SandpackLayout, SandpackStack } from '@codesandbox/sandpack-react';
import { FCProviderType } from 'providers/execution/types';
import React from 'react';

import { Step } from '👨‍💻generated/graphql';
import Chatbot from '👨‍💻widgets/Chatbot';
import Instructions from '👨‍💻widgets/Instructions';
import MonacoEditor from '👨‍💻widgets/MonacoEditor';

const PyodideExecutionProvider: React.FC<FCProviderType> = ({
  checkpoints,
  codeModules,
  currentCheckpoint,
  files,
  hoverSelection,
  isLessonPurchased,
  isLoggedIn,
  isStepComplete,
  leftPanelHeight,
  lesson,
  loading,
  maxTokensUsed,
  setCheckpoints,
  setCurrentCheckpoint,
  setEditorReady,
  setHoverSelection,
  setIsStepComplete,
  setLeftPanelHeight,
  setTokensUsed,
  step,
  tokenUsageStatus,
  tokensUsed,
}) => {
  return (
    <div className="flex h-full text-xs font-normal">
      <SandpackStack className="editor-instructions-container !h-full">
        <Instructions
          instructions={step?.instructions as string}
          leftPanelHeight={leftPanelHeight}
          setLeftPanelHeight={setLeftPanelHeight}
        />
        {/* TODO: is there anyway to prevent this from going to null? */}
        {loading || !files ? null : (
          <MonacoEditor
            activeFile="index.py"
            checkpoints={checkpoints}
            code={files['index.py'].code}
            codeModules={codeModules}
            currentCheckpoint={currentCheckpoint}
            disabled={maxTokensUsed}
            files={files}
            hoverSelection={hoverSelection}
            isLessonPurchased={isLessonPurchased}
            isLoggedIn={isLoggedIn}
            isStepComplete={isStepComplete}
            leftPanelHeight={leftPanelHeight}
            lessonId={lesson?.id as string}
            lessonSlug={lesson?.slug as string}
            onReady={() => setEditorReady(true)}
            setCheckpoints={setCheckpoints}
            setCurrentCheckpoint={setCurrentCheckpoint}
            setHoverSelection={setHoverSelection}
            setIsStepComplete={setIsStepComplete}
            setLeftPanelHeight={setLeftPanelHeight}
            setTokensUsed={setTokensUsed}
            step={step as Step}
            updateCode={(code) => {
              files['index.py'].code = code;
            }}
          />
        )}
      </SandpackStack>
      <SandpackStack className="!h-full">
        <div className="h-full text-white">Pyodide Here</div>
        <Chatbot
          code={files['index.py'].code}
          disabled={maxTokensUsed}
          hoverSelection={hoverSelection}
          questions={step?.questions?.map((q) => q.value) || []}
          setTokensUsed={setTokensUsed}
          tokenUsageStatus={tokenUsageStatus}
          tokensUsed={tokensUsed}
        />
      </SandpackStack>
    </div>
  );
};

export default PyodideExecutionProvider;
