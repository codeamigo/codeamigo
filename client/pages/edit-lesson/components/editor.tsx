import * as babel from "@babel/standalone";

import { ControlledEditor } from "@monaco-editor/react";
import React, { useEffect } from "react";
import { monacoFileLanguage } from "../../../utils";

const FILES: { [key in string]: string } = {
  "app.tsx": ``.trim(),
  "index.html": `<div id="root"></div>`.trim(),
};

const transformCode = (code: string, path: string) => {
  return babel.transform(code, {
    presets: ["es2015", "typescript", "react"],
    filename: path,
  });
};

const runCode = (files: typeof FILES, runPath: string) => {
  const code = files[runPath];
  const babelOutput = transformCode(code, runPath);

  const require = (path: string) => {
    return runCode(files, path);
  };
  const exports = {};
  const module = { exports };

  eval(babelOutput.code);

  return module.exports;
};

const Editor: React.FC<Props> = ({ setCode }) => {
  const [currentPath, setPath] = React.useState("app.tsx");
  const [files, setFiles] = React.useState(FILES);

  const currentCode = files[currentPath];
  const [outputCode, setOutputCode] = React.useState("");

  const updateFile = (path: string, code: string) => {
    setFiles({
      ...files,
      [path]: code,
    });
  };

  useEffect(() => {
    try {
      const { code } = transformCode(currentCode, currentPath);

      setOutputCode(code);
    } catch (e) {
      setOutputCode(e.message);
    }
  }, [currentCode, currentPath]);

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
        <button type="button" onClick={() => runCode(files, currentPath)}>
          Run Code
        </button>
        <div>{outputCode}</div>
      </div>
    </div>
  );
};

type Props = {
  setCode: (value: string) => void;
};

export default Editor;
