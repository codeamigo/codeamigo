export interface ITemplate {
  codeModules: { name: string; value: string; isEntry?: boolean }[];
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

const tsTemplate: ITemplate = {
  codeModules: [
    {
      name: "index.html",
      value: `<html>
<body>
</body>

<script src='./app.ts'></script>
</html>`,
    },
    { isEntry: true, name: "app.ts", value: "// app.ts" },
  ],
  dependencies: [],
};

const jsTemplate: ITemplate = {
  codeModules: [
    {
      name: "index.html",
      value: `<html>
<body>
</body>

<script src='./app.js'></script>
</html>`,
    },
    { isEntry: true, name: "app.js", value: "// app.js" },
  ],
  dependencies: [],
};

const htmlTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
      name: "/index.html",
      value: `<html>

<head>
  <link href='/styles.css' rel='stylesheet' />
</head>

<body>
  <div id='root'>Hello World!</div>
</body>

</html>`,
    },
    {
      name: "/styles.css",
      value: css,
    },
    {
      name: "/sandbox.config.json",
      value: `{
  "template": "static"
}
      `,
    },
    {
      name: "/package.json",
      value: `{
  "name": "html",
  "version": "1.0.0",
  "description": "",
  "main": "/index.html",
  "scripts": {
    "start": "serve"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/codesandbox-app/static-template.git"
  },
  "keywords": [],
  "author": "Ives van Hoorne",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/codesandbox-app/static-template/issues"
  },
  "homepage": "https://github.com/codesandbox-app/static-template#readme",
  "devDependencies": {
    "serve": "^11.2.0"
  }
}`,
    },
  ],
  dependencies: [],
};

const reactTsxTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
      name: "/app.tsx",
      value: `import React from 'react'
import ReactDOM from 'react-dom'

import "./styles.css";

const HelloWorld = (
    <div>
        <h1>Hello, world!</h1>
        <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
);

ReactDOM.render(HelloWorld, document.getElementById('root'));
`,
    },
    { name: "/styles.css", value: css },
    {
      name: "/package.json",
      value: `{
  "dependencies": {
    "react": "^17.0.0",
    "react-dom": "^17.0.0",
    "react-scripts": "^4.0.0"
  },
  "main": "/app.tsx",
  "name": "sandpack-project"
}`,
    },
  ],
  dependencies: [
    { package: "react-dom", version: "17.0.1" },
    { package: "react", version: "17.0.1" },
  ],
};

const vueTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
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
    { name: "/styles.css", value: css },
  ],
  dependencies: [
    { package: "@vue/test-utils", version: "2.0.0-rc.1" },
    { package: "vue", version: "3.0.5" },
  ],
};

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
