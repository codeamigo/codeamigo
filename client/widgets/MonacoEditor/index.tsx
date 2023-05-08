import { FileTabs } from '@codesandbox/sandpack-react';
import { SandpackStack } from '@codesandbox/sandpack-react';
import { Editor } from '@monaco-editor/react';
import debounce from 'debounce';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { OpenAIAPIResponse } from 'types/openai';

import Icon from '👨‍💻components/Icon';
import {
  CheckpointsQuery,
  CodeModulesQuery,
  Step,
  useCompleteCheckpointMutation,
  useUpdateCodeModuleMutation,
} from '👨‍💻generated/graphql';
import Checkpoints from '👨‍💻widgets/Checkpoints';
import { getLanguage, getModelExtension } from '👨‍💻widgets/Lesson/Editor/utils';
import StepActions from '👨‍💻widgets/StepActions';

const URN = 'urn:';

const MonacoEditor = ({
  activeFile,
  checkpoints,
  code,
  codeModules,
  currentCheckpoint,
  disabled,
  files,
  hoverSelection,
  isLessonPurchased,
  isLoggedIn,
  isStepComplete,
  leftPanelHeight,
  lessonId,
  lessonSlug,
  onReady,
  setCheckpoints,
  setCurrentCheckpoint,
  setHoverSelection,
  setIsStepComplete,
  setLeftPanelHeight,
  setTokensUsed,
  step,
  updateCode,
}: Props) => {
  const editorRef = useRef<any>();
  const monacoRef = useRef<any>();
  const [full, setFull] = useState(false);
  const [isCompletionEnabled, setIsCompletionEnabled] = useState(false);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const isStepCompleteRef = useRef(isStepComplete);
  const isCompletionEnabledRef = useRef(isCompletionEnabled);
  const isAutoPlayEnabledRef = useRef(isAutoPlayEnabled);
  const [nextLoader, setNextLoader] = useState(false);

  const [completeCheckpoint] = useCompleteCheckpointMutation();
  const [updateCodeModule] = useUpdateCodeModuleMutation();

  useEffect(() => {
    isStepCompleteRef.current = isStepComplete;
  }, [isStepComplete]);

  useEffect(() => {
    isCompletionEnabledRef.current = isCompletionEnabled;
  }, [isCompletionEnabled]);

  useEffect(() => {
    isAutoPlayEnabledRef.current = isAutoPlayEnabled;
  }, [isAutoPlayEnabled]);

  useEffect(() => {
    setLeftPanelHeight({
      editor: full ? '100%' : 'calc(100% - 18rem)',
      instructions: full ? '0px' : '18rem',
    });
  }, [full]);

  useEffect(() => {
    setFull(false);
  }, [step.id]);

  useEffect(() => {
    setNextLoader(false);
  }, [step.id]);

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor
        .getModels()
        .forEach((model: any) => model.dispose());
      setupModels();
      setupStart();
    }
  }, [step.id]);

  useEffect(() => {
    if (!monacoRef.current) return;
    if (!editorRef.current) return;
    if (!activeFile) return;
    const model = monacoRef.current.editor.getModel(
      monacoRef.current.Uri.parse(`${URN}${activeFile}`)
    );
    if (model) editorRef.current.setModel(model);

    const language = getLanguage(activeFile);

    setupHoverProvider(language);
  }, [activeFile, monacoRef.current, editorRef.current]);

  const updatePrompt = async (value: string | undefined, ev: any) => {
    if (!value || !ev) return;
    if (isStepCompleteRef.current) return;
    if (!isCompletionEnabledRef.current) return;
    const lines = value.split(/\n/);
    const lineNumber = ev.changes[0].range.startLineNumber - 1;
    const line = lines[lineNumber];
    const changePos = ev.changes[0].range.endColumn - 1;
    const insert =
      line.substring(0, changePos) + '[insert]' + line.substring(changePos);
    lines[lineNumber] = insert;
    const prompt =
      'Only respond with code that satisfies the regular expression below:\n' +
      // 'Instructions: ' +
      // step.instructions +
      // '\n' +
      `${
        checkpoints?.[currentCheckpoint]?.matchRegex
          ? '\n' + checkpoints[currentCheckpoint]?.matchRegex
          : ''
      }` +
      lines.join('\n').split('[insert]')[0];
    const suffix = lines.join('\n').split('[insert]')[1];

    try {
      if (disabled) throw new Error('Disabled');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/completions`,
        {
          body: JSON.stringify({
            apiKey: localStorage.getItem('openaiKey'),
            prompt,
            suffix,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );

      const completions: OpenAIAPIResponse = await response.json();
      const suggestion = completions.choices?.[0].text;
      setTokensUsed((prev) => (prev || 0) + completions.usage.total_tokens);
      return suggestion;
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedUpdatePrompt = debounce(updatePrompt, 100);

  const testCheckpoint = async (value: string) => {
    const checkpoint = checkpoints?.[currentCheckpoint];
    const test = checkpoint?.matchRegex as string;
    const regex = new RegExp(test, 'i');

    if (regex.test(value) && checkpoint && checkpoint.isCompleted === false) {
      if (isLoggedIn) {
        await completeCheckpoint({
          refetchQueries: ['Checkpoints'],
          variables: {
            id: checkpoint.id,
          },
        });
      }

      let newCheckpoints = checkpoints.map((checkpoint) => {
        if (checkpoint.id === checkpoints[currentCheckpoint].id) {
          return {
            ...checkpoint,
            isCompleted: true,
          };
        }
        return checkpoint;
      });

      setCheckpoints(newCheckpoints);

      const allPassed = newCheckpoints.every(
        (checkpoint) => checkpoint.isCompleted
      );
      if (allPassed) {
        setIsStepComplete(true);
        if (isAutoPlayEnabledRef.current) {
          setNextLoader(true);
        }
      } else {
        const nextCheckpoint = newCheckpoints.findIndex(
          (checkpoint) => !checkpoint.isCompleted
        );
        setCurrentCheckpoint(nextCheckpoint);
      }
    }
  };

  const setupModels = () => {
    Object.keys(files).forEach((mod) => {
      const model = monacoRef.current.editor.getModel(
        monacoRef.current.Uri.parse(`${URN}${mod}`)
      );
      if (model) return;
      monacoRef.current.editor.createModel(
        files[mod].code,
        getLanguage(mod || ''),
        monacoRef.current.Uri.parse(`${URN}${mod}`)
      );
    });
    const model = monacoRef.current.editor.getModel(
      monacoRef.current.Uri.parse(`${URN}${activeFile}`)
    );
    model?.updateOptions({ tabSize: 2 });
    editorRef.current.setModel(model);
  };

  const setupCompilerOptions = () => {
    const jsxFactory = 'React.createElement';
    const reactNamespace = 'React';
    const hasNativeTypescript = false;

    monacoRef.current.languages.typescript.javascriptDefaults.setEagerModelSync(
      true
    );

    const tsConfigFile = Object.keys(files).find(
      (module) => module === '/tsconfig.json'
    );
    const tsConfig = tsConfigFile
      ? JSON.parse(files[tsConfigFile].code || '')
      : undefined;

    // https://github.com/codesandbox/codesandbox-client/blob/master/packages/app/src/embed/components/Content/Monaco/index.js
    monacoRef.current.languages.typescript.typescriptDefaults.setCompilerOptions(
      {
        allowJs: true,
        allowNonTsExtensions: !hasNativeTypescript,
        experimentalDecorators: true,
        jsx: tsConfig?.compilerOptions
          ? tsConfig?.compilerOptions.jsx
          : monacoRef.current.languages.typescript.JsxEmit.React,
        jsxFactory,
        module: hasNativeTypescript
          ? monacoRef.current.languages.typescript.ModuleKind.ES2015
          : monacoRef.current.languages.typescript.ModuleKind.System,
        moduleResolution:
          monacoRef.current.languages.typescript.ModuleResolutionKind.NodeJs,
        // forceConsistentCasingInFileNames:
        //   hasNativeTypescript && existingConfig.forceConsistentCasingInFileNames,
        // noImplicitReturns:
        //   hasNativeTypescript && existingConfig.noImplicitReturns,
        // noImplicitThis: hasNativeTypescript && existingConfig.noImplicitThis,
        // noImplicitAny: hasNativeTypescript && existingConfig.noImplicitAny,
        // strictNullChecks: hasNativeTypescript && existingConfig.strictNullChecks,
        // suppressImplicitAnyIndexErrors:
        //   hasNativeTypescript && existingConfig.suppressImplicitAnyIndexErrors,
        // noUnusedLocals: hasNativeTypescript && existingConfig.noUnusedLocals,
        newLine: monacoRef.current.languages.typescript.NewLineKind.LineFeed,

        noEmit: true,

        reactNamespace,

        target: monacoRef.current.languages.typescript.ScriptTarget.ES2016,

        typeRoots: [`node_modules/@types`],
      }
    );
  };

  const setupStart = () => {
    const match = editorRef.current
      .getModel()
      ?.findMatches(step.start, true, false, false, null, true)[0];

    if (!match) return;
    editorRef.current.setPosition(match.range.getEndPosition());
    editorRef.current.focus();
  };

  class InlineCompleter {
    async provideInlineCompletions() {
      const range = {
        endColumn: editorRef.current.getPosition().column,
        endLineNumber: editorRef.current.getPosition().lineNumber,
        startColumn: editorRef.current.getPosition().column,
        startLineNumber: editorRef.current.getPosition().lineNumber,
      };
      const suggestion = await debouncedUpdatePrompt(
        editorRef.current.getValue(),
        {
          changes: [
            {
              range,
            },
          ],
        }
      );

      if (!suggestion) return;

      return {
        items: [
          {
            insertText: suggestion,
            range,
          },
        ],
      };
    }
    freeInlineCompletions() {}
  }

  const setupInlineCompletions = () => {
    monacoRef.current.languages.registerInlineCompletionsProvider(
      { pattern: '**' },
      new InlineCompleter()
    );
  };

  const setupHoverProvider = (language: string) => {
    monacoRef.current.languages.registerHoverProvider(language, {
      provideHover: async (model: any, position: any) => {
        const selection = editorRef.current.getSelection();
        const selectionValue = model.getValueInRange(selection);

        let nextHoverSelection = null;
        if (selectionValue) {
          nextHoverSelection = selectionValue;
        }

        if (nextHoverSelection === hoverSelection) return;
        setHoverSelection(nextHoverSelection);
      },
    });
  };

  const handleMount = (editor: any, monaco: any) => {
    if (monacoRef.current) return;
    monacoRef.current = monaco;
    editorRef.current = editor;

    setupInlineCompletions();
    setupCompilerOptions();
    setupModels();
    setupStart();
    onReady();
  };

  const extension = getModelExtension(activeFile);
  const isImage =
    extension === 'jpg' ||
    extension === 'png' ||
    extension === 'gif' ||
    extension === 'svg' ||
    extension === 'jpeg';

  return (
    <div
      className="relative z-30 transition-all"
      style={{ height: `${leftPanelHeight.editor}`, margin: 0 }}
    >
      <Checkpoints checkpoints={checkpoints} />
      <StepActions
        disabled={!isStepComplete}
        isAutoPlayEnabled={isAutoPlayEnabled}
        isCompletionEnabled={isCompletionEnabled}
        isLessonPurchased={isLessonPurchased}
        isLoggedIn={isLoggedIn}
        lessonId={lessonId}
        lessonSlug={lessonSlug}
        nextLoader={nextLoader}
        setIsAutoPlayEnabled={setIsAutoPlayEnabled}
        setIsCompletionEnabled={setIsCompletionEnabled}
        step={step}
      />
      {/* <FileTabs /> */}
      {/* <div
          className={`flex h-full w-full items-center justify-center ${
            isImage ? 'block' : 'hidden'
          }`}
        >
          <img className="w-1/2" src={sandpack.files[activeFile].code} />
        </div> */}
      <div className={`h-[320px] sm:h-full ${isImage ? 'hidden' : 'block'}`}>
        <Editor
          defaultValue={code}
          language="javascript"
          onChange={(value) => {
            testCheckpoint(value || '');
            updateCode(value || '');

            const codeModuleId = codeModules?.find(
              (codeModule) => codeModule.name === activeFile
            )?.id;

            if (!codeModuleId) return;
            if (!isLoggedIn) return;

            updateCodeModule({
              variables: {
                code: value || '',
                id: codeModuleId,
              },
            });
          }}
          onMount={handleMount}
          options={{
            fontSize: 14,
            fontWeight: 600,
            lineNumbers: 'off',
            minimap: {
              enabled: false,
            },
            quickSuggestions: false,
            wordWrap: 'on',
          }}
          theme="vs-dark"
          width="100%"
        />
      </div>
      <Icon
        className="absolute bottom-0 right-0 m-2 text-neutral-400 hover:text-white"
        name={full ? 'resize-small' : 'resize-full'}
        onClick={() => setFull(!full)}
      />
    </div>
  );
};

type Props = {
  activeFile: string;
  checkpoints?: CheckpointsQuery['checkpoints'];
  code: string;
  codeModules?: CodeModulesQuery['codeModules'];
  currentCheckpoint: number;
  disabled: boolean;
  files: {
    [key: string]: {
      code: string;
    };
  };
  hoverSelection: string | null;
  isLessonPurchased: boolean;
  isLoggedIn: boolean;
  isStepComplete: boolean;
  leftPanelHeight: {
    editor: string;
    instructions: string;
  };
  lessonId: string;
  lessonSlug: string;
  onReady: () => void;
  setCheckpoints: Dispatch<
    SetStateAction<CheckpointsQuery['checkpoints'] | undefined>
  >;
  setCurrentCheckpoint: Dispatch<SetStateAction<number>>;
  setHoverSelection: Dispatch<SetStateAction<string | null>>;
  setIsStepComplete: Dispatch<SetStateAction<boolean>>;
  setLeftPanelHeight: Dispatch<
    SetStateAction<{
      editor: string;
      instructions: string;
    }>
  >;
  setTokensUsed: Dispatch<SetStateAction<number | null>>;
  step: Step;
  updateCode: (
    newCode: string,
    shouldUpdatePreview?: boolean | undefined
  ) => void;
};

export default MonacoEditor;
