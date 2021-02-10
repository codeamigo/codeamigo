export interface ITemplate {
  codeModules: { name: string; value: string }[];
  dependencies: { package: string; version: string }[];
}

export type TemplatesType = "react" | "typescript" | "javascript" | "html";

const css = `html, body {
  background-color: white;
}`;

const tsTemplate = {
  codeModules: [{ name: "app.tsx", value: "// app.tsx" }],
  dependencies: [{ package: "codeamigo-jest-lite", version: "1.0.0-alpha.7" }],
} as ITemplate;

const jsTemplate = {
  codeModules: [{ name: "app.js", value: "// app.js" }],
  dependencies: [{ package: "codeamigo-jest-lite", version: "1.0.0-alpha.7" }],
} as ITemplate;

const htmlTemplate = {
  codeModules: [
    {
      name: "index.html",
      value: `<html>

<head>
  <link href='./styles.css' rel='stylesheet' />
</head>

<body>
  <div id='root'>Hello World!</div>
</body>

</html>`,
    },
    {
      name: "styles.css",
      value: css,
    },
  ],
  dependencies: [{ package: "codeamigo-jest-lite", version: "1.0.0-alpha.7" }],
} as ITemplate;

const reactTsxTemplate = {
  codeModules: [
    {
      name: "app.tsx",
      value: `import React from 'react'
import ReactDOM from 'react-dom'

const HelloWorld = (
    <div>
        <h1>Hello, world!</h1>
        <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
);

ReactDOM.render(HelloWorld, document.getElementById('root'));
`,
    },
    {
      name: "index.html",
      value: `<html>

<head>
  <link href='./styles.css' rel='stylesheet' />
</head>

<body>
  <div id='root'></div>
</body>
<script src='./app.tsx'></script>

</html>`,
    },
    { name: "styles.css", value: css },
  ],
  dependencies: [
    { package: "codeamigo-jest-lite", version: "1.0.0-alpha.7" },
    { package: "react-dom", version: "17.0.1" },
    { package: "react", version: "17.0.1" },
  ],
} as ITemplate;

export const getTemplate = (template?: TemplatesType) => {
  switch (template) {
    case "react":
      return reactTsxTemplate;
    case "typescript":
      return tsTemplate;
    case "javascript":
      return jsTemplate;
    default:
    case "html":
      return htmlTemplate;
  }
};
