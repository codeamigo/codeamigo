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

import PrevNext from '👨‍💻widgets/PrevNext';

const steps = [
  {
    files: {
      '/next.config.js': {
        code: "/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  reactStrictMode: true,\n  swcMinify: true,\n}\n\nmodule.exports = nextConfig\n",
      },
      '/package.json': {
        code: '{\n  "name": "my-app",\n  "version": "0.1.0",\n  "private": true,\n  "scripts": {\n    "dev": "NEXT_TELEMETRY_DISABLED=1 next dev",\n    "build": "next build",\n    "start": "next start",\n    "lint": "next lint"\n  },\n  "dependencies": {\n    "next": "12.1.6",\n    "react": "18.2.0",\n    "react-dom": "18.2.0",\n    "@next/swc-wasm-nodejs": "12.1.6"\n  },\n  "devDependencies": {}\n}',
      },
      '/pages/_app.js': {
        code: "import '../styles.css'\n\nexport default function MyApp({ Component, pageProps }) {\n  return <Component {...pageProps} />\n}",
      },
      '/pages/index.js': {
        code: 'export default function Foods({ data }) {\n  return (\n    <div>\n      <h1>I eat {data}</h1>\n    </div>\n  );\n}\n  \nexport function getServerSideProps() {\n  return {\n    props: { data: "" },\n  }\n}\n',
      },
      '/styles.css': {
        code: 'body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}',
      },
    },
    prompt: `export default function Foods({ data }) {
      return (
        <div>
          <h1>I eat {data}</h1>
        </div>
      );
    }
      
    export function getServerSideProps() {
      return {
        props: { data: "[insert]" },
      }
    }
    `,
  },
];

function MonacoEditor() {
  const { code, updateCode, ...rest } = useActiveCode();
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
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-5">
      <div
        className="overflow-hidden rounded-lg border-2 border-gray-700"
        style={{ height: '100%', width: '92%' }}
      >
        <SandpackProvider
          files={steps[0].files}
          template="nextjs"
          theme={'dark'}
        >
          <SandpackLayout>
            <MonacoEditor />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      </div>
      <PrevNext />
    </div>
  );
};

export default Home;
