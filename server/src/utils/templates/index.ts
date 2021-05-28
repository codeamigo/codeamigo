export interface ITemplate {
  codeModules: { name: string; value: string; isEntry?: boolean }[];
  dependencies?: { package: string; version: string }[];
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
};

const vueTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
      name: "/src/App.vue",
      value: `<template>
  <div id="app">
    <HelloWorld msg="Hello Vue in CodeSandbox!"/>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: {
    HelloWorld
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
`,
    },
    {
      name: "/public/index.html",
      value: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
      <title>codesandbox</title>
    </head>
    <body>
      <noscript>
        <strong
          >We're sorry but codesandbox doesn't work properly without JavaScript
          enabled. Please enable it to continue.</strong
        >
      </noscript>
      <div id="app"></div>
      <!-- built files will be auto injected -->
    </body>
  </html>
  `,
    },
    {
      name: "/src/main.js",
      value: `import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
`,
    },
    {
      name: "/src/components/HelloWorld.vue",
      value: `<template>
<div class="hello">
  <h1>{{ msg }}</h1>
  <h3>Installed CLI Plugins</h3>
  <ul>
    <li>
      <a
        href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
        target="_blank"
        rel="noopener"
      >babel</a>
    </li>
    <li>
      <a
        href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
        target="_blank"
        rel="noopener"
      >eslint</a>
    </li>
  </ul>
  <h3>Essential Links</h3>
  <ul>
    <li>
      <a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
    </li>
    <li>
      <a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a>
    </li>
    <li>
      <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a>
    </li>
    <li>
      <a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a>
    </li>
    <li>
      <a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a>
    </li>
  </ul>
  <h3>Ecosystem</h3>
  <ul>
    <li>
      <a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a>
    </li>
    <li>
      <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
    </li>
    <li>
      <a
        href="https://github.com/vuejs/vue-devtools#vue-devtools"
        target="_blank"
        rel="noopener"
      >vue-devtools</a>
    </li>
    <li>
      <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a>
    </li>
    <li>
      <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a>
    </li>
  </ul>
</div>
</template>

<script>
export default {
name: "HelloWorld",
props: {
  msg: String
}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
margin: 40px 0 0;
}
ul {
list-style-type: none;
padding: 0;
}
li {
display: inline-block;
margin: 0 10px;
}
a {
color: #42b983;
}
</style>
`,
    },
    {
      name: "/package.json",
      value: `{
  "name": "vue",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "@vue/cli-plugin-babel": "4.1.1",
    "vue": "^2.6.11"
  },
  "devDependencies": {
    "@vue/cli-plugin-eslint": "4.1.1",
    "@vue/cli-service": "4.1.1",
    "babel-eslint": "^10.0.3",
    "eslint": "^6.7.2",
    "eslint-plugin-vue": "^6.0.1",
    "vue-template-compiler": "^2.6.11"
  },
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/essential",
      "eslint:recommended"
    ],
    "rules": {},
    "parserOptions": {
      "parser": "babel-eslint"
    }
  },
  "postcss": {
    "plugins": {
      "autoprefixer": {}
    }
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ],
  "keywords": [
    "vue",
    "vuejs",
    "starter"
  ],
  "description": "Vue.js example starter project"
}`,
    },
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
