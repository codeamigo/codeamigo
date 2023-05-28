import { SandpackStack } from '@codesandbox/sandpack-react';
import { FCProviderType } from 'providers/execution/types';
import React, { useEffect, useRef, useState } from 'react';

import { Step } from '👨‍💻generated/graphql';
import debounce from '👨‍💻utils/debounce';
import Chatbot from '👨‍💻widgets/Chatbot';
import Instructions from '👨‍💻widgets/Instructions';
import MonacoEditor from '👨‍💻widgets/MonacoEditor';

const RijuExecutionProvider: React.FC<FCProviderType> = ({
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
  const [logs, setLogs] = useState<any[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const runCode = async (code: string) => {
    try {
      previewRef.current
        ?.getElementsByTagName('iframe')[0]
        .contentWindow?.postMessage(
          {
            code,
            event: 'runCode',
          },
          '*'
        );
    } catch (error) {
      try {
        setLogs((prevLogs) => [
          ...prevLogs,
          { data: [{ Error: error }], method: 'error' },
        ]);
      } catch (error2) {
        setLogs((prevLogs) => [
          ...prevLogs,
          { data: [{ Error: error2 }], method: 'error' },
        ]);
      }
    }
  };

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs.length]);

  const runCodeDebounced = debounce(runCode, 1000);

  return (
    <div className="flex h-full flex-col text-xs font-normal sm:flex-row">
      <SandpackStack className="editor-instructions-container !h-full">
        <Instructions
          instructions={step?.instructions as string}
          leftPanelHeight={leftPanelHeight}
          setLeftPanelHeight={setLeftPanelHeight}
        />
        {/* TODO: is there anyway to prevent this from going to null? */}
        {loading || !files ? null : (
          <MonacoEditor
            activeFile="/main.py"
            checkpoints={checkpoints}
            code={files['/main.py'].code}
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
              files['/main.py'].code = code;
              runCodeDebounced(code);
            }}
          />
        )}
      </SandpackStack>
      <SandpackStack className="!h-full w-full">
        <div className="h-full w-full" ref={previewRef}>
          <iframe
            className="h-full w-full"
            src={`https://riju.codeamigo.xyz/${step.template}`}
          />
        </div>
        <Chatbot
          code={files?.['/main.py'].code}
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

export default RijuExecutionProvider;
