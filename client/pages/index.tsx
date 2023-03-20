import {
  FileTabs,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import Editor from '@monaco-editor/react';

function MonacoEditor() {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();

  return (
    <SandpackStack style={{ height: '100vh', margin: 0 }}>
      <FileTabs />
      <Editor
        defaultValue={code}
        height="100%"
        key={sandpack.activeFile}
        language="javascript"
        onChange={(value) => updateCode(value || '')}
        options={{
          fontSize: 16,
          minimap: {
            enabled: false,
          },
          scrollBeyondLastLine: false,
        }}
        theme="vs-dark"
        width="100%"
      />
    </SandpackStack>
  );
}

const Home = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="overflow-hidden rounded-lg border-2 border-gray-700"
        style={{ height: '92%', width: '92%' }}
      >
        <SandpackProvider template="nextjs" theme={'dark'}>
          <SandpackLayout>
            <MonacoEditor />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};

export default Home;
