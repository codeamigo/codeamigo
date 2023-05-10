import { SandpackStack } from '@codesandbox/sandpack-react';
import { Console } from 'console-feed';
import { FCProviderType } from 'providers/execution/types';
import { loadPyodide } from 'pyodide';
import React, { useEffect, useRef, useState } from 'react';

import { Step } from '👨‍💻generated/graphql';
import debounce from '👨‍💻utils/debounce';
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
  const [logs, setLogs] = useState<any[]>([]);
  const [pyodide, setPyodide] = useState<any>(null);
  const isFirstRun = useRef(true);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const pyodide = await loadPyodide({
        fullStdLib: true,
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.2/full/',
        stdout: (text: string) => {
          console.log(text);
          setLogs((logs) => [
            ...logs,
            {
              data: [text],
              method: 'command',
            },
          ]);
        },
      });
      setPyodide(pyodide);
    })();
  }, []);

  useEffect(() => {
    if (isFirstRun.current && pyodide) {
      isFirstRun.current = false;
      runCode(files['index.py'].code);
    }
  }, [pyodide]);

  const runCode = async (code: string) => {
    if (!pyodide) return;

    try {
      await pyodide.runPythonAsync(code);
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
              runCodeDebounced(code);
            }}
          />
        )}
      </SandpackStack>
      <SandpackStack className="!h-full">
        <div
          className="console-feed h-full overflow-scroll text-white"
          ref={consoleRef}
        >
          <Console logs={logs} variant="dark" />
        </div>
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
