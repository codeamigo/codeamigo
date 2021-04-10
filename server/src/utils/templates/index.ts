export interface ITemplate {
  codeModules: { name: string; value: string }[];
  dependencies: { package: string; version: string }[];
}

export type TemplatesType =
  | "react"
  | "vue"
  | "typescript"
  | "javascript"
  | "html";

const css = `html, body {
  background-color: white;
}`;

const tsTemplate = {
  codeModules: [
    {
      name: "index.html",
      value: `<html>
<body>
</body>

<script src='./app.ts'></script>
</html>`,
    },
    { name: "app.ts", value: "// app.ts" },
  ],
  dependencies: [{ package: "codeamigo-jest-lite", version: "1.0.0-alpha.7" }],
} as ITemplate;

const jsTemplate = {
  codeModules: [
    {
      name: "index.html",
      value: `<html>
<body>
</body>

<script src='./app.js'></script>
</html>`,
    },
    { name: "app.js", value: "// app.js" },
  ],
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

const vueTemplate = {
  codeModules: [
    {
      name: "App.vue",
      value: `<template>
  <div>Hello {{ name }}!</div>
</template>

<script>
  export default {
    data() {
      return {
        name: "Vue",
      };
    },
  };
</script>`,
    },
    {
      name: "index.html",
      value: `<html>

<head>
  <link href='./styles.css' rel='stylesheet' />
</head>

<body>
  <div id='app'></div>
</body>
<script src="./index.ts"></script>

</html>`,
    },
    {
      name: "index.ts",
      value: `import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.mount("#app");`,
    },
    { name: "styles.css", value: css },
  ],
  dependencies: [
    { package: "@vue/test-utils", version: "2.0.0-rc.1" },
    { package: "codeamigo-jest-lite", version: "1.0.0-alpha.7" },
    { package: "vue", version: "3.0.5" },
  ],
} as ITemplate;

export const getTemplate = (template?: TemplatesType) => {
  switch (template) {
    case "react":
      return reactTsxTemplate;
    case "vue":
      return vueTemplate;
    case "typescript":
      return tsTemplate;
    case "javascript":
      return jsTemplate;
    default:
    case "html":
      return htmlTemplate;
  }
};
