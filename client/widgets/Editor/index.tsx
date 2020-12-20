import * as babel from "@babel/standalone";
import { ControlledEditor, monaco } from "@monaco-editor/react";
import React, { useCallback, useEffect } from "react";
import {
  RegularStepFragment,
  useStepQuery,
  useCreateCodeModuleMutation,
  useDeleteCodeModuleMutation,
  useUpdateCodeModuleMutation,
} from "../../generated/graphql";
import { CodeSandboxV2ResponseI } from "../../pages/api/types";
import { debounce } from "debounce";
import { FilesType } from "./types";
import EditorFiles from "../EditorFiles";

const transformCode = (code: string, path: string) => {
  return babel.transform(code, {
    presets: ["es2015", "typescript", "react"],
    filename: path,
  });
};

const runCode = (files: FilesType, runPath: string) => {
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

const Editor: React.FC<Props> = ({ step }) => {
  const [files, setFiles] = React.useState({} as FilesType);
  const [dependencies, setDependencies] = React.useState({} as FilesType);
  const [currentPath, setCurrentPath] = React.useState("");
  const [currentCode, setCurrentCode] = React.useState("");
  const [outputCode, setOutputCode] = React.useState("");

  const { data, loading, refetch } = useStepQuery({
    variables: { id: step.id },
  });
  const [updateCodeModule] = useUpdateCodeModuleMutation();
  const [createCodeModule] = useCreateCodeModuleMutation();
  const [deleteCodeModule] = useDeleteCodeModuleMutation();

  const createFile = async (file: string) => {
    if (files[file] !== undefined) {
      alert("File name already taken.");
      return;
    }

    await createCodeModule({
      variables: { stepId: step.id, name: file, value: `` },
    });

    setFiles({
      ...files,
      [file]: ``,
    });

    refetch();
  };

  const removeFile = async (file: string) => {
    const module = data?.step?.codeModules?.find(
      (module) => module.name === file
    );

    if (!module) return;

    // remove file from files state
    const { [file]: tmp, ...rest } = files;
    setFiles(rest);

    deleteCodeModule({ variables: { id: module.id } });
  };

  const updateFile = useCallback(
    debounce((path: string, code: string) => {
      const currentModule = data?.step?.codeModules?.find(
        (module) => module.name === path
      );

      if (!currentModule) return;

      updateCodeModule({
        variables: {
          id: currentModule.id,
          name: path,
          value: code,
        },
      });
    }, 2500),
    []
  );

  useEffect(() => {
    if (!data?.step?.codeModules) return;

    const mods = data.step.codeModules.reduce(
      (acc, curr) => ({ ...acc, [curr.name as string]: curr.value }),
      {}
    ) as FilesType;

    setFiles(mods);
  }, [data?.step?.codeModules?.length]);

  useEffect(() => {
    try {
      const { code } = transformCode(currentCode, currentPath);

      setOutputCode(code);
    } catch (e) {
      setOutputCode(e.message);
    }
  }, [currentCode, currentPath]);

  const editorDidMount = (_: any, editor: any) => {
    async function getDeps() {
      // TODO, make dynamic!
      const dep1: CodeSandboxV2ResponseI = await fetch(
        "https://prod-packager-packages.codesandbox.io/v2/packages/jest-lite/1.0.0-alpha.4.json"
      ).then((res) => res.json());

      const dependency =
        dep1.contents["/node_modules/jest-lite/dist/core.js"].content;

      setDependencies({
        ...dependencies,
        [dep1.dependency.name]: dependency,
      });

      const monacoInstance = await monaco.init();

      // validation settings
      monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
        {
          noSemanticValidation: true,
          noSyntaxValidation: false,
        }
      );

      // compiler options
      monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions(
        {
          target: monacoInstance.languages.typescript.ScriptTarget.ESNext,
          allowSyntheticDefaultImports: true,
          allowNonTsExtensions: true,
          typeRoots: ["node_modules/@types"],
        }
      );

      // const fakeFiles = Object.keys(dep1.contents).reduce((acc, curr) => ({
      //   ...acc,
      //   [curr]: dep1.contents[curr].content
      // }), {})

      // for (const fileName in fakeFiles) {
      //   const fakePath = `file:///node_modules/@types/${fileName}`;

      //   monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
      //     // @ts-ignore
      //     fakeFiles[fileName],
      //     fakePath
      //   );
      // }
    }

    getDeps();
  };

  return (
    <div className="flex w-full">
      <div className="px-4 py-5 bg-white sm:p-6 w-1/2">
        <h3>Initial Code</h3>
        <div className="flex rounded-md border border-gray-200 whitespace-nowrap">
          <EditorFiles
            createFile={createFile}
            removeFile={removeFile}
            currentPath={currentPath}
            files={files}
            setCurrentPath={setCurrentPath}
          />
          <ControlledEditor
            height="300px"
            className="w-8/12"
            language={"typescript"}
            value={files[currentPath]}
            options={{
              minimap: { enabled: false },
            }}
            editorDidMount={editorDidMount}
            onChange={(_, value) => {
              setFiles({
                ...files,
                [currentPath]: value || "",
              });
              setCurrentCode(value || "");
              updateFile(currentPath, value || "");
            }}
          />
        </div>
      </div>
      <div className="px-4 py-5 bg-white sm:p-6 w-1/2">
        <button
          type="button"
          onClick={() => runCode({ ...files, ...dependencies }, currentPath)}
        >
          Run
        </button>
        <div>{outputCode}</div>
      </div>
    </div>
  );
};

type Props = {
  step: RegularStepFragment;
};

export default Editor;
