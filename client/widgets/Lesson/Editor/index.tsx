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

export const findBestMatch = (
  files: FilesType | CodeSandboxV2ResponseI["contents"],
  runPath: string
) => {
  switch (true) {
    case !!files[runPath]: {
      return runPath;
    }
    case !!files[`${MODULE_ROOT}/${runPath}/index.js`]: {
      return `${MODULE_ROOT}/${runPath}/index.js`;
    }
    default:
      const fileKeys = Object.keys(files);
      const cleanRunPath = runPath.replace("./", "");

      const opt1 = fileKeys.find((file) => file.includes(`${cleanRunPath}.js`));
      const opt2 = fileKeys.find((file) => file.includes(cleanRunPath));

      switch (true) {
        case opt1 !== undefined: {
          return opt1;
        }
        case opt2 !== undefined: {
          return opt2;
        }
      }

      console.error(`No file found for ${runPath}`);
  }
};
export const MODULE_ROOT = "/node_modules";

const CS_PKG_URL = "https://prod-packager-packages.codesandbox.io/v2/packages";

const Editor: React.FC<Props> = ({ step }) => {
  const [files, setFiles] = React.useState({} as FilesType);
  const [dependencies, setDependencies] = React.useState({} as FilesType);
  const [currentPath, setCurrentPath] = React.useState("");

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
      refetchQueries: ["Step"],
    });

    setFiles({
      ...files,
      [file]: ``,
    });

    setCurrentPath(file);
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
    if (!step?.codeModules) return;

    const mods = step.codeModules.reduce(
      (acc, curr) => ({ ...acc, [curr.name as string]: curr.value }),
      {}
    ) as FilesType;

    setFiles(mods);

    if (!currentPath) setCurrentPath(Object.keys(mods)[0]);
  }, [step?.id, step?.codeModules]);

  const postCode = () => {
    // @ts-ignore
    const iframe =
      // @ts-ignore
      document.getElementById("frame").contentWindow;

    // send files and path to iframe
    iframe.postMessage(
      {
        files: { ...files, ...dependencies },
        runPath: currentPath,
        from: "editor",
      } as PreviewData["data"],
      "*"
    );
  };

  async function getDeps() {
    const fakeDeps = [
      { package: "react", version: "17.0.1" },
      { package: "react-dom", version: "17.0.1" },
      { package: "moment", version: "2.29.1" },
      { package: "jest-lite", version: "1.0.0-alpha.4" },
    ];

    let dependencyDependencies: { [key in string]: string } = {};

    const newDependencies = fakeDeps.reduce(
      async (acc, { package: pkg, version }) => {
        const res: CodeSandboxV2ResponseI = await fetch(
          `${CS_PKG_URL}/${pkg}/${version}.json`
        ).then((res) => res.json());

        const pkgJson = res.contents[`${MODULE_ROOT}/${pkg}/package.json`];
        const main = JSON.parse(pkgJson.content).main;
        const mainModule = findBestMatch(res.contents, main);

        Object.keys(res.contents).map((value) => {
          if (value !== mainModule)
            dependencyDependencies = {
              ...dependencyDependencies,
              [value]: res.contents[value].content,
            };
        });

        return {
          ...(await acc),
          ...dependencyDependencies,
          [mainModule!]: res.contents[mainModule!].content,
        };
      },
      {}
    );

    setDependencies({
      ...dependencies,
      ...(await newDependencies),
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

    // const fakeFiles = Object.keys(dependencyDependencies).reduce(
    //   (acc, curr) => ({
    //     ...acc,
    //     [curr]: dependencyDependencies[curr],
    //   }),
    //   {}
    // );

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
          <div className="w-8/12">
            <ControlledEditor
              height="300px"
              width="100%"
              language={"typescript"}
              value={files[currentPath] || dependencies[currentPath]}
              options={{
                minimap: { enabled: false },
              }}
              editorDidMount={editorDidMount}
              onChange={(_, value) => {
                setFiles({
                  ...files,
                  [currentPath]: value || "",
                });
                updateFile(currentPath, value || "");
              }}
            />
          </div>
        </div>
      </div>
      <div className="px-4 py-5 bg-white sm:p-6 w-1/2">
        <button type="button" onClick={() => postCode()}>
          Run
        </button>
        <iframe id="frame" src="http://localhost:1234/"></iframe>
      </div>
    </div>
  );
};

type Props = {
  step: RegularStepFragment;
};

export default Editor;
