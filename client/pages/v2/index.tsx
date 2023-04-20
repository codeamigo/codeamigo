import {
  FileTabs,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import Editor from '@monaco-editor/react';
import { Form, Formik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import debounce from 'utils/debounce';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import { getLanguage, getModelExtension } from '👨‍💻widgets/Lesson/Editor/utils';
import PrevNext from '👨‍💻widgets/PrevNext';

import * as hal from '../../assets/hal.png';

const URN = 'urn:';

const transition = { bounce: 0.4, duration: 0.8, type: 'spring' };

const defaultLeftPanelHeight = {
  editor: 'calc(100% - 18rem)',
  instructions: '18rem',
};

export type Step = {
  checkpoints: {
    message: string;
    passed: boolean;
    test: RegExp;
  }[];
  files: {
    [key: string]: {
      code: string;
    };
  };
  instructions: string;
  start: string;
  title: string;
};

const steps: Step[] = [
  {
    checkpoints: [],
    files: {
      '/index.html': {
        code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="stylesheet" href="./styles.css" />\n    <title>Document</title>\n  </head>\n  <body>\n    <h1>Hello World!</h1>\n  </body>\n</html>',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "main": "/index.html",\n  "devDependencies": {}\n}',
      },
      '/styles.css': {
        code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}',
      },
    },
    instructions:
      "## Hello Codeamigo!\nWelcome to Codeamigo. **Codeamigo uses AI** to help you learn how to code. Today, **almost 50% of code is written by AI**, so why shouldn't you _learn how to code with AI?_\n\nWe're building Codeamigo to help current and future developers learn to take advantage of the amazing tools we have at our disposal.\n\nReady to get started with a few of the basics? Let's go! Click **Next** to get started.",
    start: 'Hello World!',
    title: 'Hello Codeamigo!',
  },
  {
    checkpoints: [
      {
        message: 'Change the text to "Hello Codeamigo!"',
        passed: false,
        // regex test that matches the text "Hello Codeamigo!" in upper or lower case
        test: /Hello Codeamigo!/i,
      },
    ],
    files: {
      '/index.html': {
        code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="stylesheet" href="./styles.css" />\n    <title>Document</title>\n  </head>\n  <body>\n    <h1>Hello </h1>\n  </body>\n</html>',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "main": "/index.html",\n  "devDependencies": {}\n}',
      },
      '/styles.css': {
        code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}',
      },
    },
    instructions:
      "## Intro to Codeamigo - Part 1\nCodeamigo comes equipped with a built-in editor, preview and chatbot. Let's get familiar with these tools. The editor below is where you'll be spending most of your time.\n\nTo see these tools in action, let's modify the code in the editor. Change the text in the `h1` tag to say **Hello Codeamigo!**\n\nThen, click **Next** when you're ready to continue.",
    start: 'Hello ',
    title: 'Code Completion',
  },
  {
    checkpoints: [],
    files: {
      '/index.html': {
        code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="stylesheet" href="./styles.css" />\n    <title>Document</title>\n  </head>\n  <body>\n    <h1>Hello codeamigo!</h1>\n  </body>\n</html>',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "main": "/index.html",\n  "devDependencies": {}\n}',
      },
      '/styles.css': {
        code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}',
      },
    },
    instructions:
      "## Intro to Codeamigo - Part 2\nMaybe you're a bit confused about what some of these lines of code are doing in the editor. That's okay! You have an AI assistant at your disposal.\n\nFor example, what does `<!DOCTYPE html>` do? **Using your cursor select the line of code and hover over the highlighted text to see a description of what it does.**\n\nReady to learn more? Click **Next** to continue.",
    start: '',
    title: 'Hover to Learn',
  },
  {
    checkpoints: [],
    files: {
      '/index.html': {
        code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="stylesheet" href="./styles.css" />\n    <title>Document</title>\n  </head>\n  <body>\n    <h1>Hello codeamigo!</h1>\n  </body>\n</html>',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "main": "/index.html",\n  "devDependencies": {}\n}',
      },
      '/styles.css': {
        code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}',
      },
    },
    instructions:
      "## Intro to Codeamigo - Part 3\nYou can also ask Codeamigo just about anything you want. For example, why don't you try typing\n\n**Explain HTML as if I was a film maker.**\n\ninto the chatbot.\n\nReady to learn more? Click **Next** to continue.",
    start: '',
    title: 'Ask Codeamigo Anything',
  },
  {
    checkpoints: [],
    files: {
      '/index.html': {
        code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="stylesheet" href="./styles.css" />\n    <title>Document</title>\n  </head>\n  <body>\n    <h1>Hello codeamigo!</h1>\n    <!-- Add a p tag with the text "Welcome to Codeamigo" -->\n    <p>Welcome to Codeamigo</p>\n  </body>\n</html>',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "main": "/index.html",\n  "devDependencies": {}\n}',
      },
      '/styles.css': {
        code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}',
      },
    },
    instructions:
      "## Intro to Codeamigo - Part 5\nCongrats on making it this far! Maybe you noticed in the last step that AI is not perfect. That's okay! It's your job as a programmer to find bugs (either created by the AI or a fellow human) and fix them. So you'll need to learn how to read and write code. But Codeamigo will be there to help you along the way! If you'd like to stay updated on Codeamigo's progress, you can join the waitlist at [codeamigo.dev](https://codeamigo.dev).",
    start: '',
    title: 'The End (for now)',
  },
];

function MonacoEditor({
  currentCheckpoint,
  currentStep,
  files,
  hoverSelection,
  isStepComplete,
  leftPanelHeight,
  onReady,
  setCurrentCheckpoint,
  setCurrentStep,
  setHoverSelection,
  setIsStepComplete,
  setLeftPanelHeight,
}: {
  currentCheckpoint: number;
  currentStep: number;
  files: any;
  hoverSelection: string | null;
  isStepComplete: boolean;
  leftPanelHeight: {
    editor: string;
    instructions: string;
  };
  onReady: () => void;
  setCurrentCheckpoint: Dispatch<SetStateAction<number>>;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setHoverSelection: Dispatch<SetStateAction<string | null>>;
  setIsStepComplete: Dispatch<SetStateAction<boolean>>;
  setLeftPanelHeight: Dispatch<
    SetStateAction<{
      editor: string;
      instructions: string;
    }>
  >;
}) {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const { activeFile } = sandpack;
  const editorRef = useRef<any>();
  const monacoRef = useRef<any>();
  const [full, setFull] = useState(false);
  const isStepCompleteRef = useRef(isStepComplete);
  const [nextLoader, setNextLoader] = useState(false);

  useEffect(() => {
    isStepCompleteRef.current = isStepComplete;
  }, [isStepComplete]);

  useEffect(() => {
    setLeftPanelHeight({
      editor: full ? '100%' : 'calc(100% - 18rem)',
      instructions: full ? '0px' : '18rem',
    });
  }, [full]);

  useEffect(() => {
    setFull(false);
  }, [currentStep]);

  useEffect(() => {
    setNextLoader(false);
  }, [currentStep]);

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor
        .getModels()
        .forEach((model: any) => model.dispose());
      setupModels();
      setupStart();
    }
  }, [currentStep]);

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
    const lines = value.split(/\n/);
    const lineNumber = ev.changes[0].range.startLineNumber - 1;
    const line = lines[lineNumber];
    const changePos = ev.changes[0].range.endColumn - 1;
    const insert =
      line.substring(0, changePos) + '[insert]' + line.substring(changePos);
    lines[lineNumber] = insert;
    const prompt =
      'Only respond with code that follows the instructions.\n' +
      'Instructions: ' +
      steps[currentStep].instructions +
      '\n' +
      `${
        steps[currentStep].checkpoints[currentCheckpoint]?.test
          ? '\n' +
            'Satisfy Regex: ' +
            steps[currentStep].checkpoints[currentCheckpoint]?.test
          : ''
      }` +
      lines.join('\n').split('[insert]')[0];
    const suffix = lines.join('\n').split('[insert]')[1];

    try {
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

      const completions: { text: string }[] = await response.json();
      const suggestion = completions[0].text;
      return suggestion;
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedUpdatePrompt = debounce(updatePrompt, 100);

  const testCheckpoint = (value: string) => {
    const checkpoint = steps[currentStep].checkpoints[currentCheckpoint];
    const test = checkpoint?.test;
    const regex = new RegExp(test);
    let allPassed;
    if (regex.test(value) && checkpoint && checkpoint.passed === false) {
      steps[currentStep].checkpoints[currentCheckpoint].passed = true;
      allPassed = steps[currentStep].checkpoints.every(
        (checkpoint: any) => checkpoint.passed
      );
      if (allPassed) {
        setIsStepComplete(true);
        setNextLoader(true);
      } else {
        const nextCheckpoint = steps[currentStep].checkpoints.findIndex(
          (checkpoint: any) => !checkpoint.passed
        );
        setCurrentCheckpoint(nextCheckpoint);
      }
    }

    return allPassed;
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
      .findMatches(steps[currentStep].start, true, false, false, null, true)[0];

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
        const wordAtPosition = model.getWordAtPosition(position);
        const { word } = wordAtPosition || {};
        const isWordInSelection =
          word &&
          selection.containsPosition({
            column: position.column,
            lineNumber: position.lineNumber,
          });

        let nextHoverSelection = null;
        if (word && !isWordInSelection) {
          nextHoverSelection = word;
        } else if (selectionValue) {
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
      <Checkpoints currentStep={currentStep} />
      <PrevNext
        currentStep={currentStep}
        disabled={!isStepComplete}
        nextLoader={nextLoader}
        setCurrentStep={setCurrentStep}
        steps={steps.length}
      />
      <FileTabs />
      <div
        className={`flex h-full w-full items-center justify-center ${
          isImage ? 'block' : 'hidden'
        }`}
      >
        <img className="w-1/2" src={sandpack.files[activeFile].code} />
      </div>
      <div className={`h-[320px] sm:h-full ${isImage ? 'hidden' : 'block'}`}>
        <Editor
          defaultValue={code}
          language="javascript"
          onChange={(value) => {
            testCheckpoint(value || '');
            updateCode(value || '');
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
  currentStep,
  leftPanelHeight,
  setLeftPanelHeight,
}: {
  currentStep: number;
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
    setFull(false);
  }, [currentStep]);

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
      key={currentStep}
      style={{ height: `${leftPanelHeight.instructions}` }}
    >
      <ReactMarkdown
        children={steps[currentStep].instructions}
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

const Checkpoints = ({ currentStep }: { currentStep: number }) => {
  return (
    <div>
      {steps[currentStep].checkpoints?.map((checkpoint) => {
        return (
          <div
            className="relative z-20 flex items-center gap-2 border-b border-neutral-800 bg-black p-2 px-3"
            key={checkpoint.message}
          >
            <div
              className={`flex h-4 min-h-[1rem] w-4 min-w-[1rem] items-center justify-center rounded-full border ${
                checkpoint.passed
                  ? 'border-green-500 bg-green-900'
                  : 'border-neutral-500 bg-black'
              }`}
            >
              <Icon
                className={`text-xxs ${
                  checkpoint.passed ? `text-green-500` : 'text-neutral-500'
                }`}
                // @ts-ignore
                name={checkpoint.passed ? 'check' : ''}
              />
            </div>
            <pre className="whitespace-normal text-white">
              {checkpoint.message}
            </pre>
          </div>
        );
      })}
    </div>
  );
};

const ChatBot = ({ hoverSelection }: { hoverSelection: string | null }) => {
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
      const oldStream = textStreams.find(
        (stream) => stream.question === question
      );
      if (oldStream) {
        const oldDiv = document.getElementById(oldStream.question);
        if (oldDiv && streamedTextsRef.current) {
          streamedTextsRef.current.scrollTo({
            behavior: 'smooth',
            top: oldDiv.offsetTop - (formRef?.current?.offsetHeight || 0) || 0,
          });
          oldDiv.classList.add('animate-pulse');
          setTimeout(() => {
            oldDiv.classList.remove('animate-pulse');
          }, 5000);
        }
        throw new Error('Already asked this question');
      }
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

      const explainations: { text: string }[] = await response.json();
      const value = `${explainations[0].text}`;
      setResponses((prev) => [...prev, { question, value }]);
      streamText(value, question, responses.length);
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 10);
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
      <Head>
        <meta
          content="https://codeamigo.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhal.5acdb897.png&w=256&q=75"
          property="og:image"
        />
      </Head>
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
                    disabled={isBusy}
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
                      isDesktop
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
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <pre
                      className="inline-block cursor-pointer rounded-md border border-blue-500 bg-blue-950 px-1 py-0.5 text-xs text-blue-500"
                      onClick={() => {
                        setValues({ question: 'What is this code doing?' });
                        submitForm();
                      }}
                    >
                      What is this code doing?
                    </pre>
                    <pre
                      className="inline-block cursor-pointer rounded-md border border-blue-500 bg-blue-950 px-1 py-0.5 text-xs text-blue-500"
                      onClick={() => {
                        setValues({ question: "Why isn't my code accepted?" });
                        submitForm();
                      }}
                    >
                      Why isn't my code accepted?
                    </pre>
                    <pre
                      className="inline-block cursor-pointer rounded-md border border-blue-500 bg-blue-950 px-1 py-0.5 text-xs text-blue-500"
                      onClick={() => {
                        setValues({ question: 'What is a variable?' });
                        submitForm();
                      }}
                    >
                      What is a variable?
                    </pre>
                    <pre
                      className="inline-block cursor-pointer rounded-md border border-blue-500 bg-blue-950 px-1 py-0.5 text-xs text-blue-500"
                      onClick={() => {
                        setValues({ question: 'Explain HTML as if I was 5.' });
                        submitForm();
                      }}
                    >
                      Explain HTML as if I was 5.
                    </pre>
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
              {stream.map((char) => {
                if (stream.length === 0) return null;
                return <span className="text-white">{char}</span>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProgressBar = ({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div
      className="flex cursor-pointer items-center gap-2 text-xs font-light"
      onClick={() => {
        modalVar({
          callback: (step: number) => {
            setCurrentStep(step);
          },
          data: { steps, title: 'Intro to Codeamigo' },
          name: 'steps',
        });
      }}
    >
      <div className="h-2 w-32 rounded-full bg-green-900">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      <div className="text-xs text-white">
        {currentStep + 1}/{steps.length}
      </div>
    </div>
  );
};

const Credits = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-32 rounded-full bg-blue-900">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          // todo: don't hardcode this
          style={{ width: `33%` }}
        />
      </div>
    </div>
  );
};

const V2 = () => {
  const [ready, setReady] = useState(false);
  const [loaderReady, setLoaderReady] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [leftPanelHeight, setLeftPanelHeight] = useState(
    defaultLeftPanelHeight
  );
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [hoverSelection, setHoverSelection] = useState<string | null>(null);

  // HIGH DEMAND
  // useEffect(() => {
  //   if (!localStorage.getItem('openaiKey')) {
  //     modalVar({
  //       callback: () => null,
  //       name: 'highDemand',
  //     });
  //   }
  // }, []);
  useEffect(() => {
    if (!isDesktop) {
      modalVar({
        callback: () => null,
        name: 'mobileWarning',
      });
    }
  }, [isDesktop]);

  useEffect(() => {
    setLeftPanelHeight(defaultLeftPanelHeight);
  }, [currentStep]);

  useEffect(() => {
    const allPassed =
      steps[currentStep].checkpoints.every((checkpoint) => checkpoint.passed) ||
      !steps[currentStep].checkpoints.length;
    setIsStepComplete(allPassed);
  }, [currentStep]);

  useEffect(() => {
    const nextCheckpoint = steps[currentStep].checkpoints.findIndex(
      (checkpoint) => {
        return !checkpoint.passed;
      }
    );
    if (nextCheckpoint !== -1) {
      setCurrentCheckpoint(nextCheckpoint);
    }
  }, [currentStep]);

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
          <ProgressBar currentStep={currentStep} />
          <Credits />
        </div>
        <div
          className="h-full overflow-hidden rounded-lg border border-neutral-800"
          style={{ width: '100%' }}
        >
          <SandpackProvider
            files={steps[currentStep].files}
            template="static"
            theme={'dark'}
          >
            <SandpackLayout>
              <SandpackStack className="editor-instructions-container !h-full">
                <Markdown
                  currentStep={currentStep}
                  leftPanelHeight={leftPanelHeight}
                  setLeftPanelHeight={setLeftPanelHeight}
                />
                <MonacoEditor
                  currentCheckpoint={currentCheckpoint}
                  currentStep={currentStep}
                  files={steps[currentStep].files}
                  hoverSelection={hoverSelection}
                  isStepComplete={isStepComplete}
                  leftPanelHeight={leftPanelHeight}
                  onReady={() => setEditorReady(true)}
                  setCurrentCheckpoint={setCurrentCheckpoint}
                  setCurrentStep={setCurrentStep}
                  setHoverSelection={setHoverSelection}
                  setIsStepComplete={setIsStepComplete}
                  setLeftPanelHeight={setLeftPanelHeight}
                />
              </SandpackStack>
              <SandpackStack className="!h-full">
                <Button
                  className="absolute right-2 top-2 z-10"
                  onClick={() =>
                    window.open('https://forms.gle/weRYdVmr2LszmQiK6', '_blank')
                  }
                >
                  <Icon className="mr-1.5" name="plus-circled" />
                  <span>Join Waitlist</span>
                </Button>
                <SandpackPreview />
                {/* <SandpackConsole className="overflow-scroll" /> */}
                <ChatBot hoverSelection={hoverSelection} />
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

export default V2;
