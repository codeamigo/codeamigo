import * as babel from "@babel/standalone";
import { ControlledEditor, monaco } from "@monaco-editor/react";
import React, { useCallback, useEffect } from "react";
import {
  RegularStepFragment,
  useCreateCodeModuleMutation,
  useDeleteCodeModuleMutation,
  useUpdateCodeModuleMutation,
} from "@generated/graphql";
import { CodeSandboxV2ResponseI } from "@api/types";
import { debounce } from "debounce";
import { FilesType } from "./types";
import EditorFiles from "../EditorFiles";

const CS_PKG_URL = "https://prod-packager-packages.codesandbox.io/v2/packages";

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

const Editor: React.FC<Props> = ({ step, refetch }) => {
  const [files, setFiles] = React.useState({} as FilesType);
  const [dependencies, setDependencies] = React.useState({} as FilesType);
  const [currentPath, setCurrentPath] = React.useState("");
  const [currentCode, setCurrentCode] = React.useState("");
  const [outputCode, setOutputCode] = React.useState("");

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

    setCurrentPath(file);

    refetch();
  };

  const deleteFile = async (file: string) => {
    const module = step?.codeModules?.find((module) => module.name === file);

    if (!module) return;

    // remove file from files state
    const { [file]: tmp, ...rest } = files;
    setFiles(rest);

    deleteCodeModule({ variables: { id: module.id } });
  };

  const updateFile = useCallback(
    debounce(async (path: string, code: string) => {
      const currentModule = step?.codeModules?.find(
        (module) => module.name === path
      );

      if (!currentModule) return;

      await updateCodeModule({
        variables: {
          id: currentModule.id,
          name: path,
          value: code,
        },
      });
    }, 1000),
    [step?.id]
  );

  useEffect(() => {
    console.log("STEP MODS", step?.codeModules);
    if (!step?.codeModules) return;

    const mods = step.codeModules.reduce(
      (acc, curr) => ({ ...acc, [curr.name as string]: curr.value }),
      {}
    ) as FilesType;

    setFiles(mods);

    if (!currentPath) setCurrentPath(Object.keys(mods)[0]);
  }, [step?.id, step?.codeModules]);

  useEffect(() => {
    try {
      const { code } = transformCode(currentCode, currentPath);

      setOutputCode(code);
    } catch (e) {
      setOutputCode(e.message);
    }
  }, [currentCode, currentPath]);

  async function getDeps() {
    const newDependencies = step.dependencies?.reduce(
      async (acc, { package: pkg, version }) => {
        const res: CodeSandboxV2ResponseI = await fetch(
          `${CS_PKG_URL}/${pkg}/${version}.json`
        ).then((res) => res.json());

        const pkgJson = res.contents[`/node_modules/${pkg}/package.json`];
        const main = JSON.parse(pkgJson.content).main;

        return {
          ...acc,
          [pkg]: res.contents[`/node_modules/${pkg}/${main}`].content,
        };
      },
      {}
    );

    setDependencies({
      ...dependencies,
      ...await newDependencies,
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
    monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monacoInstance.languages.typescript.ScriptTarget.ESNext,
      allowSyntheticDefaultImports: true,
      allowNonTsExtensions: true,
      typeRoots: ["node_modules/@types"],
    });

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

  const editorDidMount = (_: any, editor: any) => {
    getDeps();
  };

  return (
    <div className="flex w-full">
      <div className="px-4 py-5 bg-white sm:p-6 w-1/2">
        <h3>Initial Code</h3>
        <div className="flex rounded-md border border-gray-200 whitespace-nowrap">
          <EditorFiles
            createFile={createFile}
            deleteFile={deleteFile}
            currentPath={currentPath}
            files={files}
            dependencies={dependencies}
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
  refetch: any;
};

export default Editor;
