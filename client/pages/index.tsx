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
      '/App.js': {
        code: 'export default function App() {\n // return a type of food you like to eat \n return <h1>I like to eat </h1>\n}\n',
      },
      '/index.js': {
        code: 'import React, { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport "./styles.css";\n\nimport App from "./App";\n\nconst root = createRoot(document.getElementById("root"));\nroot.render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);',
      },
      '/package.json': {
        code: '{\n  "dependencies": {\n    "react": "^18.0.0",\n    "react-dom": "^18.0.0",\n    "react-scripts": "^4.0.0"\n  },\n  "main": "/index.js",\n  "devDependencies": {}\n}',
      },
      '/public/index.html': {
        code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>',
      },
      '/styles.css': {
        code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}',
      },
    },
    instructions: 'Start typing to get suggestions for foods you like to eat.',
    start: 'I like to eat ',
  },
  {
    files: {
      '/App.js': {
        code: 'export default function App() {\n // Create an element that can be used to display a box \n return \n}\n',
      },
      '/index.js': {
        code: 'import React, { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport "./styles.css";\n\nimport App from "./App";\n\nconst root = createRoot(document.getElementById("root"));\nroot.render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);',
      },
      '/package.json': {
        code: '{\n  "dependencies": {\n    "react": "^18.0.0",\n    "react-dom": "^18.0.0",\n    "react-scripts": "^4.0.0"\n  },\n  "main": "/index.js",\n  "devDependencies": {}\n}',
      },
      '/public/index.html': {
        code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>',
      },
      '/styles.css': {
        code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}',
      },
    },
    instructions: 'Create an element that can be used to display a box',
    start: ' return ',
  },
];

function usePrevious(value: any) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

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
    const model = monacoRef.current.editor.getModel(
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

    // try {
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/completions`,
    //     {
    //       body: JSON.stringify({
    //         prompt,
    //         suffix,
    //       }),
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       method: 'POST',
    //     }
    //   );

    //   const completions = await response.json();
    //   const uniqueCompletions = [
    //     ...new Set(completions.map((item: any) => item.text)),
    //   ];

    //   setCompletions(uniqueCompletions);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const debouncedUpdatePrompt = useMemo(() => debounce(updatePrompt, 100), []);

  const setupModels = () => {
    if (!monacoRef.current) return;
    if (!editorRef.current) return;

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

  const handleMount = (editor: any, monaco: any) => {
    if (editorRef.current) return;
    if (monacoRef.current) return;
    editorRef.current = editor;
    monacoRef.current = monaco;

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
        key={sandpack.activeFile}
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
          files={steps[currentStep].files}
          template="react"
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
