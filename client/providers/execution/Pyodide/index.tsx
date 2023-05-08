import { SandpackStack } from '@codesandbox/sandpack-react';
import { FCProviderType } from 'providers/execution/types';
import { loadPyodide } from 'pyodide';
import React, { useEffect, useState } from 'react';

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
  const [stack, setStack] = useState<string[]>([]);
  const [pyodide, setPyodide] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.2/full/',
        stdout: (text: string) => {
          setStack((prevStack) => [...prevStack, text]);
        },
      });
      setPyodide(pyodide);
    })();
  }, []);

  const runCode = async (code: string) => {
    if (!pyodide) return;

    try {
      // TODO: dynamically load packages
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      await micropip.install('pypokedex');
      await micropip.install('pyodide_patch');
      const result = await pyodide.runPythonAsync(code);
      setStack((prevStack) => [...prevStack, result]);
    } catch (error) {
      try {
        setStack((prevStack) => [...prevStack, (error as string).toString()]);
      } catch (error2) {
        console.error(error2);
      }
    }
  };

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
              runCode(code);
            }}
          />
        )}
      </SandpackStack>
      <SandpackStack className="!h-full">
        <div className="h-full overflow-scroll text-white">
          {stack.map((s) => {
            return <pre className="text-white">{s}</pre>;
          })}
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
