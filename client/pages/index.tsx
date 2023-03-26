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
      '## Introduction to Node.js\nObjective: By the end of this lesson, you will be able to understand the basics of Node.js, including its features, advantages, and how it can be used to build web applications.',
    start: 'I like to eat ',
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
      'Node.js is a powerful, cross-platform runtime environment that enables developers to build server-side applications using JavaScript. It is fast, scalable, and efficient due to its non-blocking I/O model and event-driven architecture.\n\nNode.js is popular among developers because it is easy to learn and use, thanks to its support for JavaScript. It is also widely used for building web servers, command-line tools, and real-time applications, and has a large number of libraries and modules available for use.',
    start: ' return ',
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

  console.log(sandpack.files);

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
    }
  }, [currentStep]);

  const updatePrompt = async (value: string | undefined, ev: any) => {
    if (!value || !ev) return;
    const lines = value.split(/\n/);
    const line = lines[ev.changes[0].range.startLineNumber - 1];
    const changePos = ev.changes[0].range.startColumn;
    const insert =
      line.substring(0, changePos) + ' [insert] ' + line.substring(changePos);
    lines[ev.changes[0].range.startLineNumber - 1] = insert;
    const prompt = lines.join('\n').split(' [insert] ')[0];
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
    Object.keys(sandpack.files).forEach((mod) => {
      const model = monacoRef.current.editor.getModel(
        monacoRef.current.Uri.parse(`${URN}${mod}`)
      );
      if (model) return;
      monacoRef.current.editor.createModel(
        sandpack.files[mod].code,
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

  const handleMount = (editor: any, monaco: any) => {
    if (monacoRef.current) return;
    monacoRef.current = monaco;
    editorRef.current = editor;

    setupModels();
    setupCompilerOptions();

    const match = editor
      .getModel()
      .findMatches(steps[currentStep].start, true, false, false, null, true)[0];
    if (!match) return;
    editor.setPosition(match.range.getEndPosition());
    editor.focus();
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
          debouncedUpdatePrompt(value, ev);
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

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-5">
      <div
        className="overflow-hidden rounded-lg border border-neutral-700"
        style={{ height: '100%', width: '92%' }}
      >
        <SandpackProvider
          // files={steps[currentStep].files}
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
            <SandpackPreview />
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
