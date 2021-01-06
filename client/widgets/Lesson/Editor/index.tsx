import { CodeSandboxV2ResponseI } from '@api/types';
import {
  RegularCheckpointFragment,
  RegularStepFragment,
  useCompleteCheckpointMutation,
  useCreateCodeModuleMutation,
  useDeleteCodeModuleMutation,
  useUpdateCodeModuleMutation,
} from '@generated/graphql';
import { ControlledEditor, monaco } from '@monaco-editor/react';
import { debounce } from 'debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import EditorFiles from '../EditorFiles';
import { FilesType, PreviewType } from './types';
import { getExtension } from './utils';

const FILE = 'file:///';

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
  const editorRef = useRef<any>();
  const monacoRef = useRef<any>();

  const [files, setFiles] = useState({} as FilesType);
  const [dependencies, setDependencies] = useState({} as FilesType);
  const [currentPath, setCurrentPath] = useState('');
  const [currentCheckpoint, setCurrentCheckpoint] = useState<
    RegularCheckpointFragment | undefined
  >(undefined);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const [createCodeModule] = useCreateCodeModuleMutation();
  const [updateCodeModule] = useUpdateCodeModuleMutation();
  const [deleteCodeModule] = useDeleteCodeModuleMutation();

  const [completeCheckpoint] = useCompleteCheckpointMutation();

  // Change Step
  useEffect(() => {
    if (!step.codeModules) return;
    if (!isEditorReady) return;

    const mods = step.codeModules.reduce(
      (acc, curr) => ({ ...acc, [curr.name as string]: curr.value }),
      {}
    ) as FilesType;

    const diff = Object.keys(mods).reduce((acc, file) => {
      if (!files[file]) acc.push(file);
      return acc;
    }, [] as Array<string>);

    // check difference between files and incoming modules
    // if there is no difference then goToMain file
    // if !files ({}) then goToMain file
    // otherwise to to the new file
    if (!Object.keys(files).length) {
      goToMain(mods);
    } else if (diff) {
      goToMain(files, diff[0]);
    } else {
      goToMain(mods);
    }

    setFiles(mods);
  }, [step.id, step.codeModules, isEditorReady]);

  // Files changed => set up editor models
  useEffect(() => {
    if (isEditorReady) {
      setupModels();
    }
  }, [files, isEditorReady]);

  // Path changed => set current model
  useEffect(() => {
    if (isEditorReady) {
      setModel(currentPath);
    }
  }, [currentPath]);

  useEffect(() => {
    updateDependencies();
  }, [step.dependencies]);

  useEffect(() => {
    console.log(step.checkpoints);
    const sortedCheckpoints = (step.checkpoints || [])
      .slice()
      .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1));

    const nextCheckpoint = sortedCheckpoints.find(
      (checkpoint) => !checkpoint.isCompleted
    );

    setCurrentCheckpoint(nextCheckpoint);
  }, [step.checkpoints]);

  useEffect(() => {
    window.addEventListener('message', (message) => {
      if (message.data.from === 'preview') {
        try {
          // don't complete checkpoint if editting
          if (rest.isEditting) return;

          const result = JSON.parse(message.data.result);

          console.log('result', result);
          console.log('nextCheckpoint', currentCheckpoint);

          if (
            result[result.length - 1].status === 'pass' &&
            currentCheckpoint
          ) {
            completeCheckpoint({
              refetchQueries: ['Step'],
              variables: { id: currentCheckpoint.id },
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    });

    return () => window.removeEventListener('message', () => null);
  }, [currentCheckpoint]);

  const createFile = async (file: string) => {
    const value = ``;

    await createCodeModule({
      refetchQueries: ['Step'],
      variables: { name: file, stepId: step.id, value },
    });

    setFiles({
      ...files,
      [file]: value,
    });

    setCurrentPath(file);
  };

  const deleteFile = async (file: string) => {
    const module = step?.codeModules?.find((module) => module.name === file);

    if (!module) return;

    monacoRef.current.editor.getModel(`${FILE}${step.id}-${file}`).dispose();

    // remove file from files state
    const { [file]: tmp, ...rest } = files;
    setFiles(rest);

    // delete module
    await deleteCodeModule({ variables: { id: module.id } });
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

  const postCode = useCallback(
    debounce(
      (
        files: FilesType,
        dependencies: FilesType,
        runPath: string,
        value: string,
        isTest?: boolean
      ) => {
        const iframe = document.getElementById('frame') as HTMLIFrameElement;
        if (!iframe) return;
        const iframeContentWindow = iframe.contentWindow;
        if (!iframeContentWindow) return;

        // send files and path to iframe
        iframeContentWindow.postMessage(
          {
            files: { ...files, ...dependencies, [runPath]: value },
            from: 'editor',
            isTest,
            runPath,
          } as PreviewType,
          '*'
        );
      },
      1500
    ),
    []
  );

  async function getDeps() {
    await updateDependencies();
  }

  const setupCompilerOptions = () => {
    const jsxFactory = 'React.createElement';
    const reactNamespace = 'React';
    const hasNativeTypescript = false;

    // https://github.com/codesandbox/codesandbox-client/blob/master/packages/app/src/embed/components/Content/Monaco/index.js
    monacoRef.current.languages.typescript.typescriptDefaults.setCompilerOptions(
      {
        allowJs: true,
        allowNonTsExtensions: !hasNativeTypescript,
        experimentalDecorators: true,
        jsx: monacoRef.current.languages.typescript.JsxEmit.React,
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

        typeRoots: ['node_modules/@types'],
      }
    );
  };

  const setupDiagnosticsOptions = () => {
    monacoRef.current.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
      {
        noSemanticValidation: true,
        noSyntaxValidation: true,
      }
    );
  };

  const setupCommands = () => {
    editorRef.current.addCommand(
      monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.KEY_S,
      () => {
        editorRef.current.getAction('editor.action.formatDocument').run();
      }
    );
  };

  const setupModels = () => {
    Object.keys(files).map((file) => {
      if (monacoRef.current.editor.getModel(`${FILE}${step.id}-${file}`))
        return;

      monacoRef.current.editor.createModel(
        files[file],
        getExtension(file),
        `${FILE}${step.id}-${file}`
      );
    });
  };

  const setupTypes = () => {
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
  };

  const setupEditor = () => {
    setupCommands();
    setupCompilerOptions();
    setupDiagnosticsOptions();
    setupTypes();

    setIsEditorReady(true);
  };

  const editorDidMount = async (_: any, editor: any) => {
    await getDeps();

    const monacoInstance = await monaco.init();

    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    setupEditor();
  };

  const goToMain = (files: FilesType, file?: string) => {
    const main =
      file ||
      Object.keys(files).find((file) => file === 'app.tsx') ||
      Object.keys(files).filter((n) => !n.includes('spec'))[0];

    setModel(main);
    setCurrentPath(main);
    postCode(files, dependencies, main, files[main]);
  };

  const setModel = (path: string) => {
    editorRef.current.setModel(
      monacoRef.current.editor.getModel(`${FILE}${step.id}-${path}`)
    );
    editorRef.current.focus();
  };

  return (
    <div className="w-full lg:h-full flex flex-col">
      <h3 className="flex justify-between">
        <span>Initial Code</span>
        <div className="flex">
          <button
            className="inline-flex items-center px-2 border border-transparent shadow-xs text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
            onClick={() =>
              postCode(
                files,
                dependencies,
                currentCheckpoint!.test,
                files[currentCheckpoint!.test],
                true
              )
            }
            type="button"
          >
            Test
          </button>
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
              postCode(files, dependencies, currentPath, value || '');
              updateFile(currentPath, value || '');
            }}
            options={{
              automaticLayout: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
            }}
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
