import { StepExecutionTypeEnum } from "../../entities/Step";

export interface ITemplate {
  codeModules: { name: string; value: string; isEntry?: boolean }[];
  dependencies?: { package: string; version: string }[];
  executionType: keyof typeof StepExecutionTypeEnum;
  lang: string;
}

export type TemplatesType =
  | "angular"
  | "c"
  | "elixir"
  | "go"
  | "html"
  | "java"
  | "javascript"
  | "python"
  | "react"
  | "ruby"
  | "rust"
  | "swift"
  | "typescript"
  | "vue";

const css = `html, body {
  background-color: white;
}`;

const tsTemplate: ITemplate = {
  codeModules: [
    {
      name: "/index.html",
      value: `<html>
<body>
</body>

<script src='./app.ts'></script>
</html>`,
    },
    { isEntry: true, name: "app.ts", value: "// app.ts" },
  ],
  dependencies: [],
  executionType: StepExecutionTypeEnum.sandpack,
  lang: "javascript",
};

const jsTemplate: ITemplate = {
  codeModules: [
    {
      name: "/index.html",
      value: `<html>
<body>
</body>

<script src='./app.js'></script>
</html>`,
    },
    { isEntry: true, name: "/app.js", value: "// app.js" },
  ],
  dependencies: [],
  executionType: StepExecutionTypeEnum.sandpack,
  lang: "javascript",
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
  executionType: StepExecutionTypeEnum.sandpack,
  lang: "javascript",
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
  executionType: StepExecutionTypeEnum.sandpack,
  lang: "javascript",
};

const angularTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
      name: "/src/main.ts",
      value: `import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
`,
    },
    {
      name: "/src/index.html",
      value: `<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Angular</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>

<body>
  <app-root></app-root>
</body>

</html>`,
    },
    {
      name: "/src/polyfills.ts",
      value: `/**
* This file includes polyfills needed by Angular and is loaded before the app.
* You can add your own extra polyfills to this file.
*
* This file is divided into 2 sections:
*   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
*   2. Application imports. Files imported after ZoneJS that should be loaded before your main
*      file.
*
* The current setup is for so-called "evergreen" browsers; the last versions of browsers that
* automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
* Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
*
* Learn more in https://angular.io/docs/ts/latest/guide/browser-support.html
*/

/***************************************************************************************************
* BROWSER POLYFILLS
*/

/** IE9, IE10 and IE11 requires all of the following polyfills. **/
// import 'core-js/es6/symbol';
// import 'core-js/es6/object';
// import 'core-js/es6/function';
// import 'core-js/es6/parse-int';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/number';
// import 'core-js/es6/math';
// import 'core-js/es6/string';
// import 'core-js/es6/date';
// import 'core-js/es6/array';
// import 'core-js/es6/regexp';
// import 'core-js/es6/map';
// import 'core-js/es6/weak-map';
// import 'core-js/es6/set';

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run \`npm install --save classlist.js\`.

/** IE10 and IE11 requires the following for the Reflect API. */
// import 'core-js/es6/reflect';

/** Evergreen browsers require these. **/
// Used for reflect-metadata in JIT. If you use AOT (and only Angular decorators), you can remove.
import "core-js/proposals/reflect-metadata";

/**
* Required to support Web Animations @angular/platform-browser/animations.
* Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
**/
// import 'web-animations-js';  // Run \`npm install --save web-animations-js\`.

/***************************************************************************************************
* Zone JS is required by default for Angular itself.
*/
import "zone.js/dist/zone"; // Included with Angular CLI.

/***************************************************************************************************
* APPLICATION IMPORTS
*/
`,
    },
    {
      name: "/src/styles.css",
      value: `/* You can add global styles to this file, and also import other style files */

html,
body {
  font-family: sans-serif;
}
`,
    },
    {
      name: "/src/typings.d.ts",
      value: `/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
`,
    },
    {
      name: "/.angular-cli.json",
      value: `{
"apps": [
  {
    "root": "src",
    "outDir": "dist",
    "assets": ["assets", "favicon.ico"],
    "index": "index.html",
    "main": "main.ts",
    "polyfills": "polyfills.ts",
    "prefix": "app",
    "styles": ["styles.css"],
    "scripts": [],
    "environmentSource": "environments/environment.ts",
    "environments": {
      "dev": "environments/environment.ts",
      "prod": "environments/environment.prod.ts"
    }
  }
]
}
`,
    },
    {
      name: "/package.json",
      value: `{
"name": "angular",
"version": "0.0.0",
"license": "MIT",
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build --prod",
  "test": "ng test",
  "lint": "ng lint",
  "e2e": "ng e2e"
},
"private": true,
"dependencies": {
  "@angular/animations": "^11.2.0",
  "@angular/common": "^11.2.0",
  "@angular/compiler": "^11.2.0",
  "@angular/core": "^11.2.0",
  "@angular/forms": "^11.2.0",
  "@angular/platform-browser": "^11.2.0",
  "@angular/platform-browser-dynamic": "^11.2.0",
  "@angular/router": "^11.2.0",
  "core-js": "3.8.3",
  "rxjs": "6.6.3",
  "tslib": "2.1.0",
  "zone.js": "0.11.3"
},
"devDependencies": {
  "@angular-devkit/build-angular": "^0.1102.0",
  "@angular/cli": "^11.2.0",
  "@angular/compiler-cli": "^11.2.0",
  "@angular/language-service": "^11.2.0",
  "@types/jasmine": "3.6.3",
  "@types/jasminewd2": "2.0.8",
  "@types/node": "14.14.28",
  "codelyzer": "6.0.1",
  "jasmine-core": "3.6.0",
  "jasmine-spec-reporter": "6.0.0",
  "karma": "6.1.1",
  "karma-chrome-launcher": "3.1.0",
  "karma-coverage-istanbul-reporter": "3.0.3",
  "karma-jasmine": "4.0.1",
  "karma-jasmine-html-reporter": "1.5.4",
  "protractor": "7.0.0",
  "ts-node": "9.1.1",
  "tslint": "~6.1.3",
  "typescript": "4.1.5"
},
"keywords": ["angular", "starter"],
"description": "Angular example starter project"
}
`,
    },
    {
      name: "/tsconfig.json",
      value: `{
"compileOnSave": false,
"compilerOptions": {
  "baseUrl": "./",
  "outDir": "./dist/out-tsc",
  "sourceMap": true,
  "declaration": false,
  "downlevelIteration": true,
  "experimentalDecorators": true,
  "moduleResolution": "node",
  "importHelpers": true,
  "target": "es2015",
  "module": "es2020",
  "lib": [
    "es2018",
    "dom"
  ]
}
}`,
    },
    {
      name: "/src/app/app.component.css",
      value: `div {
  text-align: center;
}`,
    },
    {
      name: "/src/app/app.component.html",
      value: `<!--The content below is only a placeholder and can be replaced.-->
<div>
  <h1>
    Welcome to {{ title }}!
  </h1>
  <img
    width="300"
    alt="Angular Logo"
    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg=="
  />
</div>
`,
    },
    {
      name: "/src/app/app.component.ts",
      value: `import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "CodeSandbox";
}
`,
    },
    {
      name: "/src/app/app.module.ts",
      value: `import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
`,
    },
    {
      name: "/src/environments/environment.prod.ts",
      value: `export const environment = {
  production: true
};
`,
    },
    {
      name: "/src/environments/environment.ts",
      value: `// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses \`environment.ts\`, but if you do
// \`ng build --env=prod\` then \`environment.prod.ts\` will be used instead.
// The list of which env maps to which file can be found in \`.angular-cli.json\`.

export const environment = {
  production: false
};
`,
    },
  ],
  executionType: StepExecutionTypeEnum.sandpack,
  lang: "javascript",
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
  executionType: StepExecutionTypeEnum.sandpack,
  lang: "javascript",
};

const cTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
      name: "/main.c",
      value: `#include <stdio.h>

int main() {
  printf("Hello, world!\n");
  return 0;
}
`,
    },
  ],
  executionType: StepExecutionTypeEnum.riju,
  lang: "c",
};

const elixirTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
      name: "/main.exs",
      value: 'IO.puts("Hello, world!")',
    },
  ],
  executionType: StepExecutionTypeEnum.riju,
  lang: "elixir",
};

const goTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
      name: "/main.go",
      value: `package main

import "fmt"

func main() {
  fmt.Println("Hello, world!")
}
`,
    },
  ],
  executionType: StepExecutionTypeEnum.riju,
  lang: "go",
};

const javaTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
      name: "/main.java",
      value: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, world!");
  }
}
    
`,
    },
  ],
  executionType: StepExecutionTypeEnum.riju,
  lang: "java",
};

const pythonTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
      name: "/main.py",
      value: 'print("Hello, world!")',
    },
  ],
  executionType: StepExecutionTypeEnum.riju,
  lang: "python",
};

const rubyTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
      name: "/main.rb",
      value: 'puts "Hello, world!"',
    },
  ],
  executionType: StepExecutionTypeEnum.riju,
  lang: "ruby",
};

const rustTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
      name: "/main.rs",
      value: `fn main() {
  println!("Hello, world!");
}
`,
    },
  ],
  executionType: StepExecutionTypeEnum.riju,
  lang: "rust",
};

const swiftTemplate: ITemplate = {
  codeModules: [
    {
      isEntry: true,
      name: "/main.swift",
      value: `print("Hello, world!")`,
    },
  ],
  executionType: StepExecutionTypeEnum.riju,
  lang: "swift",
};

export const getTemplate = (template?: TemplatesType) => {
  switch (template) {
    case "html":
    case undefined:
      return htmlTemplate;
    case "angular":
      return angularTemplate;
    case "c":
      return cTemplate;
    case "elixir":
      return elixirTemplate;
    case "go":
      return goTemplate;
    case "java":
      return javaTemplate;
    case "javascript":
      return jsTemplate;
    case "python":
      return pythonTemplate;
    case "react":
      return reactTsxTemplate;
    case "ruby":
      return rubyTemplate;
    case "rust":
      return rustTemplate;
    case "swift":
      return swiftTemplate;
    case "typescript":
      return tsTemplate;
    case "vue":
      return vueTemplate;
  }
};
