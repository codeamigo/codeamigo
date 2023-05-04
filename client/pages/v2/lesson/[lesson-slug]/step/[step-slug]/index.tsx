import {
  FileTabs,
  SandpackConsole,
  SandpackLayout,
  SandpackPredefinedTemplate,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import Editor from '@monaco-editor/react';
import { Form, Formik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import debounce from 'utils/debounce';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import {
  CheckpointsQuery,
  CodeModulesQuery,
  LessonDocument,
  LessonQueryVariables,
  Step,
  StepDocument,
  StepQueryVariables,
  useCheckpointsQuery,
  useCodeModulesQuery,
  useCompleteCheckpointMutation,
  useCreateUserLessonPurchaseMutation,
  useMeQuery,
  UserLessonPositionQuery,
  useUpdateCodeModuleMutation,
  useUpdateTokensUsedMutation,
  useUpdateUserLessonLastSlugSeenMutation,
  useUserLessonPositionQuery,
  useUserLessonPurchaseQuery,
} from '👨‍💻generated/graphql';
import { LessonQuery } from '👨‍💻generated/graphql';
import { StepQuery } from '👨‍💻generated/graphql';
import { client } from '👨‍💻utils/withApollo';
import { getLanguage, getModelExtension } from '👨‍💻widgets/Lesson/Editor/utils';
import StepActions from '👨‍💻widgets/StepActions';
import UserMenu from '👨‍💻widgets/UserMenu';

import * as hal from '../../../../../../assets/hal.png';
import { MAX_TOKENS_DEMO, MAX_TOKENS_USER } from '../../../../../../constants';

const URN = 'urn:';
const transition = { bounce: 0.4, duration: 0.8, type: 'spring' };

const defaultLeftPanelHeight = {
  editor: 'calc(100% - 18rem)',
  instructions: '18rem',
};

const defaultQuestions = [
  'What is this code doing?',
  "Why isn't my code accepted?",
];

type OpenAIAPIResponse = {
  choices?: { finish_reason: 'length' | 'stop'; text: string }[];
  usage: { total_tokens: number };
};

function MonacoEditor({
  checkpoints,
  codeModules,
  currentCheckpoint,
  disabled,
  files,
  hoverSelection,
  isLoggedIn,
  isStepComplete,
  leftPanelHeight,
  lessonId,
  lessonPurchased,
  lessonSlug,
  onReady,
  setCheckpoints,
  setCurrentCheckpoint,
  setHoverSelection,
  setIsStepComplete,
  setLeftPanelHeight,
  setTokensUsed,
  step,
}: {
  checkpoints?: CheckpointsQuery['checkpoints'];
  codeModules?: CodeModulesQuery['codeModules'];
  currentCheckpoint: number;
  disabled: boolean;
  files: {
    [key: string]: {
      code: string;
    };
  };
  hoverSelection: string | null;
  isLoggedIn: boolean;
  isStepComplete: boolean;
  leftPanelHeight: {
    editor: string;
    instructions: string;
  };
  lessonId: string;
  lessonPurchased: boolean;
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
}) {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const { activeFile } = sandpack;
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
    <SandpackStack
      className="relative z-30 transition-all"
      style={{ height: `${leftPanelHeight.editor}`, margin: 0 }}
    >
      <Checkpoints checkpoints={checkpoints} />
      <StepActions
        disabled={!isStepComplete}
        isAutoPlayEnabled={isAutoPlayEnabled}
        isCompletionEnabled={isCompletionEnabled}
        isLoggedIn={isLoggedIn}
        lessonId={lessonId}
        lessonPurchased={lessonPurchased}
        lessonSlug={lessonSlug}
        nextLoader={nextLoader}
        setIsAutoPlayEnabled={setIsAutoPlayEnabled}
        setIsCompletionEnabled={setIsCompletionEnabled}
        step={step}
      />
      <FileTabs />
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
    </SandpackStack>
  );
}

const Markdown = ({
  instructions,
  leftPanelHeight,
  setLeftPanelHeight,
}: {
  instructions: string;
  leftPanelHeight: {
    editor: string;
    instructions: string;
  };
  setLeftPanelHeight: Dispatch<
    SetStateAction<{
      editor: string;
      instructions: string;
    }>
  >;
}) => {
  const [full, setFull] = useState(false);

  useEffect(() => {
    setLeftPanelHeight({
      editor: full ? '0px' : 'calc(100% - 18rem)',
      instructions: full ? '100%' : '18rem',
    });
  }, [full]);

  return (
    <div
      className={`relative overflow-hidden bg-neutral-900 transition-all ${
        full ? 'z-40' : 'z-20'
      }`}
      style={{ height: `${leftPanelHeight.instructions}` }}
    >
      <ReactMarkdown
        children={instructions as string}
        className="markdown-body h-full overflow-scroll border-b border-neutral-800 px-3 py-2"
        plugins={[gfm]}
      />
      <Icon
        className="absolute bottom-0 right-0 m-2 text-neutral-400 hover:text-white"
        name={full ? 'resize-small' : 'resize-full'}
        onClick={() => setFull(!full)}
      />
    </div>
  );
};

const Checkpoints = ({
  checkpoints,
}: {
  checkpoints?: CheckpointsQuery['checkpoints'];
}) => {
  return (
    <div>
      {checkpoints?.map((checkpoint) => {
        return (
          <div
            className="relative z-20 flex items-center gap-2 border-b border-neutral-800 bg-black p-2 px-3"
            key={checkpoint.description}
          >
            <div
              className={`flex h-4 min-h-[1rem] w-4 min-w-[1rem] items-center justify-center rounded-full border ${
                checkpoint.isCompleted
                  ? 'border-green-500 bg-green-900'
                  : 'border-neutral-500 bg-black'
              }`}
            >
              <Icon
                className={`text-xxs ${
                  checkpoint.isCompleted ? `text-green-500` : 'text-neutral-500'
                }`}
                // @ts-ignore
                name={checkpoint.isCompleted ? 'check' : ''}
              />
            </div>
            <pre className="whitespace-normal text-white">
              {checkpoint.description}
            </pre>
          </div>
        );
      })}
    </div>
  );
};

const ChatBot = ({
  disabled,
  hoverSelection,
  maxTokens,
  questions,
  setTokensUsed,
  tokenUsageStatus,
  tokensUsed,
}: {
  disabled: boolean;
  hoverSelection: string | null;
  maxTokens: number | null;
  questions: string[];
  setTokensUsed: React.Dispatch<React.SetStateAction<number | null>>;
  tokenUsageStatus: TokenUsageStatusType;
  tokensUsed: number | null;
}) => {
  const [height, setHeight] = useState(0);
  const { code } = useActiveCode();
  const [responses, setResponses] = useState<
    { question: string; value: string }[]
  >([]);
  const [textStreams, setTextStreams] = useState<
    {
      question: string;
      stream: string[];
    }[]
  >([]);
  const [isBusy, setIsBusy] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const streamedTextsRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isBusy) return;

    if (hoverSelection) {
      const prompt =
        'Code: ' +
        code +
        '### Explain what ' +
        hoverSelection +
        ' does in the code above.';
      fetchExplain(prompt, hoverSelection);
    }
  }, [hoverSelection]);

  const fetchExplain = async (prompt: string, question: string) => {
    try {
      // const oldStream = textStreams.find(
      //   (stream) => stream.question === question
      // );
      // if (oldStream) {
      //   const oldDiv = document.getElementById(oldStream.question);
      //   if (oldDiv && streamedTextsRef.current) {
      //     streamedTextsRef.current.scrollTo({
      //       behavior: 'smooth',
      //       top: oldDiv.offsetTop - (formRef?.current?.offsetHeight || 0) || 0,
      //     });
      //     oldDiv.classList.add('animate-pulse');
      //     setTimeout(() => {
      //       oldDiv.classList.remove('animate-pulse');
      //     }, 5000);
      //   }
      //   throw new Error('Already asked this question');
      // }
      if (disabled) throw new Error('Disabled');
      if (isBusy) throw new Error('Busy');
      setIsBusy(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/explain`,
        {
          body: JSON.stringify({
            apiKey: localStorage.getItem('openaiKey'),
            prompt,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );

      const explainations: OpenAIAPIResponse = await response.json();
      let value =
        `${explainations.choices?.[0]?.text}` || 'There was an error.';
      if (explainations.choices?.[0]?.finish_reason === 'length') {
        value += '...';
      }
      setResponses((prev) => [...prev, { question, value }]);
      streamText(value, question, responses.length);
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 10);

      const tokensUsed = explainations.usage.total_tokens;
      setTokensUsed((prev) => (prev || 0) + tokensUsed);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };

  const streamText = (text: string, question: string, streamIndex: number) => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        streamedTextsRef.current?.scrollTo({
          behavior: 'smooth',
          top: streamedTextsRef.current?.scrollHeight,
        });
        index++;
      }

      setTextStreams((prev) => {
        const newStreams = [...prev];
        newStreams[streamIndex] = {
          question,
          stream: text.slice(0, index).split(''),
        };
        return newStreams;
      });

      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, 50);
  };

  return (
    <div
      className={`flex max-h-[50%] flex-col border-t border-neutral-800 bg-black`}
    >
      <div className="relative h-full overflow-scroll" ref={streamedTextsRef}>
        <div className="sticky top-0 z-10 bg-black px-4 py-2" ref={formRef}>
          <div className="mb-2 flex items-center gap-2 sm:mb-1">
            <Image
              height={'24px'}
              src={hal}
              style={{ minHeight: '24px', minWidth: '24px' }}
              width={'24px'}
            />
            <pre className="whitespace-normal text-white">
              Hello, I'm Codeamigo. I'm here to help you with this tutorial.
            </pre>
          </div>
          <div className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2">
            <Formik
              initialValues={{ question: '' }}
              onSubmit={async (values) => {
                if (!values.question) return;
                const prompt = `${code} """ ${values.question}`;
                await fetchExplain(prompt, values.question);
              }}
            >
              {({ setFieldValue, setValues, submitForm, values }) => (
                <Form className="relative">
                  <textarea
                    autoFocus
                    className="min-h-[40px] w-full resize-none rounded-md border border-neutral-800 bg-black px-3 py-2 text-sm text-white !outline-0 !ring-0 transition-colors placeholder:text-neutral-400 focus:border-neutral-700 disabled:opacity-50"
                    disabled={isBusy || disabled}
                    name="question"
                    onChange={(e) => {
                      setFieldValue('question', e.target.value);
                    }}
                    onInput={(e) => {
                      setHeight(0);
                      setTimeout(() => {
                        // @ts-ignore
                        setHeight(e.target.scrollHeight);
                      }, 1);
                    }}
                    onKeyDown={(e) => {
                      if (e.which === 13 && !e.shiftKey) {
                        e.preventDefault();

                        submitForm();
                      }
                    }}
                    placeholder={
                      disabled
                        ? ''
                        : isDesktop
                        ? 'Ask me anything, or hover over some code to see what I can do.'
                        : 'Ask me anything.'
                    }
                    ref={textAreaRef}
                    style={{ height: `${height}px` }}
                    value={values.question}
                  />
                  {isBusy ? (
                    <Icon
                      className="absolute right-3 top-1.5 animate-spin text-lg text-neutral-500"
                      name="cog"
                    />
                  ) : disabled ? (
                    <pre
                      className="absolute left-3 top-2.5 cursor-pointer rounded-md border border-red-500 bg-red-950 px-1 py-0.5 text-xs text-red-500"
                      onClick={() => {
                        modalVar({
                          callback: () => null,
                          data: {
                            tokenUsageStatus,
                            tokensUsed,
                          },
                          name: 'usage',
                          persistent: false,
                        });
                      }}
                    >
                      Max Tokens Exceeded
                    </pre>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {[...defaultQuestions, ...questions].map((question) => {
                      return (
                        <pre
                          className="inline-block cursor-pointer rounded-md border border-blue-500 bg-blue-950 px-1 py-0.5 text-xs text-blue-500"
                          onClick={() => {
                            setValues({ question });
                            submitForm();
                          }}
                        >
                          {question}
                        </pre>
                      );
                    })}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        {textStreams.map(({ question, stream }, index) => {
          return (
            <div
              className={`border-b border-neutral-800 px-4 py-2 text-sm first:border-t last:border-b-0 ${
                index % 2 === 0 ? 'bg-neutral-900' : 'bg-black'
              }`}
              id={question}
            >
              <div className="mb-1">
                <pre className="inline-block rounded-md border border-green-500 bg-green-950 px-1 py-0.5 text-xs text-green-500">
                  {question}
                </pre>
              </div>
              {stream.map((char, i) => {
                if (stream.length === 0) return null;
                if ((char === '\n' && i === 0) || (char === '\n' && i === 1))
                  return null;
                if (char === '\n') return <br />;
                return <span className="text-white">{char}</span>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

type TokenUsageStatusType = 'safe' | 'warning' | 'danger';

const Credits = ({
  maxTokens,
  tokenUsageStatus,
  tokensUsed,
}: {
  maxTokens: number | null;
  tokenUsageStatus: TokenUsageStatusType;
  tokensUsed: number | null;
}) => {
  if (tokensUsed === null) return null;
  if (maxTokens === null) return null;
  let percentageUsed = (Math.min(tokensUsed, maxTokens) / maxTokens) * 100;

  return (
    <div
      aria-label="Token Usage"
      className="flex cursor-pointer items-center gap-2"
      onClick={() => {
        modalVar({
          callback: () => null,
          data: {
            tokenUsageStatus,
            tokensUsed,
          },
          name: 'usage',
          persistent: false,
        });
      }}
    >
      <pre className="hidden text-xs text-white sm:inline-block">
        Usage Limit
      </pre>
      <div
        className={`h-2 w-32 rounded-full p-[2px] transition-all duration-300 ${
          tokenUsageStatus === 'safe'
            ? 'bg-blue-900'
            : tokenUsageStatus === 'warning'
            ? 'bg-yellow-900'
            : 'bg-red-900'
        }`}
      >
        <div
          className={`h-full rounded-full bg-blue-500 transition-all duration-300 ${
            tokenUsageStatus === 'safe'
              ? 'bg-blue-500'
              : tokenUsageStatus === 'warning'
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
          style={{
            width: Math.max(5, percentageUsed) + '%',
          }}
        />
      </div>
    </div>
  );
};

const ProgressBar = ({
  checkpoints,
  lessonSlug,
  step,
  steps,
  title,
  userLessonPosition,
}: {
  checkpoints?: CheckpointsQuery['checkpoints'];
  lessonSlug: string;
  step: Step;
  steps?: Pick<Step, 'slug' | 'title'>[];
  title: string;
  userLessonPosition?: UserLessonPositionQuery['userLessonPosition'];
}) => {
  const router = useRouter();

  if (!steps) return null;
  if (steps?.length === 0) return null;

  return (
    <div
      className="flex cursor-pointer items-center gap-2 text-xs font-light"
      onClick={() => {
        modalVar({
          callback: (slug: string) => {
            router.push(`/v2/lesson/${lessonSlug}/step/${slug}`);
          },
          data: { checkpoints, steps, title, userLessonPosition },
          name: 'steps',
          persistent: false,
        });
      }}
    >
      <div className="h-2 w-32 rounded-full bg-green-900 p-[2px]">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{
            width: `${(((step?.position || 0) + 1) / steps.length) * 100}%`,
          }}
        />
      </div>
      <div className="hidden text-xs text-white sm:block">
        <pre>
          Step {`${(step?.position || 0) + 1}/${steps.length} ${step?.title}`}
        </pre>
      </div>
    </div>
  );
};

const V2Lesson = ({ lesson, step }: Props) => {
  const [ready, setReady] = useState(false);
  const [loaderReady, setLoaderReady] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [maxTokens, setMaxTokens] = useState<number | null>(null);
  const [maxTokensUsed, setMaxTokensUsed] = useState<boolean>(false);
  const [tokenUsageStatus, setTokenUsageStatus] =
    useState<TokenUsageStatusType>('safe');
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [leftPanelHeight, setLeftPanelHeight] = useState(
    defaultLeftPanelHeight
  );
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [hoverSelection, setHoverSelection] = useState<string | null>(null);
  const [checkpoints, setCheckpoints] =
    useState<CheckpointsQuery['checkpoints']>();

  const router = useRouter();

  const { data: meData, loading: meLoading } = useMeQuery();
  const { data: checkpointsData } = useCheckpointsQuery({
    variables: {
      stepId: step?.id as string,
    },
  });
  const { data: codeModulesData, loading } = useCodeModulesQuery({
    variables: {
      stepId: step?.id as string,
    },
  });
  const { data: userLessonPositionData } = useUserLessonPositionQuery({
    variables: {
      lessonId: lesson?.id as string,
    },
  });
  const { data: userLessonPurchaseData, loading: userLessonPurchaseLoading } =
    useUserLessonPurchaseQuery({
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      variables: {
        lessonId: lesson?.id as string,
      },
    });

  const [updateUserLessonLastSlugSeen] =
    useUpdateUserLessonLastSlugSeenMutation();
  const [
    createUserLessonPurchase,
    { loading: createUserLessonPurchaseLoading },
  ] = useCreateUserLessonPurchaseMutation();
  const [updateUserTokensUsed] = useUpdateTokensUsedMutation();

  const files = codeModulesData?.codeModules?.reduce((acc, codeModule) => {
    if (!codeModule.name) return acc;
    if (!codeModule.code) return acc;

    return {
      ...acc,
      [codeModule.name]: { code: codeModule.code.replace(/\\n/g, '\n') },
    };
  }, {});

  // First modal
  useEffect(() => {
    if (userLessonPurchaseLoading) return;
    if (meLoading) return;

    if (
      !userLessonPurchaseData?.userLessonPurchase?.id &&
      router.query.payment !== 'success' &&
      lesson?.requiresPayment &&
      (step?.position || 0) > 4
    ) {
      if (!meData?.me) {
        modalVar({
          callback: () => null,
          data: {
            purchaseRequired: true,
          },
          name: 'login',
          persistent: true,
        });
        return;
      }

      modalVar({
        callback: () => null,
        data: {
          cancelUrl: window.location.href,
          lessonId: lesson?.id,
          successUrl: window.location.href,
          title: lesson?.title,
          userId: meData?.me?.id,
        },
        name: 'lessonPurchase',
        persistent: true,
      });

      return;
    }

    if (!isDesktop) {
      modalVar({
        callback: () => null,
        name: 'mobileWarning',
        persistent: true,
      });
    }
  }, [
    lesson,
    step?.id,
    meLoading,
    isDesktop,
    router.query,
    userLessonPurchaseLoading,
    createUserLessonPurchaseLoading,
    userLessonPurchaseData?.userLessonPurchase?.id,
  ]);

  useEffect(() => {
    (async () => {
      if (router.query.payment === 'success' && router.query.session_id) {
        const stripeSessionId =
          typeof router.query.session_id === 'string'
            ? router.query.session_id
            : router.query.session_id[router.query.session_id.length - 1];
        await createUserLessonPurchase({
          refetchQueries: ['UserLessonPurchase'],
          variables: {
            lessonId: lesson?.id as string,
            stripeSessionId,
          },
        });
        router.push(`/v2/lesson/${lesson?.slug}/step/${step?.slug}`);
      }
    })();
  }, [router.query]);

  useEffect(() => {
    setLeftPanelHeight(defaultLeftPanelHeight);
  }, [step?.id]);

  useEffect(() => {
    if (
      meData?.me?.isAuthenticated &&
      userLessonPositionData?.userLessonPosition
    ) {
      updateUserLessonLastSlugSeen({
        variables: {
          lastSlugSeen: step?.slug as string,
          lessonId: lesson?.id as string,
        },
      });
    }
  }, [step?.id]);

  useEffect(() => {
    if (!checkpoints) return;

    const allPassed = checkpoints.every((checkpoint) => checkpoint.isCompleted);

    const hasCheckpoint = checkpoints.length > 0;
    const allPassedOrNoCheckpoints = allPassed || !hasCheckpoint;

    setIsStepComplete(allPassedOrNoCheckpoints);
  }, [step?.id, checkpoints]);

  useEffect(() => {
    if (!checkpointsData?.checkpoints) return;

    setCheckpoints(checkpointsData.checkpoints);

    const nextCheckpoint = checkpointsData.checkpoints?.findIndex(
      (checkpoint) => {
        return !checkpoint.isCompleted;
      }
    );

    if (nextCheckpoint === undefined) return;

    if (nextCheckpoint >= 0) {
      setCurrentCheckpoint(nextCheckpoint);
    }
  }, [checkpointsData, step?.id]);

  useEffect(() => {
    let timeout: any;
    if (loaderReady && editorReady) {
      timeout = setTimeout(() => {
        setReady(true);
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [editorReady, loaderReady]);

  useEffect(() => {
    if (meLoading) return;
    if (tokensUsed === null) return;
    if (meData?.me?.isAuthenticated) {
      updateUserTokensUsed({
        refetchQueries: ['Me'],
        variables: {
          tokensUsed,
        },
      });
    }

    const maxTokens = meData?.me?.isAuthenticated
      ? MAX_TOKENS_USER
      : MAX_TOKENS_DEMO;

    localStorage.setItem('codeamigo-tokens-used', tokensUsed.toString());
    setMaxTokens(maxTokens);
    setMaxTokensUsed(tokensUsed >= maxTokens);

    let tokenUsageStatus: TokenUsageStatusType = 'safe';
    if (tokensUsed > 0.5 * maxTokens) tokenUsageStatus = 'warning';
    if (tokensUsed > 0.75 * maxTokens) tokenUsageStatus = 'danger';
    setTokenUsageStatus(tokenUsageStatus);
  }, [tokensUsed, meLoading, meData?.me]);

  useEffect(() => {
    if (meLoading) return;

    setTokensUsed(
      parseInt(
        meData?.me?.tokensUsed.toString() ||
          localStorage.getItem('codeamigo-tokens-used') ||
          '0'
      )
    );
  }, [meData?.me, meLoading]);

  return (
    <AnimatePresence>
      <motion.div
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        className="flex w-full flex-col items-center justify-center gap-1.5 p-5 pt-2 md:h-full"
        initial={{ opacity: 0, scale: 0 }}
        key="v2"
        style={{ transformOrigin: 'center' }}
        transition={transition}
      >
        {/* top bar */}
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <Icon
              className="text-neutral-600 transition-colors hover:text-white"
              name="home"
              onClick={() => {
                router.push(`/`);
              }}
            />
            <ProgressBar
              checkpoints={checkpoints}
              lessonSlug={lesson?.slug as string}
              step={step as Step}
              steps={lesson?.steps as Pick<Step, 'slug' | 'title'>[]}
              title={lesson?.title as string}
              userLessonPosition={userLessonPositionData?.userLessonPosition}
            />
          </div>
          <div className="flex items-center gap-2">
            <Credits
              maxTokens={maxTokens}
              tokenUsageStatus={tokenUsageStatus}
              tokensUsed={tokensUsed}
            />
            <UserMenu />
          </div>
        </div>
        <div
          className="h-full overflow-hidden rounded-lg border border-neutral-800"
          style={{ width: '100%' }}
        >
          <SandpackProvider
            files={files}
            template={
              (step?.template as SandpackPredefinedTemplate) || 'static'
            }
            theme={'dark'}
          >
            <SandpackLayout>
              <SandpackStack className="editor-instructions-container !h-full">
                <Markdown
                  instructions={step?.instructions as string}
                  leftPanelHeight={leftPanelHeight}
                  setLeftPanelHeight={setLeftPanelHeight}
                />
                {/* TODO: is there anyway to prevent this from going to null? */}
                {loading || !files ? null : (
                  <MonacoEditor
                    checkpoints={checkpoints}
                    codeModules={codeModulesData?.codeModules}
                    currentCheckpoint={currentCheckpoint}
                    disabled={maxTokensUsed}
                    files={files}
                    hoverSelection={hoverSelection}
                    isLoggedIn={meData?.me?.isAuthenticated as boolean}
                    isStepComplete={isStepComplete}
                    leftPanelHeight={leftPanelHeight}
                    lessonId={lesson?.id as string}
                    lessonPurchased={
                      !!userLessonPurchaseData?.userLessonPurchase?.id
                    }
                    lessonSlug={lesson?.slug as string}
                    onReady={() => setEditorReady(true)}
                    setCheckpoints={setCheckpoints}
                    setCurrentCheckpoint={setCurrentCheckpoint}
                    setHoverSelection={setHoverSelection}
                    setIsStepComplete={setIsStepComplete}
                    setLeftPanelHeight={setLeftPanelHeight}
                    setTokensUsed={setTokensUsed}
                    step={step as Step}
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
                <ChatBot
                  disabled={maxTokensUsed}
                  hoverSelection={hoverSelection}
                  maxTokens={maxTokens}
                  questions={step?.questions?.map((q) => q.value) || []}
                  setTokensUsed={setTokensUsed}
                  tokenUsageStatus={tokenUsageStatus}
                  tokensUsed={tokensUsed}
                />
              </SandpackStack>
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </motion.div>
      <motion.div
        animate={
          ready || !loaderReady
            ? { opacity: 0, scale: 0 }
            : { opacity: 1, scale: 1 }
        }
        className="fixed left-0 top-0 flex h-full w-full animate-pulse items-center justify-center text-white"
        initial={{ opacity: 0.5, scale: 0.5 }}
        style={{ transformOrigin: 'center' }}
        transition={transition}
      >
        <Image
          height={60}
          onLoad={() => setLoaderReady(true)}
          src={hal}
          width={60}
        />
      </motion.div>
    </AnimatePresence>
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
  step: StepQuery['step'];
};

export async function getServerSideProps(context: {
  params: { 'lesson-slug': string; 'step-slug': string };
}) {
  const lessonSlug = context.params['lesson-slug'];
  const stepSlug = context.params['step-slug'];

  const lesson = await client.query({
    query: LessonDocument,
    variables: { slug: lessonSlug } as LessonQueryVariables,
  });
  const step = await client.query({
    query: StepDocument,
    variables: { slug: stepSlug } as StepQueryVariables,
  });

  return {
    props: {
      lesson: lesson.data.lesson,
      step: step.data.step,
    },
  };
}

export default V2Lesson;
