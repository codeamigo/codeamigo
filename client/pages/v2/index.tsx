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
import { debounce } from 'debounce';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindowSize } from 'hooks/useWindowSize';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import Icon from '👨‍💻components/Icon';
import { getLanguage } from '👨‍💻widgets/Lesson/Editor/utils';
import PrevNext from '👨‍💻widgets/PrevNext';

const URN = 'urn:';

const instructionsHeight = 15;
const defaultLeftPanelHeight = {
  editor: 'calc(100% - 15rem)',
  instructions: '15rem',
};

const steps = [
  {
    files: {
      '/index.js': {
        code: "const http = require('http');\n\nconst hostname = '127.0.0.1';\nconst port = 3000;\n\nconst server = http.createServer((req, res) => {\n  res.statusCode = 200;\n  res.setHeader('Content-Type', 'text/html');\n  res.end('Hello world');\n});\n\nserver.listen(port, hostname, () => {\n  console.log(`Server running at http://${hostname}:${port}/`);\n});",
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      '## Introduction to Node.js\nObjective: By the end of this lesson, you will be able to understand the basics of Node.js, including its features, advantages, and how it can be used to build web applications.\n\nBelow is a simple starter template for a Node.js application. We will be using this template throughout the lesson. To view your changes, click the **Restart Script** button in the bottom right corner of the editor.',
    start: '',
  },
  {
    files: {
      '/index.js': {
        code: 'const ',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      "Using AI is easy! Start by **typing some code**, and the AI will try to predict what you're going to type next.\n\n Start by typing out `const http = require('http');`\n\n**Note! Make sure you type the code above by hand to get a sense of the power of AI.**\n\n### What is this line doing? \n\nThis line is importing the `http` library from Node.js. The `http` library is used to create a Node.js server.",
    start: 'const ',
  },
  {
    files: {
      '/index.js': {
        code: "// Create a Node.js server using the http library\nconst http = require('http');\n\n// Set the hostname and port\n",
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      "Nice work! AI is a lot more powerful when you give it context. We can 'train' the AI to understand the context of our code by adding comments.\n\nLet's keep going. Try again after the comment `// Set the hostname and port`.\n\n**Start by typing the letter 'c'**\n\n### What is this line doing? \n\nThis line is setting the hostname and port for the server. The hostname is the address of the server, and the port is the port that the server will listen on.",
    start: '// Set the hostname and port\n',
  },
  {
    files: {
      '/index.js': {
        code: "// Create a Node.js server using the http library\nconst http = require('http');\n\n// Set the hostname and port\nconst hostname = 'localhost';\nconst port = 3000;\n\n// Create the server and respond with 200 'Hello world'\n",
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      "Great! AI helped you set the hostname and port. You may have noticed by now that the **AI is not perfect**. It will make mistakes, and you will need to correct them. Understanding where and when the AI makes mistakes will likely be the future developer's most important job!\n\nLet's keep going. Try again after the comment `// Create the server and respond with 200 'Hello world'`.\n\n**Start by typing the letter 'c'**\n\n### What is this line doing? \n\nThis line is creating the server and responding with 200 'Hello world'. 200 is the status code for a successful response.",
    start: "Create the server and respond with 200 'Hello world'\n",
  },
  {
    files: {
      '/index.js': {
        code: "// Create a Node.js server using the http library\nconst http = require('http');\n\n// Set the hostname and port\nconst hostname = 'localhost';\nconst port = 3000;\n\n// Create the server and respond with 200 'Hello world'\nconst server = http.createServer((req, res) => {\n  res.statusCode = 200;\n  res.setHeader('Content-Type', 'text/html');\n  res.end('Hello world');\n});\n\n// Start the server on `hostname` and `port`\n",
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      "Nice work! All that's left is to start the server. Try again after the comment `// Start the server on `hostname` and `port``.\n\n**Start by typing the letter 's'**\n\n### What is this line doing? \n\nThis line is starting the server on `hostname` and `port`.",
    start: '// Start the server on `hostname` and `port`\n',
  },
  {
    files: {
      '/index.js': {
        code: "// Create a Node.js server using the http library\nconst http = require('http');\n\n// Set the hostname and port\nconst hostname = 'localhost';\nconst port = 3000;\n\n// Create the server and respond with 200 'Hello world'\nconst server = http.createServer((req, res) => {\n  res.statusCode = 200;\n  res.setHeader('Content-Type', 'text/html');\n  res.end('Hello world');\n});\n\n// Start the server\nserver.listen(port, hostname, () => {\n  console.log(`Server running at http://${hostname}:${port}/`);\n});\n",
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      'Congratulations! You have created a Node.js server using the http library. You can now run the server by clicking the **Restart script** button in the bottom right corner.',
    start: '',
  },
];

function MonacoEditor({
  currentStep,
  files,
  leftPanelHeight,
  setLeftPanelHeight,
}: {
  currentStep: number;
  files: any;
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
}) {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const { activeFile } = sandpack;
  const [completions, setCompletions] = useState<any>([]);
  const editorRef = useRef<any>();
  const monacoRef = useRef<any>();
  const { minWidth } = useWindowSize();
  const sm = minWidth('sm');
  const [full, setFull] = useState(false);

  useEffect(() => {
    setLeftPanelHeight({
      editor: full ? '100%' : 'calc(100% - 15rem)',
      instructions: full ? '0px' : '15rem',
    });
  }, [full]);

  useEffect(() => {
    setFull(false);
    setCompletions([]);
  }, [currentStep]);

  useEffect(() => {
    if (!monacoRef.current) return;
    if (!editorRef.current) return;
    if (!activeFile) return;
    const model = editorRef.current.getModel(
      monacoRef.current.Uri.parse(`${URN}${activeFile}`)
    );
    if (model) editorRef.current.setModel(model);
  }, [activeFile, monacoRef.current, editorRef.current]);

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor
        .getModels()
        .forEach((model: any) => model.dispose());
      setupModels();
      setupStart();
    }
  }, [currentStep]);

  const updatePrompt = async (value: string | undefined, ev: any) => {
    if (!value || !ev) return;
    const lines = value.split(/\n/);
    const line = lines[ev.changes[0].range.startLineNumber - 1];
    const changePos = ev.changes[0].range.endColumn;
    const insert =
      line.substring(0, changePos) + ' [insert] ' + line.substring(changePos);
    lines[ev.changes[0].range.startLineNumber - 1] = insert;
    const prompt =
      steps[currentStep].instructions +
      '\n' +
      lines.join('\n').split(' [insert] ')[0];
    const suffix = lines.join('\n').split(' [insert] ')[1];

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

      const completions = await response.json();
      const uniqueCompletions = [
        ...new Set(completions.map((item: any) => item.text)),
      ];

      setCompletions(uniqueCompletions);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedUpdatePrompt = useMemo(() => debounce(updatePrompt, 100), []);

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

  const handleMount = (editor: any, monaco: any) => {
    if (monacoRef.current) return;
    monacoRef.current = monaco;
    editorRef.current = editor;

    setupCompilerOptions();
    setupModels();
    setupStart();
  };

  return (
    <SandpackStack
      className="relative z-10 transition-all"
      style={{ height: `${leftPanelHeight.editor}`, margin: 0 }}
    >
      <FileTabs />
      <Editor
        defaultValue={code}
        height="100%"
        language="javascript"
        onChange={(value, ev) => {
          setCompletions([]);
          updateCode(value || '');
          if (ev.changes[0].text.length > 1) {
          } else {
            debouncedUpdatePrompt(value, ev);
          }
        }}
        onMount={handleMount}
        options={{
          fontSize: sm ? 16 : 12,
          minimap: {
            enabled: false,
          },
          quickSuggestions: false,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
        }}
        theme="vs-dark"
        width="100%"
      />
      <div className="absolute bottom-4 w-full">
        <AnimatePresence>
          {completions.length > 0 && (
            <motion.div
              animate="show"
              className="mb-1 flex w-full items-center justify-center gap-3"
              initial="hidden"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
            >
              {completions.map((completion: string) => (
                <motion.div
                  className="relative cursor-pointer rounded-md bg-white p-2 font-bold text-black hover:bg-gray-200"
                  key={completion}
                  onClick={() => {
                    editorRef.current.executeEdits('my-source', [
                      {
                        forceMoveMarkers: true,
                        identifier: { major: 1, minor: 1 },
                        // @ts-ignore
                        range: new monaco.Range(
                          editorRef.current.getPosition().lineNumber,
                          editorRef.current.getPosition().column,
                          editorRef.current.getPosition().lineNumber,
                          editorRef.current.getPosition().column
                        ),
                        text: completion,
                      },
                    ]);
                    editorRef.current.setPosition({
                      column: editorRef.current.getPosition().column,
                      lineNumber: editorRef.current.getPosition().lineNumber,
                    });
                    editorRef.current.focus();
                    setCompletions([]);
                    updatePrompt(editorRef.current.getValue(), {
                      changes: [
                        {
                          range: {
                            startColumn: editorRef.current.getPosition().column,
                            startLineNumber:
                              editorRef.current.getPosition().lineNumber,
                          },
                        },
                      ],
                    });
                  }}
                  variants={{
                    hidden: { opacity: 0, top: '10px' },
                    show: { opacity: 1, top: '0px' },
                  }}
                >
                  {completion}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
      editor: full ? '0px' : 'calc(100% - 15rem)',
      instructions: full ? '100%' : '15rem',
    });
  }, [full]);

  return (
    <div
      className={`relative z-20 overflow-scroll border-b border-neutral-700 bg-neutral-900 transition-all`}
      key={currentStep}
      style={{ height: `${leftPanelHeight.instructions}` }}
    >
      <ReactMarkdown
        children={steps[currentStep].instructions}
        className="markdown-body py-2 px-3"
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

const V2 = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [leftPanelHeight, setLeftPanelHeight] = useState(
    defaultLeftPanelHeight
  );

  useEffect(() => {
    setLeftPanelHeight(defaultLeftPanelHeight);
  }, [currentStep]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 p-5 md:h-full">
      <div
        className="h-full overflow-hidden rounded-lg border border-neutral-700"
        style={{ width: '94%' }}
      >
        <SandpackProvider
          files={steps[currentStep].files}
          template="node"
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
                currentStep={currentStep}
                files={steps[currentStep].files}
                leftPanelHeight={leftPanelHeight}
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
      <PrevNext
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        steps={steps.length}
      />
    </div>
  );
};

export default V2;
