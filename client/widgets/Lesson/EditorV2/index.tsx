import {
  CodeEditor,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import React, { useEffect } from 'react';

import Button from '👨‍💻components/Button';

const EditorV2: React.FC<Props> = () => {
  const { code, updateCode } = useActiveCode();
  const { dispatch, sandpack } = useSandpack();
  const { activePath, files } = sandpack;

  const handleCodeChange = (code: string) => {
    updateCode(code);
    console.log(activePath, code);
  };

  useEffect(() => {
    window.addEventListener('message', (ev) => {
      console.log(ev);
    });
  }, []);

  return (
    <div>
      {/* @ts-ignore */}
      <Button onClick={() => dispatch({ type: 'run-all-tests' })}>
        Run Tests
      </Button>
      <CodeEditor code={code} onCodeUpdate={handleCodeChange} />
    </div>
  );
};

type Props = {};

export default EditorV2;
