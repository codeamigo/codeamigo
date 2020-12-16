import * as babel from "@babel/standalone";
import { ControlledEditor, monaco, Monaco } from "@monaco-editor/react";
import React, { useEffect } from "react";
import { CodeModule, Step, useStepQuery } from "../../../generated/graphql";

const transformCode = (code: string, path: string) => {
  return babel.transform(code, {
    presets: ["es2015", "typescript", "react"],
    filename: path,
  });
};

const runCode = (files: { [key in string]: string }, runPath: string) => {
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

const Editor: React.FC<Props> = ({ setCode, step }) => {
  const [files, setFiles] = React.useState({});
  const [codeModules, setCodeModules] = React.useState({});
  const [currentPath, setPath] = React.useState("app.tsx");
  const [currentCode, setCurrentCode] = React.useState("");
  const [outputCode, setOutputCode] = React.useState("");

  const { data } = useStepQuery({ variables: { id: step.id } });

  const updateFile = (path: string, code: string) => {
    setFiles({
      ...files,
      [path]: code,
    });

    setCode({
      id: 2,
      name: path,
      value: code,
    });

    setCurrentCode(code);
  };

  useEffect(() => {
    const mods: { [key in string]: string } = data?.step?.codeModules?.reduce(
      (acc, curr) => ({ ...acc, [curr.name as string]: curr.value }),
      {}
    ) || {
      "app.tsx": "",
    };

    setFiles(mods);
  }, [data?.step?.codeModules]);

  useEffect(() => {
    try {
      const { code } = transformCode(currentCode, currentPath);

      setOutputCode(code);
    } catch (e) {
      setOutputCode(e.message);
    }
  }, [currentCode, currentPath]);

  const editorDidMount = (_, editor) => {
    async function getDeps() {
      const dep1 = await fetch(
        "https://prod-packager-packages.codesandbox.io/v2/packages/moment/2.29.1.json"
      ).then((res) => res.json());
      const dep2 = await fetch(
        "https://prod-packager-packages.codesandbox.io/v1/typings/moment/2.29.1.json"
      ).then((res) => res.json());

      setFiles({
        ...files,
        moment: dep1.contents["/node_modules/moment/moment.js"].content,
      });

      const monacoInstance = await monaco.init();

      // validation settings
      monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });

      // compiler options
      monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monacoInstance.languages.typescript.ScriptTarget.ESNext,
        allowSyntheticDefaultImports: true,
        allowNonTsExtensions: true,
        typeRoots: ["node_modules/@types"]
      });

      const fakeFiles = {
        "moment.d.ts": dep2.files["/moment/moment.d.ts"].module.code,
      };

      for (const fileName in fakeFiles) {
        const fakePath = `file:///node_modules/@types/${fileName}`;

        monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
          // @ts-ignore
          fakeFiles[fileName],
          fakePath,
        );
      }

      const fakePath = "file:///moment.js";
      monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
        dep1.contents["/node_modules/moment/moment.js"].content.trim(),
        fakePath
      );

      const model = monacoInstance.editor.createModel(
        files[currentPath],
        "typescript",
        monacoInstance.Uri.parse("file:///app.tsx")
      );

      editor.setModel(model);
    }

    getDeps();
  };

  return (
    <div className="flex w-full">
      <div className="px-4 py-5 bg-white sm:p-6 w-1/2">
        <h3>Initial Code</h3>
        <div className="flex rounded-md border border-gray-200">
          <div>
            {Object.keys(files).map((path) => (
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
            language={"typescript"}
            value={files[currentPath]}
            options={{
              minimap: { enabled: false },
            }}
            editorDidMount={editorDidMount}
            onChange={(_, value) => updateFile(currentPath, value || "")}
          />
        </div>
      </div>
      <div className="px-4 py-5 bg-white sm:p-6 w-1/2">
        <button type="button" onClick={() => runCode(files, currentPath)}>
          Run
        </button>
        <div>{outputCode}</div>
      </div>
    </div>
  );
};

type Props = {
  setCode: (value: { id: number; name: string; value: string }) => void;
  step: {
    __typename?: "Step" | undefined;
  } & Pick<Step, "id" | "createdAt" | "instructions"> & {
      codeModules?:
        | ({
            __typename?: "CodeModule" | undefined;
          } & Pick<CodeModule, "id" | "name" | "value">)[]
        | null
        | undefined;
    };
};

export default Editor;
