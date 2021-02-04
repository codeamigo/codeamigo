import { useReactiveVar } from '@apollo/client';
import { ControlledEditor, monaco } from '@monaco-editor/react';
import { debounce } from 'debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CodeSandboxV2ResponseI } from '👨‍💻api/types';
import { isTestingVar } from '👨‍💻apollo/cache/lesson';
import { Spinner } from '👨‍💻components/Spinners/index';
import {
  RegularStepFragment,
  StepDocument,
  StepQuery,
  useCompleteCheckpointMutation,
  useCreateCodeModuleMutation,
  useDeleteCodeModuleMutation,
  usePassCheckpointMutation,
  useUpdateCodeModuleMutation,
} from '👨‍💻generated/graphql';

import GITHUB from '../../../styles/monacoThemes/GITHUB.json';
import EditorFiles from '../EditorFiles';
import { FilesType, FromTestRunnerMsgType, ToPreviewMsgType } from './types';
import { getExtension } from './utils';

const FILE = 'file:///';
const CS_PKG_URL = 'https://prod-packager-packages.codesandbox.io/v2/packages';

const Editor: React.FC<Props> = ({ nextStep, step, ...rest }) => {
  const editorRef = useRef<any>();
  const monacoRef = useRef<any>();
  const submitRef = useRef<any>();

  const [files, setFiles] = useState({} as FilesType);
  const [dependencies, setDependencies] = useState({} as FilesType);
  const [currentPath, setCurrentPath] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const isTesting = useReactiveVar(isTestingVar);

  const [createCodeModule] = useCreateCodeModuleMutation();
  const [updateCodeModule] = useUpdateCodeModuleMutation();
  const [deleteCodeModule] = useDeleteCodeModuleMutation();

  const [completeCheckpointM] = useCompleteCheckpointMutation();
  const [passCheckpoint] = usePassCheckpointMutation();

  useEffect(() => {
    return () => {
      isTestingVar(false);
    };
  }, []);

  // Change Step
  useEffect(() => {
    if (!step.codeModules) return;
    if (!isEditorReady) return;

    const mods = step.codeModules.reduce(
      (acc, curr) => ({ ...acc, [curr.name as string]: curr.value }),
      {}
    ) as FilesType;

    const diff = Object.keys(mods).reduce((acc, file) => {
      if (!files[file] && !file.includes('spec')) acc.push(file);
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
  }, [step.id, step.codeModules?.length, isEditorReady]);

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
    const handlePassCheckpoint = async (message: {
      data: FromTestRunnerMsgType;
    }) => {
      if (message.data.from !== 'testRunner') return;
      if (message.data.type !== 'test') return;
      // don't pass checkpoint if editting
      if (rest.isEditting) {
        isTestingVar(false);
        return;
      }

      try {
        const result = JSON.parse(message.data.result);

        if (
          result[result.length - 1].status === 'pass' &&
          step.currentCheckpointId
        ) {
          await passCheckpoint({
            variables: { id: step.currentCheckpointId },
          });

          // if it's the last checkpoint also complete it
          if (
            step.checkpoints &&
            step.checkpoints.findIndex(
              ({ id }) => id === step.currentCheckpointId
            ) ===
              step.checkpoints.length - 1
          ) {
            await completeCheckpoint();
          }
        }
        isTestingVar(false);
      } catch (e) {
        console.log(e);
      }
    };

    window.addEventListener('message', handlePassCheckpoint);

    return () => window.removeEventListener('message', handlePassCheckpoint);
  }, [step.currentCheckpointId]);

  const completeCheckpoint = async () => {
    // don't complete checkpoint if editting
    if (rest.isEditting) return;
    if (!step.currentCheckpointId) return;

    const q = {
      query: StepDocument,
      variables: { id: step.id },
    };
    await completeCheckpointM({
      update: (store, { data }) => {
        const stepData = store.readQuery<StepQuery>(q);
        if (!stepData?.step) return;

        // TODO: refactor this
        const nextCheckpointId = stepData?.step?.checkpoints?.find(
          ({ isCompleted }) => !isCompleted
        )?.id;

        store.writeQuery<StepQuery>({
          ...q,
          data: {
            step: {
              ...stepData.step,
              currentCheckpointId:
                nextCheckpointId || stepData.step.currentCheckpointId,
            },
          },
        });
      },
      variables: { id: step.currentCheckpointId },
    });
  };

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
    [step.codeModules]
  );

  const updateDependencies = async () => {
    let dependencyDependencies: { [key in string]: string } = {};

    const dependencies = step.dependencies?.reduce(
      async (acc, { package: pkg, version }) => {
        const res: CodeSandboxV2ResponseI = await fetch(
          `${CS_PKG_URL}/${pkg}/${version}.json`
        ).then((res) => res.json());

        Object.keys(res.contents).map((value) => {
          dependencyDependencies = {
            ...dependencyDependencies,
            [value]: res.contents[value].content,
          };
        });

        return {
          ...(await acc),
          ...dependencyDependencies,
        };
      },
      {}
    );

    setDependencies({
      ...(await dependencies),
    });
  };

  const postMessage = (
    files: FilesType,
    dependencies: FilesType,
    runPath: string,
    value: string,
    isTest?: boolean
  ) => {
    const iframe = isTest
      ? (document.getElementById('test-frame') as HTMLIFrameElement)
      : (document.getElementById('frame') as HTMLIFrameElement);
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
      } as ToPreviewMsgType,
      '*'
    );
  };

  const postCode = useCallback(
    debounce(
      (
        files: FilesType,
        dependencies: FilesType,
        runPath: string,
        value: string
      ) => {
        if (runPath === 'index.html' || runPath === 'styles.css') {
          files[runPath] = value;
          runPath = getMain(files);
          value = files[runPath];
        }

        postMessage(files, dependencies, runPath, value);
      },
      1500
    ),
    []
  );

  const testCode = (
    files: FilesType,
    dependencies: FilesType,
    runPath: string,
    value: string
  ) => {
    isTestingVar(true);
    postMessage(files, dependencies, runPath, value, true);
  };
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

    editorRef.current.addCommand(
      monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.Enter,
      () => {
        submitRef.current.click();
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

  const setupThemes = () => {
    monacoRef.current.editor.defineTheme('GITHUB', GITHUB);
    monacoRef.current.editor.setTheme('GITHUB');
  };

  const setupEditor = () => {
    setupCommands();
    setupCompilerOptions();
    setupDiagnosticsOptions();
    setupTypes();
    setupThemes();

    setIsEditorReady(true);
  };

  const editorDidMount = async (_: any, editor: any) => {
    await getDeps();

    const monacoInstance = await monaco.init();

    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    setupEditor();
  };

  const getMain = (files: FilesType, file?: string) => {
    return (
      file ||
      Object.keys(files).find((file) => file === 'app.tsx') ||
      Object.keys(files).find((file) => file === 'index.html') ||
      Object.keys(files).filter((n) => !n.includes('spec'))[0]
    );
  };

  const goToMain = (files: FilesType, file?: string) => {
    const main = getMain(files, file);

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

  const currentCheck = step.checkpoints?.find(
    ({ id }) => id === step.currentCheckpointId
  );
  const isTested = currentCheck?.isTested || !currentCheck;
  const isStepComplete = !step.checkpoints?.find(
    (checkpoint) => checkpoint.isCompleted === false
  );

  return (
    <div className="w-full lg:h-full flex flex-col relative">
      <div className="h-80 lg:flex-1 flex border border-accent border-t-0 border-b-0 whitespace-nowrap">
        <div className="w-4/12 border-r border-accent">
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
              postCode(files, dependencies, currentPath, value || '');
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
      <div
        className="h-16 flex justify-end px-3 items-center w-full bg-bg-nav border-t border-accent"
        style={{
          position: 'relative',
          top: '-4px',
        }}
      >
        <div aria-label="⌘ + Enter" className="hint--top hint--no-animate">
          <button
            className={`flex items-center justify-center w-20 h-8 py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-white disabled:opacity-50 ${
              isTested
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
            disabled={isTesting}
            onClick={() =>
              isStepComplete
                ? nextStep()
                : isTested
                ? completeCheckpoint()
                : testCode(
                    {
                      ...files,
                      [currentPath]: files[currentPath],
                    },
                    dependencies,
                    currentCheck!.test,
                    files[currentCheck!.test]
                  )
            }
            ref={submitRef}
          >
            {isTesting ? <Spinner /> : isTested ? <>Next</> : <>Test</>}
          </button>
        </div>
      </div>
    </div>
  );
};

type Props = {
  isEditting?: boolean;
  nextStep: () => void;
  step: RegularStepFragment;
};

export default Editor;
