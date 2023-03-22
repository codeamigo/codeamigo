import {
  FileTabs,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import Editor, { Monaco } from '@monaco-editor/react';
import { debounce } from 'debounce';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import PrevNext from '👨‍💻widgets/PrevNext';

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
    start: 'I like to eat ',
  },
];

function MonacoEditor() {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const [editor, setEditor] = useState<any>();
  const [completions, setCompletions] = useState<any>([]);

  const updatePrompt = async (value: string | undefined, ev: any) => {
    if (!value || !ev) return;
    const lines = value.split(/\n/);
    const line = lines[ev.changes[0].range.startLineNumber - 1];
    const changePos = ev.changes[0].range.startColumn;
    const insert =
      line.substring(0, changePos) + '[insert]' + line.substring(changePos);
    lines[ev.changes[0].range.startLineNumber - 1] = insert;
    const prompt = lines.join('\n').split('[insert]')[0];
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

  return (
    <SandpackStack className="relative" style={{ height: '100vh', margin: 0 }}>
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
        onMount={(editor) => {
          setEditor(editor);
          const match = editor
            .getModel()
            .findMatches(steps[0].start, true, false, false, null, true)[0];
          editor.setPosition(match.range.getEndPosition());
          editor.focus();
        }}
        options={{
          fontSize: 16,
          minimap: {
            enabled: false,
          },
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
                  className="relative cursor-pointer rounded-md bg-white p-2 text-black hover:bg-gray-200"
                  key={completion}
                  onClick={() => {
                    editor.executeEdits('my-source', [
                      {
                        forceMoveMarkers: true,
                        identifier: { major: 1, minor: 1 },
                        // @ts-ignore
                        range: new monaco.Range(
                          editor.getPosition().lineNumber,
                          editor.getPosition().column,
                          editor.getPosition().lineNumber,
                          editor.getPosition().column
                        ),
                        text: completion,
                      },
                    ]);
                    editor.setPosition({
                      column: editor.getPosition().column,
                      lineNumber: editor.getPosition().lineNumber,
                    });
                    editor.focus();
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
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-5">
      <div
        className="overflow-hidden rounded-lg border-2 border-gray-700"
        style={{ height: '100%', width: '92%' }}
      >
        <SandpackProvider
          files={steps[0].files}
          template="react"
          theme={'dark'}
        >
          <SandpackLayout>
            <MonacoEditor />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      </div>
      <PrevNext />
    </div>
  );
};

export default Home;
