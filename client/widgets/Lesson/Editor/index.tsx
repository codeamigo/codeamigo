import MonacoEditor from '@monaco-editor/react';
import React, { useEffect, useRef } from 'react';
import { DEFAULT_THEME } from 'styles/appThemes';
import { CodeSandboxV1ResponseI } from 'types/codesandbox';

import {
  LessonQuery,
  RegularCheckpointFragment,
  RegularCodeModuleFragment,
  useMeQuery,
  useUpdateCodeModuleMutation,
} from '👨‍💻generated/graphql';
import { CodeSandboxTestMsgType } from '👨‍💻widgets/Lesson/Console/Tests/types';

import * as THEMES from '../../../styles/monacoThemes';
import { camalize, getLanguage } from './utils';
const URN = 'urn:';
const CS_TYPES_URL =
  'https://prod-packager-packages.codesandbox.io/v1/typings/@types';
const CS_TYPES_FALLBACK_URL =
  'https://prod-packager-packages.codesandbox.io/v1/typings';

const Editor: React.FC<Props> = ({
  activeFile,
  codeModules,
  isEditing,
  isPreviewing,
  lesson,
  refreshPreview,
  runCode,
  sessionId,
  stepId,
  testCode,
  updateCode,
  ...rest
}) => {
  const [updateCodeModule] = useUpdateCodeModuleMutation({
    errorPolicy: isPreviewing ? 'ignore' : 'all',
  });
  const { data: meData } = useMeQuery();

  const pathRef = useRef(activeFile);
  const editorRef = useRef<any>();
  const monacoRef = useRef<any>();

  useEffect(() => {
    pathRef.current = activeFile;
  }, [activeFile]);

  useEffect(() => {
    if (!monacoRef.current) return;
    if (!editorRef.current) return;
    if (!activeFile) return;
    const model = monacoRef.current.editor.getModel(
      monacoRef.current.Uri.parse(`${URN}${activeFile}`)
    );
    if (model) editorRef.current.setModel(model);
  }, [activeFile, monacoRef.current, editorRef.current]);

  // When step changes reinit models
  // and focus editor
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor
        .getModels()
        .forEach((model: any) => model.dispose());
      setupModels();
    }

    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [stepId]);

  // When file added add to models
  useEffect(() => {
    if (monacoRef.current && editorRef.current && activeFile) {
      setupModels();
    }
  }, [codeModules?.length, monacoRef.current, editorRef.current, activeFile]);

  // When regex is searched
  useEffect(() => {
    const handleSearch = (ev: MessageEvent<any>) => {
      if (!ev.data.regex) return;
      try {
        if (editorRef.current) {
          const controller = editorRef.current.getContribution(
            'editor.contrib.findController'
          );
          if (!controller.getState()._isRegex) {
            controller.toggleRegex();
          }
          const match = editorRef.current
            .getModel()
            .findMatches(ev.data.regex)[0];
          const range = match?.range;
          editorRef.current.setSelection(range);
          editorRef.current.getAction('actions.findWithSelection').run();
        }
      } catch (e) {
        console.log(e);
        console.log(`Error searching: ${e}`);
      }
    };

    window.addEventListener('message', handleSearch);
  }, []);

  // When match regex test is run
  useEffect(() => {
    const handleMatchRegexTest = (
      ev: MessageEvent<{ checkpoint: RegularCheckpointFragment; event: string }>
    ) => {
      if (!ev.data.event) return;
      if (ev.data.event !== 'runMatchTest') return;

      const checkpoint = ev.data.checkpoint;

      const model = monacoRef.current?.editor.getModel(
        monacoRef.current.Uri.parse(
          `${URN}${ev.data.checkpoint.fileToMatchRegex}`
        )
      );

      const match =
        model?.getValue().includes(checkpoint.matchRegex) ||
        model?.getValue()?.match(checkpoint.matchRegex);

      setTimeout(() => {
        window.postMessage(
          {
            event: 'total_test_start',
            type: 'test',
          },
          '*'
        );

        window.postMessage(
          {
            $id: 0,
            codesandbox: true,
            event: 'test_end',
            test: {
              blocks: ['File', ev.data.checkpoint.fileToMatchRegex],
              duration: 1,
              errors: [],
              name: match
                ? 'includes the correct value(s)!'
                : `does not include the correct value.`,
              path: '',
              status: match ? 'pass' : 'fail',
            },
            type: 'test',
          } as CodeSandboxTestMsgType,
          '*'
        );

        window.postMessage(
          {
            event: 'total_test_end',
            type: 'test',
          },
          '*'
        );
      }, 1200);
    };

    window.addEventListener('message', handleMatchRegexTest);
  }, []);

  useEffect(() => {
    if (monacoRef.current && rest.isTyped) {
      setupTypes();
    }
  }, [codeModules?.length, monacoRef.current]);

  useEffect(() => {
    refreshPreview && refreshPreview();
  }, [stepId]);

  const handleCodeUpdate = async (newCode?: string, _?: any) => {
    if (!newCode) return;
    updateCode && updateCode(newCode);
    // Wait for pathRef to update
    setTimeout(() => {
      const currentModule = codeModules?.find(
        (module) => module.name === pathRef.current
      );
      
      if (!currentModule) return;

      updateCodeModule({
        variables: {
          lessonId: isEditing ? lesson?.id : null,
          name: pathRef.current,
          sessionId,
          uuid: currentModule.uuid,
          value: newCode,
        },
      });
    }, 0);

    const choices = await fetch(process.env.NEXT_PUBLIC_API_URL + '/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: newCode,
      }),
    }).then((res) => res.json());

    console.log(choices)
  };

  const setupCompilerOptions = () => {
    const jsxFactory = 'React.createElement';
    const reactNamespace = 'React';
    const hasNativeTypescript = false;

    monacoRef.current.languages.typescript.javascriptDefaults.setEagerModelSync(
      true
    );

    const tsConfig = codeModules?.find((module) => module.name === '/tsconfig.json')
    const compilerOptions = tsConfig ? JSON.parse(tsConfig?.value || '') : undefined

    // https://github.com/codesandbox/codesandbox-client/blob/master/packages/app/src/embed/components/Content/Monaco/index.js
    monacoRef.current.languages.typescript.typescriptDefaults.setCompilerOptions(
      {
        allowJs: true,
        allowNonTsExtensions: !hasNativeTypescript,
        experimentalDecorators: true,
        jsx: compilerOptions ? compilerOptions.jsx : monacoRef.current.languages.typescript.JsxEmit.React,
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

        typeRoots: [`node_modules/@types`],
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
      monacoRef.current.KeyMod.CtrlCmd |
        monacoRef.current.KeyMod.Shift |
        monacoRef.current.KeyCode.KEY_P,
      () => {
        editorRef.current.getAction('editor.action.quickCommand').run();
      }
    );

    editorRef.current.addCommand(
      monacoRef.current.KeyMod.Option |
        monacoRef.current.KeyMod.CtrlCmd |
        monacoRef.current.KeyCode.Enter,
      testCode
    );

    editorRef.current.addCommand(
      monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.Enter,
      runCode
    );
  };

  const setupModels = () => {
    codeModules?.forEach((mod) => {
      const model = monacoRef.current.editor.getModel(
        monacoRef.current.Uri.parse(`${URN}${mod.name}`)
      );
      if (model) return;
      monacoRef.current.editor.createModel(
        mod.value,
        getLanguage(mod.name || ''),
        monacoRef.current.Uri.parse(`${URN}${mod.name}`)
      );
    });
    const model = monacoRef.current.editor.getModel(
      monacoRef.current.Uri.parse(`${URN}${activeFile}`)
    );
    model?.updateOptions({ tabSize: 2 });
    editorRef.current.setModel(model);
  };

  const setupThemes = () => {
    let themeName = meData?.me?.theme || DEFAULT_THEME;
    let theme = THEMES[themeName as keyof typeof THEMES];
    let standardThemeName = themeName.split('_').map(camalize).join('');
    monacoRef.current.editor.defineTheme(standardThemeName, theme);
    monacoRef.current.editor.setTheme(standardThemeName);
  };

  const setupTypes = async () => {
    let deps: CodeSandboxV1ResponseI;
    let pkgJsonString = codeModules?.find(
      (val) => val.name === '/package.json' || val.name === 'package.json'
    )?.value as string;

    try {
      const pkgJson = JSON.parse(pkgJsonString) as {
        dependencies?: { [key in string]: string };
        devDependencies?: { [key in string]: string };
      };
      const dependencies = {
        ...pkgJson.dependencies,
        ...pkgJson.devDependencies,
      };
      if (!dependencies) return;
      Object.keys(dependencies).map(async (dep) => {
        try {
          const initial = await fetch(
            `${CS_TYPES_URL}/${dep}/${dependencies[dep]}.json`
          );
          deps = await initial.json();
        } catch (e) {
          try {
            const fallback = await fetch(
              `${CS_TYPES_FALLBACK_URL}/${dep}/${dependencies[dep]}.json`
            );
            deps = await fallback.json();
          } catch (e) {
            console.error(e);
          }
        }

        try {
          Object.keys(deps.files).map((file) => {
            const code = deps.files[file].module.code;
            const uri = `node_modules${file}`;

            monacoRef.current.languages.typescript.typescriptDefaults.addExtraLib(
              code,
              uri
            );
          });
        } catch (e) {
          console.error(e);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const setupEditor = () => {
    setupCommands();
    setupCompilerOptions();
    setupThemes();
    setupModels();
  };

  const editorDidMount = async (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    setupEditor();
  };

  return (
    <MonacoEditor
      defaultLanguage="typescript"
      loading={
        <div className="flex justify-center items-center w-full h-full font-bold text-white bg-bg-primary">
          Loading...
        </div>
      }
      onChange={handleCodeUpdate}
      onMount={editorDidMount}
      options={{
        automaticLayout: true,
        fontSize: '14px',
        fontWeight: 600,
        lineNumbersMinChars: 3,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      }}
      width="100%"
    />
  );
};

type Props = {
  activeFile: string;
  codeModules?: RegularCodeModuleFragment[] | null;
  isEditing?: boolean;
  isPreviewing?: boolean;
  isTyped?: boolean;
  lesson: LessonQuery['lesson'];
  refreshPreview?: () => void;
  runCode: () => void;
  sessionId?: number;
  stepId?: number;
  testCode: () => void;
  updateCode?: (newCode: string) => void;
};

export default Editor;
