import {
  CodeEditor,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';

import Button from '👨‍💻components/Button';
import {
  LessonQuery,
  RegularCodeModuleFragment,
  useUpdateCodeModuleMutation,
} from '👨‍💻generated/graphql';

const EditorV2: React.FC<Props> = ({ codeModules, ...rest }) => {
  const [updateCodeModule] = useUpdateCodeModuleMutation();
  const { code, updateCode } = useActiveCode();
  const { dispatch, sandpack } = useSandpack();
  const pathRef = useRef(sandpack.activePath);

  useEffect(() => {
    pathRef.current = sandpack.activePath;
  }, [sandpack.activePath]);

  useEffect(() => {
    window.addEventListener('message', (ev) => {
      console.log(ev);
    });
  }, []);

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

  return (
    <div className="sm:w-1/3">
      {/* @ts-ignore */}
      <Button onClick={() => dispatch({ type: 'run-all-tests' })}>
        Run Tests
      </Button>
      {sandpack.activePath}
      <CodeEditor code={code} onCodeUpdate={handleCodeUpdate} />
    </div>
  );
};

type Props = {
  codeModules?: RegularCodeModuleFragment[] | null;
  isPreviewing?: boolean;
  lesson: LessonQuery['lesson'];
};

export default EditorV2;
