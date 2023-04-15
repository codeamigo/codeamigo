import {
  FileTabs,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import Editor from '@monaco-editor/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindowSize } from 'hooks/useWindowSize';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import debounce from 'utils/debounce';

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

const steps = [
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
      "## Intro to Codeamigo - Part 1\nCodeamigo comes equipped with a built-in editor, preview and terminal. Let's get familiar with these tools. The editor below is where you'll be spending most of your time. The preview is where you'll see the results of your code. The terminal is where you'll see any errors or warnings that your code might have.\n\nTo see these tools in action, let's modify the code in the editor. Change the text in the `h1` tag to say **Hello Codeamigo!**\n\nThen, click **Next** when you're ready to continue.",
    start: 'Hello ',
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
      "## Intro to Codeamigo - Part 2\n**Woah! Did you see that?!** How did Codeamigo know what you were going to type next? Codeamigo talks to OpenAI to suggest code for you! It's like magic 🔮.\n\nWhat else can we use this technology for? Well, maybe you're a bit confused about what some of these lines of code are doing in the editor. For example, what does `<!DOCTYPE html>` do? **Using your cursor select the line of code and hover over the highlighted text to see a description of what it does.**\n\nReady to learn more? Click **Next** to continue.",
    start: '',
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
      "## Intro to Codeamigo - Part 3\nCodeamigo's helpful tooltip can also be used on a single word. Without highlighting anything, **find and hover over the word `head`** and wait for Codeamigo to tell you what it does.\n\nReady to learn more? Click **Next** to continue.",
    start: '',
  },
  {
    checkpoints: [
      {
        message: 'Add a <p> tag with the text "This is a paragraph"',
        passed: false,
        test: /<p>\s*This is a paragraph\s*\<\/p>/i,
      },
    ],
    files: {
      '/index.html': {
        code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="stylesheet" href="./styles.css" />\n    <title>Document</title>\n  </head>\n  <body>\n    <h1>Hello codeamigo!</h1>\n    <!-- Add a p tag with the text "This is a paragraph" -->\n    \n  </body>\n</html>',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "main": "/index.html",\n  "devDependencies": {}\n}',
      },
      '/styles.css': {
        code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}',
      },
    },
    instructions:
      "## Intro to Codeamigo - Part 4\nHere's a helpful hint for those of you new to code. When Codeamigo makes a suggestion for you it will be in **gray** and _italicized_. If you want to use Codeamigo's suggestion, you can press tab to accept it. Let's give it a shot. After `<h1>Hello codeamigo!</h1>` type `<p` and wait for Codeamigo to suggest something. Then press tab to accept Codeamigo's suggestion.\n\nReady to learn more? Click **Next** to continue.",
    start: '-->\n    ',
  },
  {
    checkpoints: [],
    files: {
      '/index.html': {
        code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="stylesheet" href="./styles.css" />\n    <title>Document</title>\n  </head>\n  <body>\n    <h1>Hello codeamigo!</h1>\n    <!-- Add a p tag with the text "This is a paragraph" -->\n    <p>This is a paragraph</p>\n  </body>\n</html>',
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
  },
];

function MonacoEditor({
  currentCheckpoint,
  currentStep,
  files,
  isStepComplete,
  leftPanelHeight,
  onReady,
  setCurrentCheckpoint,
  setCurrentStep,
  setIsStepComplete,
  setLeftPanelHeight,
}: {
  currentCheckpoint: number;
  currentStep: number;
  files: any;
  isStepComplete: boolean;
  leftPanelHeight: {
    editor: string;
    instructions: string;
  };
  onReady: () => void;
  setCurrentCheckpoint: Dispatch<SetStateAction<number>>;
  setCurrentStep: Dispatch<SetStateAction<number>>;
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
  const { minWidth } = useWindowSize();
  const sm = minWidth('sm');
  const [full, setFull] = useState(false);
  const isStepCompleteRef = useRef(isStepComplete);
  const [hoverSelection, setHoverSelection] = useState<string | null>(null);

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
    if (regex.test(value)) {
      steps[currentStep].checkpoints[currentCheckpoint].passed = true;
      allPassed = steps[currentStep].checkpoints.every(
        (checkpoint: any) => checkpoint.passed
      );
      if (allPassed) {
        setIsStepComplete(true);
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

        const range = selectionValue
          ? selection
          : {
              endLineNumber: position.lineNumber,
              startLineNumber: position.lineNumber,
              ...wordAtPosition,
            };

        const prompt = `${editorRef.current.getValue()}} """ In the above code explain what ${nextHoverSelection} is doing to a total noob. Start the explanation with ${
          word && !isWordInSelection
            ? `${nextHoverSelection} is`
            : 'This code is'
        } ""}`;
        if (nextHoverSelection) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/explain`,
              {
                body: JSON.stringify({
                  nextHoverSelection,
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

            return {
              contents: [
                {
                  supportHtml: true,
                  value: '**What is this code doing?**',
                },
                { value },
              ],
              range: new monacoRef.current.Range(
                range.startLineNumber,
                range.startColumn,
                range.endLineNumber,
                range.endColumn
              ),
            };
          } catch (error) {
            console.log(error);
          }
        }
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
      className={`relative overflow-hidden border-neutral-800 bg-neutral-900 transition-all ${
        full ? 'z-40' : 'z-20'
      }`}
      key={currentStep}
      style={{ height: `${leftPanelHeight.instructions}` }}
    >
      <ReactMarkdown
        children={steps[currentStep].instructions}
        className="markdown-body h-full overflow-scroll py-2 px-3"
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
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
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
            <pre>{checkpoint.message}</pre>
          </div>
        );
      })}
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
      }, 2000);
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
        className="flex w-full flex-col items-center justify-center gap-3 p-5 md:h-full"
        initial={{ opacity: 0, scale: 0 }}
        style={{ transformOrigin: 'center' }}
        transition={transition}
      >
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
                  isStepComplete={isStepComplete}
                  leftPanelHeight={leftPanelHeight}
                  onReady={() => setEditorReady(true)}
                  setCurrentCheckpoint={setCurrentCheckpoint}
                  setCurrentStep={setCurrentStep}
                  setIsStepComplete={setIsStepComplete}
                  setLeftPanelHeight={setLeftPanelHeight}
                />
              </SandpackStack>
              <SandpackStack className="!h-full">
                <SandpackPreview />
                <SandpackConsole />
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
        className="fixed top-0 left-0 flex h-full w-full animate-pulse items-center justify-center text-white"
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
        {/* <span className="absolute flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F9D154] opacity-75"></span>
        </span> */}
      </motion.div>
    </AnimatePresence>
  );
};

export default V2;
