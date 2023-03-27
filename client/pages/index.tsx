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
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import { getLanguage } from '👨‍💻widgets/Lesson/Editor/utils';
import PrevNext from '👨‍💻widgets/PrevNext';

const URN = 'urn:';

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
        code: "const http = require('http');\n\nconst hostname = '127.0.0.1';\nconst port = 3000;\n\nconst server = http.createServer((req, res) => {\n  res.statusCode = 200;\n  res.setHeader('Content-Type', 'text/html');\n  res.end('Hello world');\n});\n\nserver.listen(port, hostname, () => {\n  console.log(`Server running at http://${hostname}:${port}/`);\n});",
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      "Node.js is a powerful, cross-platform runtime environment that enables developers to build server-side applications using JavaScript. It is fast, scalable, and efficient due to its non-blocking I/O model and event-driven architecture.\n\nNode.js is popular among developers because it is easy to learn and use, thanks to its support for JavaScript. It is also widely used for building web servers, command-line tools, and real-time applications, and has a large number of libraries and modules available for use.\n\n**Let's use AI** to recreate the server, explaining every step along the way. To view your changes, click the **Restart Script** button in the bottom right corner of the editor.",
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
      "Using AI is easy! Start by **typing some code**, and the AI will try to predict what you're going to type next.\n\n Start by typing out `const http = require('http');`\n\n**Note! Make sure you type the code above by hand to get a sense of the power of AI.**",
    start: 'const ',
  },
  {
    files: {
      '/index.js': {
        code: '// Create a Node.js server using the http library\n',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      "Great! AI helped you require the `http` library. Or, maybe it struggled to do so!\nLet's try again, but first let's give the AI a **little more context**. Try again after the comment `// Create a Node.js server`.\n\nStart by typing out `const http = require('http');`\n\n**Note! Make sure you type the code above by hand to get a sense of the power of AI.**",
    start: '// Create a Node.js server using the http library\n',
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
      "Nice work! AI is a lot more powerful when you give it context. We can 'train' the AI to understand the context of our code by adding comments.\n\nLet's keep going. Try again after the comment `// Set the hostname and port`.\n\n**Start by typing the letter 'c'**",
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
      "Great! AI helped you set the hostname and port. You may have noticed by now that the **AI is not perfect**. It will make mistakes, and you will need to correct them.\n\nLet's keep going. Try again after the comment `// Create the server and respond with 200 'Hello world'`.\n\n**Start by typing the letter 'c'**",
    start: "Create the server and respond with 200 'Hello world'\n",
  },
];

function MonacoEditor({
  currentStep,
  files,
}: {
  currentStep: number;
  files: any;
}) {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const { activeFile } = sandpack;
  const [completions, setCompletions] = useState<any>([]);
  const editorRef = useRef<any>();
  const monacoRef = useRef<any>();

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
    <SandpackStack className="relative" style={{ height: '100%', margin: 0 }}>
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
          fontSize: 16,
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
    </SandpackStack>
  );
}

const Home = () => {
  const [currentStep, setCurrentStep] = useState(0);

  console.log(steps[currentStep].files);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-5">
      <div
        className="overflow-hidden rounded-lg border border-neutral-700"
        style={{ height: '100%', width: '92%' }}
      >
        <SandpackProvider
          files={steps[currentStep].files}
          template="node"
          theme={'dark'}
        >
          <SandpackLayout>
            <SandpackStack>
              <div className="h-72 overflow-scroll border-b border-neutral-700 bg-neutral-900">
                <ReactMarkdown
                  children={steps[currentStep].instructions}
                  className="markdown-body py-2 px-3"
                  plugins={[gfm]}
                />
              </div>
              <MonacoEditor
                currentStep={currentStep}
                files={steps[currentStep].files}
              />
            </SandpackStack>
            <SandpackStack>
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

export default Home;
