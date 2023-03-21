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

import PrevNext from '👨‍💻widgets/PrevNext';

const steps = [
  {
    files: {
      '/App.js': {
        code: 'export default function App() {\n // return a type of food you like to eat \n return <h1>Hello world!</h1>\n}\n',
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
  },
];

function MonacoEditor() {
  const { code, updateCode, ...rest } = useActiveCode();
  const { sandpack } = useSandpack();

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
      console.log(completions[0].text);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SandpackStack style={{ height: '100vh', margin: 0 }}>
      <FileTabs />
      <Editor
        defaultValue={code}
        height="100%"
        key={sandpack.activeFile}
        language="javascript"
        onChange={(value, ev) => {
          updateCode(value || '');
          updatePrompt(value, ev);
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
