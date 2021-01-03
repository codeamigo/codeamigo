import { CodeSandboxV2ResponseI } from '@api/types';
import {
  RegularStepFragment,
  useCompleteCheckpointMutation,
  useCreateCodeModuleMutation,
  useDeleteCodeModuleMutation,
  useUpdateCodeModuleMutation,
} from '@generated/graphql';
import { ControlledEditor, monaco } from '@monaco-editor/react';
import { debounce } from 'debounce';
import React, { useCallback, useEffect } from 'react';

import EditorFiles from '../EditorFiles';
import { FilesType, PreviewType } from './types';

export const findBestMatch = (
  files: FilesType | CodeSandboxV2ResponseI['contents'],
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
      const cleanRunPath = runPath.replace('./', '');

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
export const MODULE_ROOT = '/node_modules';

const CS_PKG_URL = 'https://prod-packager-packages.codesandbox.io/v2/packages';

const Editor: React.FC<Props> = ({ step, ...rest }) => {
  const [files, setFiles] = React.useState({} as FilesType);
  const [dependencies, setDependencies] = React.useState({} as FilesType);
  const [currentPath, setCurrentPath] = React.useState('');

  const [createCodeModule] = useCreateCodeModuleMutation();
  const [updateCodeModule] = useUpdateCodeModuleMutation();
  const [deleteCodeModule] = useDeleteCodeModuleMutation();

  const [completeCheckpoint] = useCompleteCheckpointMutation();

  const sortedCheckpoints = (step.checkpoints || [])
    .slice()
    .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1));

  const nextCheckpoint = sortedCheckpoints.find(
    (checkpoint) => !checkpoint.isCompleted
  );

  const createFile = async (file: string) => {
    if (files[file] !== undefined) {
      alert('File name already taken.');
      return;
    }

    await createCodeModule({
      refetchQueries: ['Step'],
      variables: { name: file, stepId: step.id, value: `` },
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

  const updateDependencies = async () => {
    let dependencyDependencies: { [key in string]: string } = {};

    const newDependencies = step.dependencies?.reduce(
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
      ...(await newDependencies),
    });
  };

  const postCode = (path?: string, isTest?: boolean) => {
    // @ts-ignore
    const iframe =
      // @ts-ignore
      document.getElementById('frame').contentWindow;

    console.log('here');

    // send files and path to iframe
    iframe.postMessage(
      {
        files: { ...files, ...dependencies },
        from: 'editor',
        isTest,
        runPath: path || currentPath,
      } as PreviewType,
      '*'
    );
  };

  async function getDeps() {
    await updateDependencies();

    const jsxFactory = 'React.createElement';
    const reactNamespace = 'React';
    const hasNativeTypescript = false;
    const monacoInstance = await monaco.init();

    // validation settings
    monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
      {
        noSemanticValidation: true,
        noSyntaxValidation: true,
      }
    );

    // compiler options
    // https://github.com/codesandbox/codesandbox-client/blob/master/packages/app/src/embed/components/Content/Monaco/index.js
    monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
      allowJs: true,
      allowNonTsExtensions: !hasNativeTypescript,
      experimentalDecorators: true,
      jsx: monacoInstance.languages.typescript.JsxEmit.React,
      jsxFactory,
      module: hasNativeTypescript
        ? monacoInstance.languages.typescript.ModuleKind.ES2015
        : monacoInstance.languages.typescript.ModuleKind.System,
      moduleResolution:
        monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
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
      newLine: monacoInstance.languages.typescript.NewLineKind.LineFeed,

      noEmit: true,

      reactNamespace,

      target: monacoInstance.languages.typescript.ScriptTarget.ES2016,

      typeRoots: ['node_modules/@types'],
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

  useEffect(() => {
    if (!step.codeModules) return;

    const mods = step.codeModules.reduce(
      (acc, curr) => ({ ...acc, [curr.name as string]: curr.value }),
      {}
    ) as FilesType;

    setFiles(mods);

    if (!currentPath)
      setCurrentPath(Object.keys(mods).filter((n) => !n.includes('spec'))[0]);
  }, [step.id, step.codeModules]);

  useEffect(() => {
    updateDependencies();
  }, [step.dependencies]);

  useEffect(() => {
    window.addEventListener('message', (message) => {
      if (message.data.from === 'preview') {
        try {
          const result = JSON.parse(message.data.result);
          if (result[result.length - 1].status === 'pass' && nextCheckpoint) {
            completeCheckpoint({
              refetchQueries: ['Step'],
              variables: { id: nextCheckpoint.id },
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  }, []);

  return (
    <div className="w-full lg:h-full flex flex-col">
      <h3 className="flex justify-between">
        <span>Initial Code</span>
        <div className="flex">
          <button
            className="inline-flex items-center px-2 border border-transparent shadow-xs text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50"
            onClick={() => postCode()}
            type="button"
          >
            Run
          </button>
          {!rest.isEditting && (
            <button
              className="inline-flex items-center px-2 border border-transparent shadow-xs text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
              onClick={() => postCode(nextCheckpoint?.test, true)}
              type="button"
            >
              Test
            </button>
          )}
        </div>
      </h3>
      <div className="h-80 lg:h-full flex rounded-md border border-gray-200 whitespace-nowrap">
        <div className="w-4/12 border-r border-gray-200">
          <EditorFiles
            createFile={createFile}
            currentPath={currentPath}
            deleteFile={deleteFile}
            dependencies={step.dependencies}
            files={files}
            setCurrentPath={setCurrentPath}
            stepId={step.id}
            {...rest}
          />
        </div>
        <div className="w-8/12 h-80 lg:h-full">
          <ControlledEditor
            editorDidMount={editorDidMount}
            language={'typescript'}
            onChange={(_, value) => {
              setFiles({
                ...files,
                [currentPath]: value || '',
              });
              updateFile(currentPath, value || '');
            }}
            options={{
              automaticLayout: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
            }}
            value={files[currentPath] || dependencies[currentPath]}
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

type Props = {
  isEditting?: boolean;
  step: RegularStepFragment;
};

export default Editor;
