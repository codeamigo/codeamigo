export interface ITemplate {
  codeModules: { name: string; value: string }[];
  dependencies: { package: string; version: string }[];
}

export type TemplatesType = "react" | "typescript" | "javascript" | "html";

const tsTemplate = {
  codeModules: [{ name: "app.tsx", value: "" }],
  dependencies: [{ package: "codeamigo-jest-lite", version: "1.0.0-alpha.7" }],
} as ITemplate;

const jsTemplate = {
  codeModules: [{ name: "app.js", value: "" }],
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
      value: "<div id='root'></div>",
    },
  ],
  dependencies: [
    { package: "codeamigo-jest-lite", version: "1.0.0-alpha.7" },
    { package: "react-dom", version: "17.0.1" },
    { package: "react", version: "17.0.1" },
  ],
} as ITemplate;

export const getTemplate = (template: TemplatesType) => {
  switch (template) {
    case "react":
      return reactTsxTemplate;
    case "typescript":
      return tsTemplate;
    case "javascript":
      return jsTemplate;
    default:
    case "html":
      return jsTemplate;
  }
};
