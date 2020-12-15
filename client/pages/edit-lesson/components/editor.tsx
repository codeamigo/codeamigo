import * as babel from "@babel/standalone";

import { ControlledEditor } from "@monaco-editor/react";
import React, { useEffect } from "react";
import { monacoFileLanguage } from "../../../utils";

const FILES: { [key in string]: string } = {
  "app.tsx": ``.trim(),
  "game.tsx": ``.trim(),
};

const Editor: React.FC<Props> = ({ setCode }) => {
  const [currentPath, setPath] = React.useState("app.tsx");
  const [files, setFiles] = React.useState(FILES);

  const updateFile = (path: string, code: string) => {
    setFiles({
      ...files,
      [path]: code,
    });
  };

  return (
    <div className="flex w-full">
      <div className="w-2/4 pr-4 bg-white sm:pr-6">
        <div className="flex rounded-md border border-gray-200">
          <div>
            {Object.keys(FILES).map((path) => (
              <button
                className="text-xs"
                key={path}
                onClick={() => setPath(path)}
                type="button"
              >
                {path}
              </button>
            ))}
          </div>
          <ControlledEditor
            height="300px"
            width="100%"
            language={monacoFileLanguage(currentPath.split(".")[1])}
            options={{
              iframe: true,
              minimap: { enabled: false },
            }}
            value={files[currentPath]}
            onChange={(_, value) => {
              updateFile(currentPath, value || "");
            }}
          />
        </div>
      </div>
      <div className="w-2/4 pr-4 bg-white sm:pr-6">
        <iframe
          srcDoc={`
          <!doctype html>
            <html lang="en-us">
              <head>
                  <title>React JSX Babel-Standalone Import/Export Problem</title>
                  <meta charset="utf-8">
              </head>
              <body>
                <div id="root"></div>
                <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
                <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

                <script data-plugins="transform-es2015-modules-umd" type="text/babel">
                  ${files['app.tsx']}
                </script>
              </body>
            </html>
          `}
        ></iframe>
      </div>
    </div>
  );
};

type Props = {
  setCode: (value: string) => void;
};

export default Editor;
