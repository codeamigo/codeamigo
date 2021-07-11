import { useActiveCode, useSandpack } from '@codesandbox/sandpack-react';
import { ControlledEditor, monaco } from '@monaco-editor/react';
import React, { useEffect, useRef } from 'react';
import { CodeSandboxV1ResponseI } from 'types/codesandbox';

import {
  LessonQuery,
  RegularCodeModuleFragment,
  useMeQuery,
  useUpdateCodeModuleMutation,
} from '👨‍💻generated/graphql';
import {
  camalize,
  getExtension,
  getModelExtension,
} from '👨‍💻widgets/Lesson/EditorV2/utils';

import * as THEMES from '../../../styles/monacoThemes';
const FILE = 'inmemory://model/';
const URN = 'urn:';
const CS_TYPES_URL =
  'https://prod-packager-packages.codesandbox.io/v1/typings/@types';
const CS_TYPES_FALLBACK_URL =
  'https://prod-packager-packages.codesandbox.io/v1/typings';

const EditorV2: React.FC<Props> = ({ codeModules, stepId, ...rest }) => {
  const [updateCodeModule] = useUpdateCodeModuleMutation();
  const { code, updateCode } = useActiveCode();
  const { dispatch, sandpack } = useSandpack();
  const { data: meData } = useMeQuery();

  const pathRef = useRef(sandpack.activePath);
  const editorRef = useRef<any>();
  const monacoRef = useRef<any>();

  useEffect(() => {
    pathRef.current = sandpack.activePath;
  }, [sandpack.activePath]);

  useEffect(() => {
    if (!monacoRef.current) return;
    if (!sandpack.activePath) return;
    const model = monacoRef.current.editor.getModel(
      `${URN}${sandpack.activePath}`
    );
    editorRef.current.setModel(model);
  }, [sandpack.activePath, monacoRef.current, editorRef.current]);

  useEffect(() => {
    if (monacoRef.current) {
      setupTypes();
    }
    // TODO: fix check
  }, [codeModules?.length, monacoRef.current]);

  useEffect(() => {
    dispatch({ type: 'refresh' });
  }, [stepId]);

  const handleCodeUpdate = (newCode: string) => {
    updateCode(newCode);
    // Wait for pathRef to update
    setTimeout(() => {
      const currentModule = codeModules?.find(
        (module) => module.name === pathRef.current
      );

      if (!currentModule) return;

      updateCodeModule({
        variables: {
          id: currentModule.id,
          lessonId: rest.isPreviewing ? rest?.lesson?.id : null,
          name: pathRef.current,
          value: newCode,
        },
      });
    }, 0);
  };

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

        typeRoots: [`${FILE}node_modules/@types`],
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

    // editorRef.current.addCommand(
    //   monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.Enter,
    //   () => {
    //     submitRef.current.click();
    //   }
    // );
  };

  const setupModels = () => {
    codeModules?.map((mod) => {
      monacoRef.current.editor.createModel(
        mod.value,
        getExtension(mod.name || ''),
        `${URN}${mod.name}`
      );
    });

    const model = monacoRef.current.editor.getModel(
      `${URN}${sandpack.activePath}`
    );
    editorRef.current.setModel(model);
  };

  const setupThemes = () => {
    let themeName = meData?.me?.theme || 'idle';
    let theme = THEMES[themeName as keyof typeof THEMES];
    let standardThemeName = themeName.split('_').map(camalize).join('');
    monacoRef.current.editor.defineTheme(standardThemeName, theme);
    monacoRef.current.editor.setTheme(standardThemeName);
  };

  const setupTypes = async () => {
    let deps: CodeSandboxV1ResponseI;
    let pkgJsonString = codeModules?.find((val) => val.name === '/package.json')
      ?.value as string;

    try {
      const pkgJson = JSON.parse(pkgJsonString) as {
        dependencies: { [key in string]: string };
      };
      const dependencies = pkgJson.dependencies;
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
            const uri = `${FILE}node_modules${file}`;

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
    setupModels();
    setupCommands();
    setupCompilerOptions();
    setupDiagnosticsOptions();
    setupThemes();
  };

  const editorDidMount = async (_: any, editor: any) => {
    const monacoInstance = await monaco.init();

    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    setupEditor();
  };

  return (
    <ControlledEditor
      editorDidMount={editorDidMount}
      onChange={(_, value) => {
        handleCodeUpdate(value as string);
      }}
      options={{
        automaticLayout: true,
        fontSize: '12px',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      }}
      width="100%"
    />
  );
};

type Props = {
  codeModules?: RegularCodeModuleFragment[] | null;
  isPreviewing?: boolean;
  lesson: LessonQuery['lesson'];
  stepId?: number;
};

export default EditorV2;
