import {
  SandpackConsole,
  SandpackLayout,
  SandpackPredefinedTemplate,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { FCProviderType } from 'providers/execution/types';
import React, { useEffect } from 'react';

import { Step } from '👨‍💻generated/graphql';
import Chatbot from '👨‍💻widgets/Chatbot';
import Instructions from '👨‍💻widgets/Instructions';
import MonacoEditor from '👨‍💻widgets/MonacoEditor';

const SandpackExecutionProvider: React.FC<FCProviderType> = ({
  files,
  step,
  ...rest
}) => {
  return (
    <SandpackProvider
      files={files}
      template={(step?.template as SandpackPredefinedTemplate) || 'static'}
      theme={'dark'}
    >
      <SandpackExecutionChild files={files} step={step} {...rest} />
    </SandpackProvider>
  );
};

const SandpackExecutionChild: React.FC<FCProviderType> = ({
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
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const { activeFile } = sandpack;

  useEffect(() => {
    window.onmessage = (event) => {
      console.log(event);
    };
  }, []);

  return (
    <SandpackLayout>
      <SandpackStack className="editor-instructions-container !h-full">
        <Instructions
          instructions={step?.instructions as string}
          leftPanelHeight={leftPanelHeight}
          setLeftPanelHeight={setLeftPanelHeight}
        />
        {/* TODO: is there anyway to prevent this from going to null? */}
        {loading || !files ? null : (
          <MonacoEditor
            activeFile={activeFile}
            checkpoints={checkpoints}
            code={code}
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
            updateCode={updateCode}
          />
        )}
      </SandpackStack>
      <SandpackStack className="!h-full">
        <SandpackPreview
          className={
            step?.template === 'static' || step?.template === 'node'
              ? ''
              : '!h-0'
          }
        />
        {step?.template === 'static' ? null : (
          <SandpackConsole className="overflow-scroll" />
        )}
        <Chatbot
          checkpoints={checkpoints}
          code={code}
          disabled={maxTokensUsed}
          hoverSelection={hoverSelection}
          questions={step?.questions?.map((q) => q.value) || []}
          setTokensUsed={setTokensUsed}
          tokenUsageStatus={tokenUsageStatus}
          tokensUsed={tokensUsed}
        />
      </SandpackStack>
    </SandpackLayout>
  );
};

export default SandpackExecutionProvider;
