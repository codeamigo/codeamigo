import {
  CodeEditor,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import React from 'react';

const EditorV2: React.FC<Props> = () => {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const { activePath, files } = sandpack;

  const handleCodeChange = (code: string) => {
    updateCode(code);
    console.log(activePath, code);
  };

  return <CodeEditor code={code} onCodeUpdate={handleCodeChange} />;
};

type Props = {};

export default EditorV2;
