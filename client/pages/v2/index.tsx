import {
  FileTabs,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackStack,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import Editor from '@monaco-editor/react';
import { Form, Formik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import debounce from 'utils/debounce';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import { getLanguage, getModelExtension } from '👨‍💻widgets/Lesson/Editor/utils';
import StepActions from '👨‍💻widgets/StepActions';

import * as hal from '../../assets/hal.png';

const URN = 'urn:';

const transition = { bounce: 0.4, duration: 0.8, type: 'spring' };

const defaultLeftPanelHeight = {
  editor: 'calc(100% - 18rem)',
  instructions: '18rem',
};

const defaultQuestions = [
  'What is this code doing?',
  "Why isn't my code accepted?",
];

export type Step = {
  checkpoints: {
    message: string;
    passed: boolean;
    test: RegExp;
  }[];
  files: {
    [key: string]: {
      code: string;
    };
  };
  instructions: string;
  questions: string[];
  start: string;
  title: string;
};

const steps: Step[] = [
  {
    checkpoints: [
      {
        message: 'Add a comment to the code below.',
        passed: false,
        test: /\/\/\s*[\w\s]+/,
      },
    ],
    files: {
      '/index.js': {
        code: '',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      "## Comments \n\n JavaScript is used to create dynamic and interactive web pages, and is an essential skill for anyone interested in web development. \n\n Before we dive into the code, let's start with the basics. One important aspect of programming is adding comments to your code. Comments are used to provide context and explanation for your code, and are not executed by the computer. They are a helpful tool for you and other developers who may read your code in the future.\n\nTo add a comment in JavaScript, simply start your comment with '//' (double forward slashes). Anything after those slashes will be ignored by the computer. For example: \n\n ```// This is a comment```",
    questions: [...defaultQuestions, 'When do I use comments?'],
    start: '',
    title: 'Comments',
  },
  {
    checkpoints: [
      {
        message: 'Log a message to the console.',
        passed: false,
        test: /console\.log\(\s*['"`].*['"`]\s*\)/,
      },
    ],
    files: {
      '/index.js': {
        code: '// This is a comment\n',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      '## console.log \n\n In JavaScript, console.log() is a method that allows you to output information to the console, which can be a helpful tool for debugging and testing your code. We\'ll be using console.log a lot so let\'s get us to it now! \n\n To use console.log(), simply type `console.log()` followed by the message you want to log. For example: \n\n ```console.log("Hello world!")```',
    questions: [
      ...defaultQuestions,
      'What is the console?',
      'What is a method?',
    ],
    start: 'This is a comment\n',
    title: 'console.log',
  },
  {
    checkpoints: [],
    files: {
      '/index.js': {
        code: '// This is a comment\nconsole.log("Hello world!")\nconst name = "John"\nconst myNumber = 42\nconst isCool = true\nconst myArray = [1, 2, 3]\nconst myObject = { name: "John", age: 30 }\nconst myFunction = function() {}\nconst myNull = null\nconst myUndefined = undefined\nconst myNaN = NaN\n',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      '## Intro to Data Types \n\n Great, the next step in our JavaScript course is all about data types! In programming, data types are used to define the kind of data that a variable can hold. JavaScript has several built-in data types, including:\n\n - `numbers` (e.g. `42`, `3.14`)\n\n - `strings` (e.g. `"Hello world!"`)\n\n - `booleans` (e.g. `true`, `false`)\n\n - `arrays` (e.g. `[1, 2, 3]`)\n\n - `objects` (e.g. `{ name: "John", age: 30 }`)\n\n - `functions` (e.g. `function myFunction() {}`)\n\n - `null` (e.g. `null`)\n\n - `undefined` (e.g. `undefined`)\n\n - `NaN` (e.g. `NaN`)',
    questions: [
      ...defaultQuestions,
      'What is a data type?',
      'Why are data types important?',
    ],
    start: 'Hello world!")\n',
    title: 'Intro to Data Types',
  },
  {
    checkpoints: [
      {
        message:
          'Declare a const variable called `myNumber` and assign it the value `42`.',
        passed: false,
        test: /const\s+myNumber\s*=\s*42\s*/,
      },
      {
        message:
          'Declare a let variable called `myString` and assign it the value `"Hello world!"`.',
        passed: false,
        test: /let\s+myString\s*=\s*['"`]Hello world!['"`]\s*/i,
      },
    ],
    files: {
      '/index.js': {
        code: '// This is a comment\nconsole.log("Hello world!")\n',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      "## Variables \n\nIn JavaScript, variables are used to store and manipulate data. There are three different ways to declare a variable in JavaScript: let, var, and const. \n\nLet's start with const. The const keyword is used to declare a variable that cannot be reassigned. For example: \n\n```const myNumber = 42``` \n\nIf you try to reassign a const variable, you will get an error. For example: \n\n```const myNumber = 42\nmyNumber = 99 // Error: Assignment to constant variable.\n``` \n\nThe let keyword is used to declare a variable that can be reassigned. For example: \n\n```let myNumber = 42\nmyNumber = 99 // No error\n``` \n\nThe var keyword is used to declare a variable that can be reassigned, but has some different behaviors than let. We won't be using var in this course, so feel free to ignore it for now. \n\n",
    questions: [
      ...defaultQuestions,
      'What is a variable?',
      'Why are variables important?',
    ],
    start: 'Hello world!")\n',
    title: 'Variables',
  },
  {
    checkpoints: [
      {
        message: 'console.log the value of remainder.',
        passed: false,
        test: /console\.log\(\s*remainder\s*\)/,
      },
      {
        message: 'console.log the value of exponent.',
        passed: false,
        test: /console\.log\(\s*exponent\s*\)/,
      },
    ],
    files: {
      '/index.js': {
        code: '// This is a comment\nconsole.log("Hello world!")\nconst myNumber = 42\nconst myString = "Hello world!"\nconst difference = 100 - 50\nconst product = 100 * 2\nconst quotient = 100 / 2\nconst remainder = 100 % 3\nconst exponent = 2 ** 3\n',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      '## Arithmetic Operators \n\nIn JavaScript, arithmetic operators are used to perform mathematical calculations on numerical values. There are several different arithmetic operators in JavaScript, including:\n\n - `+` (addition)\n\n - `-` (subtraction)\n\n - `*` (multiplication)\n\n - `/` (division)\n\n - `%` (modulus)\n\n - `**` (exponentiation)\n\n',
    questions: [
      ...defaultQuestions,
      'What is modulus?',
      'What is exponentiation?',
      'Do I have to be good at math to learn JavaScript?',
    ],
    start: 'const exponent = 2 ** 3\n',
    title: 'Arithmetic Operators',
  },
  {
    checkpoints: [
      {
        message:
          'Create a new object called `dog` with the following properties:\n\n name, age, favoriteFood, favoriteToy. Console.log the value of `dog`.',
        passed: false,
        // console.log the value of dog
        test: /console\.log\(\s*dog\s*\)/,
      },
    ],
    files: {
      '/index.js': {
        code: 'let person = {\n  name: "John",\n  age: 30,\n  email: "john@example.com"\n};\n\nconsole.log(person.name);\nconsole.log(person.age);\nconsole.log(person.email);\n',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      '## Properties\n\nIn JavaScript, properties are used to store values or other properties inside objects. An object is a collection of key-value pairs, where each key is a property name and each value is the corresponding property value.\n\n',
    questions: [...defaultQuestions, 'Why is it called an object?'],
    start: 'console.log(person.email);\n',
    title: 'Properties',
  },
  {
    checkpoints: [
      {
        message:
          'Add a method to `dog` called bark that returns "Woof!". Then, run dog.bark();',
        passed: false,
        // dog.bark();
        test: /dog\.bark\(\s*\)/,
      },
    ],
    files: {
      '/index.js': {
        code: 'let person = {\n  name: "John",\n  age: 30,\n  email: "john@example.com",\n  sayHello: function() {\n    console.log("Hello, my name is " + this.name + "!");\n  }\n};\n\nperson.sayHello();\n\nlet dog = {\n  name: "Buddy",\n  breed: "Golden Retriever",\n  age: 5\n};',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      "## Methods\n\nIn JavaScript, methods are functions that are stored as properties inside objects. Methods are used to perform actions on an object. For example, you can use a method to change the value of a property or access the value of a property on the object.\n\nTo call a method write the method name and add paranthesis at the end.\n\nHere's an example of how you can create an object with a method and use it in JavaScript:\n\n```\nlet person = {\n  name: 'John',\n  age: 30,\n  email: 'john@example.com',\n  sayHello: function() {\n    console.log('Hello, my name is ' + this.name + '!');\n  }\n};\n\nconsole.log(person.sayHello())\n```",
    questions: [...defaultQuestions, 'When do I use methods?'],
    start: '\n  age: 5\n};',
    title: 'Methods',
  },
  {
    checkpoints: [
      {
        message: 'Call toUpperCase() on the variable `greeting`.',
        passed: false,
        test: /\s*myString\.toUpperCase()/,
      },
    ],
    files: {
      '/index.js': {
        code: 'let greeting = "hello";\nconsole.log(greeting.toUpperCase());\n',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      '## Built-in Methods\n\nJavaScript comes with a number of built-in methods that can be used to perform common tasks. For example, you can use the `toUpperCase()` method to convert a string to uppercase letters.\n\n```\nlet greeting = "hello";\nconsole.log(greeting.toUpperCase());\n// Output: HELLO\n```\n\n',
    questions: [...defaultQuestions, 'What are built-in methods?'],
    start: 'let greeting = "hello";\n',
    title: 'Built-in Methods',
  },
  {
    checkpoints: [
      {
        message: 'Change y so that it is greater than x.',
        passed: false,
        // match all numbers greater than 100
        test: /const y \= (1\d{2}|[2-9]\d{2,})/,
      },
    ],
    files: {
      '/index.js': {
        code: 'const x = 100;\nconst y = 50;\n\nif (x > y) {\n  console.log("x is greater than y");\n} else {\n  console.log("x is less than or equal to y");\n}\n',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      '## Conditionals\n\nIn JavaScript, conditional statements are used to execute different blocks of code depending on whether a condition is true or false. The basic structure of a conditional statement is:\n\n```\nif (condition) {\n  // code to run if condition is true\n} else {\n  // code to run if condition is false\n}\n```\n\nIn this structure, the `if` keyword is followed by a set of parentheses containing the condition to be tested. If the condition is true, the code inside the curly braces following the `if` statement is executed. If the condition is false, the code inside the curly braces following the `else` statement is executed.',
    questions: [
      ...defaultQuestions,
      'When do I use if statements?',
      'What is an else statement?',
    ],
    start: 'const y = ',
    title: 'Conditionals',
  },
  {
    checkpoints: [],
    files: {
      '/index.js': {
        code: 'const x = 1;\nconst y = 50;\nconst z = 10\n\nif (x > y) {\n  console.log("x is greater than y");\n} else if (x > z) {\n  console.log("x is greater than z");\n} else {\n  console.log("x is less than or equal to y or z")\n}\n',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      '## Conditionals - Part 2\n\nYou can also use an else if statement to test additional conditions, like this:\n```\nif (condition1) {\n  // code to execute if condition1 is true\n} else if (condition2) {\n  // code to execute if condition1 is false and condition2 is true\n} else {\n  // code to execute if both condition1 and condition2 are false\n}\n```',
    questions: [...defaultQuestions, 'When do I use an else if statement?'],
    start: '',
    title: 'Conditionals - Part 2',
  },
  {
    checkpoints: [
      {
        message:
          'Return the product of the two numbers passed to the function. Assign the result to a variable called `result`.',
        passed: false,
        test: /const result = multiply\(\s*\w+\s*,\s*\w+\s*\)/,
      },
    ],
    files: {
      '/index.js': {
        code: 'function multiply(a, b) {\n  // your code here\n}\n\n// call multiply here\n',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      '## Functions\n\nFunctions are like recipes in JavaScript. They tell the computer what to do when you call them by name. To define a function, use the `function` keyword followed by the function name and any parameters it takes. To call a function, use its name followed by any arguments it needs. Functions can return values using the return keyword.',
    questions: [...defaultQuestions, 'Write a poem about functions.'],
    start: '',
    title: 'Functions',
  },
  {
    checkpoints: [],
    files: {
      '/index.js': {
        code: '// Create an array called "fruits"\nlet fruits = ["apple", "orange", "pear"];\n\n// Use index to log the second fruit to console\nconsole.log(fruits[1]); // Output: "orange"\n\n// Add "kiwi" to the end of the array\nfruits.push("kiwi");\n\n// Log the number of fruits in the array\nconsole.log(fruits.length); // Output: 4',
      },
      '/package.json': {
        code: '{\n  "dependencies": {},\n  "scripts": {\n    "start": "node index.js"\n  },\n  "main": "index.js",\n  "devDependencies": {}\n}',
      },
    },
    instructions:
      '## Arrays\n\nArrays are like baskets of things in JavaScript. They help you store lots of values in just one variable! To create an array, you put a list of values inside square brackets, separated by commas. To get a value out of the array, you use its "index" number, which starts counting at 0. You can also do other cool things with arrays, like adding or removing things, sorting them, or searching for specific values. Heres an example:\n\n```\nlet fruits = ["apple", "orange", "pear"];\n```',
    questions: [
      ...defaultQuestions,
      'What are some real world examples of arrays?',
    ],
    start: '',
    title: 'Arrays',
  },
];

function MonacoEditor({
  currentCheckpoint,
  currentStep,
  files,
  hoverSelection,
  isStepComplete,
  leftPanelHeight,
  onReady,
  setCurrentCheckpoint,
  setCurrentStep,
  setHoverSelection,
  setIsStepComplete,
  setLeftPanelHeight,
}: {
  currentCheckpoint: number;
  currentStep: number;
  files: any;
  hoverSelection: string | null;
  isStepComplete: boolean;
  leftPanelHeight: {
    editor: string;
    instructions: string;
  };
  onReady: () => void;
  setCurrentCheckpoint: Dispatch<SetStateAction<number>>;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setHoverSelection: Dispatch<SetStateAction<string | null>>;
  setIsStepComplete: Dispatch<SetStateAction<boolean>>;
  setLeftPanelHeight: Dispatch<
    SetStateAction<{
      editor: string;
      instructions: string;
    }>
  >;
}) {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const { activeFile } = sandpack;
  const editorRef = useRef<any>();
  const monacoRef = useRef<any>();
  const [full, setFull] = useState(false);
  const [isCompletionEnabled, setIsCompletionEnabled] = useState(false);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const isStepCompleteRef = useRef(isStepComplete);
  const isCompletionEnabledRef = useRef(isCompletionEnabled);
  const isAutoPlayEnabledRef = useRef(isAutoPlayEnabled);
  const [nextLoader, setNextLoader] = useState(false);

  useEffect(() => {
    isStepCompleteRef.current = isStepComplete;
  }, [isStepComplete]);

  useEffect(() => {
    isCompletionEnabledRef.current = isCompletionEnabled;
  }, [isCompletionEnabled]);

  useEffect(() => {
    isAutoPlayEnabledRef.current = isAutoPlayEnabled;
  }, [isAutoPlayEnabled]);

  useEffect(() => {
    setLeftPanelHeight({
      editor: full ? '100%' : 'calc(100% - 18rem)',
      instructions: full ? '0px' : '18rem',
    });
  }, [full]);

  useEffect(() => {
    setFull(false);
  }, [currentStep]);

  useEffect(() => {
    setNextLoader(false);
  }, [currentStep]);

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor
        .getModels()
        .forEach((model: any) => model.dispose());
      setupModels();
      setupStart();
    }
  }, [currentStep]);

  useEffect(() => {
    if (!monacoRef.current) return;
    if (!editorRef.current) return;
    if (!activeFile) return;
    const model = monacoRef.current.editor.getModel(
      monacoRef.current.Uri.parse(`${URN}${activeFile}`)
    );
    if (model) editorRef.current.setModel(model);

    const language = getLanguage(activeFile);

    setupHoverProvider(language);
  }, [activeFile, monacoRef.current, editorRef.current]);

  const updatePrompt = async (value: string | undefined, ev: any) => {
    if (!value || !ev) return;
    if (isStepCompleteRef.current) return;
    if (!isCompletionEnabledRef.current) return;
    const lines = value.split(/\n/);
    const lineNumber = ev.changes[0].range.startLineNumber - 1;
    const line = lines[lineNumber];
    const changePos = ev.changes[0].range.endColumn - 1;
    const insert =
      line.substring(0, changePos) + '[insert]' + line.substring(changePos);
    lines[lineNumber] = insert;
    const prompt =
      'Only respond with code that follows the instructions.\n' +
      'Instructions: ' +
      steps[currentStep].instructions +
      '\n' +
      `${
        steps[currentStep].checkpoints[currentCheckpoint]?.test
          ? '\n' +
            'Satisfy Regex: ' +
            steps[currentStep].checkpoints[currentCheckpoint]?.test
          : ''
      }` +
      lines.join('\n').split('[insert]')[0];
    const suffix = lines.join('\n').split('[insert]')[1];

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/completions`,
        {
          body: JSON.stringify({
            apiKey: localStorage.getItem('openaiKey'),
            prompt,
            suffix,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );

      const completions: { text: string }[] = await response.json();
      const suggestion = completions[0].text;
      return suggestion;
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedUpdatePrompt = debounce(updatePrompt, 100);

  const testCheckpoint = (value: string) => {
    const checkpoint = steps[currentStep].checkpoints[currentCheckpoint];
    const test = checkpoint?.test;
    const regex = new RegExp(test);
    let allPassed;
    if (regex.test(value) && checkpoint && checkpoint.passed === false) {
      steps[currentStep].checkpoints[currentCheckpoint].passed = true;
      allPassed = steps[currentStep].checkpoints.every(
        (checkpoint: any) => checkpoint.passed
      );
      if (allPassed) {
        setIsStepComplete(true);
        if (isAutoPlayEnabledRef.current) {
          setNextLoader(true);
        }
      } else {
        const nextCheckpoint = steps[currentStep].checkpoints.findIndex(
          (checkpoint: any) => !checkpoint.passed
        );
        setCurrentCheckpoint(nextCheckpoint);
      }
    }

    return allPassed;
  };

  const setupModels = () => {
    Object.keys(files).forEach((mod) => {
      const model = monacoRef.current.editor.getModel(
        monacoRef.current.Uri.parse(`${URN}${mod}`)
      );
      if (model) return;
      monacoRef.current.editor.createModel(
        files[mod].code,
        getLanguage(mod || ''),
        monacoRef.current.Uri.parse(`${URN}${mod}`)
      );
    });
    const model = monacoRef.current.editor.getModel(
      monacoRef.current.Uri.parse(`${URN}${activeFile}`)
    );
    model?.updateOptions({ tabSize: 2 });
    editorRef.current.setModel(model);
  };

  const setupCompilerOptions = () => {
    const jsxFactory = 'React.createElement';
    const reactNamespace = 'React';
    const hasNativeTypescript = false;

    monacoRef.current.languages.typescript.javascriptDefaults.setEagerModelSync(
      true
    );

    const tsConfigFile = Object.keys(files).find(
      (module) => module === '/tsconfig.json'
    );
    const tsConfig = tsConfigFile
      ? JSON.parse(files[tsConfigFile].code || '')
      : undefined;

    // https://github.com/codesandbox/codesandbox-client/blob/master/packages/app/src/embed/components/Content/Monaco/index.js
    monacoRef.current.languages.typescript.typescriptDefaults.setCompilerOptions(
      {
        allowJs: true,
        allowNonTsExtensions: !hasNativeTypescript,
        experimentalDecorators: true,
        jsx: tsConfig?.compilerOptions
          ? tsConfig?.compilerOptions.jsx
          : monacoRef.current.languages.typescript.JsxEmit.React,
        jsxFactory,
        module: hasNativeTypescript
          ? monacoRef.current.languages.typescript.ModuleKind.ES2015
          : monacoRef.current.languages.typescript.ModuleKind.System,
        moduleResolution:
          monacoRef.current.languages.typescript.ModuleResolutionKind.NodeJs,
        // forceConsistentCasingInFileNames:
        //   hasNativeTypescript && existingConfig.forceConsistentCasingInFileNames,
        // noImplicitReturns:
        //   hasNativeTypescript && existingConfig.noImplicitReturns,
        // noImplicitThis: hasNativeTypescript && existingConfig.noImplicitThis,
        // noImplicitAny: hasNativeTypescript && existingConfig.noImplicitAny,
        // strictNullChecks: hasNativeTypescript && existingConfig.strictNullChecks,
        // suppressImplicitAnyIndexErrors:
        //   hasNativeTypescript && existingConfig.suppressImplicitAnyIndexErrors,
        // noUnusedLocals: hasNativeTypescript && existingConfig.noUnusedLocals,
        newLine: monacoRef.current.languages.typescript.NewLineKind.LineFeed,

        noEmit: true,

        reactNamespace,

        target: monacoRef.current.languages.typescript.ScriptTarget.ES2016,

        typeRoots: [`node_modules/@types`],
      }
    );
  };

  const setupStart = () => {
    const match = editorRef.current
      .getModel()
      .findMatches(steps[currentStep].start, true, false, false, null, true)[0];

    if (!match) return;
    editorRef.current.setPosition(match.range.getEndPosition());
    editorRef.current.focus();
  };

  class InlineCompleter {
    async provideInlineCompletions() {
      const range = {
        endColumn: editorRef.current.getPosition().column,
        endLineNumber: editorRef.current.getPosition().lineNumber,
        startColumn: editorRef.current.getPosition().column,
        startLineNumber: editorRef.current.getPosition().lineNumber,
      };
      const suggestion = await debouncedUpdatePrompt(
        editorRef.current.getValue(),
        {
          changes: [
            {
              range,
            },
          ],
        }
      );

      if (!suggestion) return;

      return {
        items: [
          {
            insertText: suggestion,
            range,
          },
        ],
      };
    }
    freeInlineCompletions() {}
  }

  const setupInlineCompletions = () => {
    monacoRef.current.languages.registerInlineCompletionsProvider(
      { pattern: '**' },
      new InlineCompleter()
    );
  };

  const setupHoverProvider = (language: string) => {
    monacoRef.current.languages.registerHoverProvider(language, {
      provideHover: async (model: any, position: any) => {
        const selection = editorRef.current.getSelection();
        const selectionValue = model.getValueInRange(selection);

        let nextHoverSelection = null;
        if (selectionValue) {
          nextHoverSelection = selectionValue;
        }

        if (nextHoverSelection === hoverSelection) return;
        setHoverSelection(nextHoverSelection);
      },
    });
  };

  const handleMount = (editor: any, monaco: any) => {
    if (monacoRef.current) return;
    monacoRef.current = monaco;
    editorRef.current = editor;

    setupInlineCompletions();
    setupCompilerOptions();
    setupModels();
    setupStart();
    onReady();
  };

  const extension = getModelExtension(activeFile);
  const isImage =
    extension === 'jpg' ||
    extension === 'png' ||
    extension === 'gif' ||
    extension === 'svg' ||
    extension === 'jpeg';

  return (
    <SandpackStack
      className="relative z-30 transition-all"
      style={{ height: `${leftPanelHeight.editor}`, margin: 0 }}
    >
      <Checkpoints currentStep={currentStep} />
      <StepActions
        currentStep={currentStep}
        disabled={!isStepComplete}
        isAutoPlayEnabled={isAutoPlayEnabled}
        isCompletionEnabled={isCompletionEnabled}
        nextLoader={nextLoader}
        setCurrentStep={setCurrentStep}
        setIsAutoPlayEnabled={setIsAutoPlayEnabled}
        setIsCompletionEnabled={setIsCompletionEnabled}
        steps={steps.length}
      />
      <FileTabs />
      {/* <div
        className={`flex h-full w-full items-center justify-center ${
          isImage ? 'block' : 'hidden'
        }`}
      >
        <img className="w-1/2" src={sandpack.files[activeFile].code} />
      </div> */}
      <div className={`h-[320px] sm:h-full ${isImage ? 'hidden' : 'block'}`}>
        <Editor
          defaultValue={code}
          language="javascript"
          onChange={(value) => {
            testCheckpoint(value || '');
            updateCode(value || '');
          }}
          onMount={handleMount}
          options={{
            fontSize: 14,
            fontWeight: 600,
            lineNumbers: 'off',
            minimap: {
              enabled: false,
            },
            quickSuggestions: false,
            wordWrap: 'on',
          }}
          theme="vs-dark"
          width="100%"
        />
      </div>
      <Icon
        className="absolute bottom-0 right-0 m-2 text-neutral-400 hover:text-white"
        name={full ? 'resize-small' : 'resize-full'}
        onClick={() => setFull(!full)}
      />
    </SandpackStack>
  );
}

const Markdown = ({
  currentStep,
  leftPanelHeight,
  setLeftPanelHeight,
}: {
  currentStep: number;
  leftPanelHeight: {
    editor: string;
    instructions: string;
  };
  setLeftPanelHeight: Dispatch<
    SetStateAction<{
      editor: string;
      instructions: string;
    }>
  >;
}) => {
  const [full, setFull] = useState(false);

  useEffect(() => {
    setFull(false);
  }, [currentStep]);

  useEffect(() => {
    setLeftPanelHeight({
      editor: full ? '0px' : 'calc(100% - 18rem)',
      instructions: full ? '100%' : '18rem',
    });
  }, [full]);

  return (
    <div
      className={`relative overflow-hidden bg-neutral-900 transition-all ${
        full ? 'z-40' : 'z-20'
      }`}
      key={currentStep}
      style={{ height: `${leftPanelHeight.instructions}` }}
    >
      <ReactMarkdown
        children={steps[currentStep].instructions}
        className="markdown-body h-full overflow-scroll border-b border-neutral-800 px-3 py-2"
        plugins={[gfm]}
      />
      <Icon
        className="absolute bottom-0 right-0 m-2 text-neutral-400 hover:text-white"
        name={full ? 'resize-small' : 'resize-full'}
        onClick={() => setFull(!full)}
      />
    </div>
  );
};

const Checkpoints = ({ currentStep }: { currentStep: number }) => {
  return (
    <div>
      {steps[currentStep].checkpoints?.map((checkpoint) => {
        return (
          <div
            className="relative z-20 flex items-center gap-2 border-b border-neutral-800 bg-black p-2 px-3"
            key={checkpoint.message}
          >
            <div
              className={`flex h-4 min-h-[1rem] w-4 min-w-[1rem] items-center justify-center rounded-full border ${
                checkpoint.passed
                  ? 'border-green-500 bg-green-900'
                  : 'border-neutral-500 bg-black'
              }`}
            >
              <Icon
                className={`text-xxs ${
                  checkpoint.passed ? `text-green-500` : 'text-neutral-500'
                }`}
                // @ts-ignore
                name={checkpoint.passed ? 'check' : ''}
              />
            </div>
            <pre className="whitespace-normal text-white">
              {checkpoint.message}
            </pre>
          </div>
        );
      })}
    </div>
  );
};

const ChatBot = ({
  currentStep,
  hoverSelection,
}: {
  currentStep: number;
  hoverSelection: string | null;
}) => {
  const [height, setHeight] = useState(0);
  const { code } = useActiveCode();
  const [responses, setResponses] = useState<
    { question: string; value: string }[]
  >([]);
  const [textStreams, setTextStreams] = useState<
    {
      question: string;
      stream: string[];
    }[]
  >([]);
  const [isBusy, setIsBusy] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const streamedTextsRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isBusy) return;

    if (hoverSelection) {
      const prompt =
        'Code: ' +
        code +
        '### Explain what ' +
        hoverSelection +
        ' does in the code above.';
      fetchExplain(prompt, hoverSelection);
    }
  }, [hoverSelection]);

  const fetchExplain = async (prompt: string, question: string) => {
    try {
      const oldStream = textStreams.find(
        (stream) => stream.question === question
      );
      if (oldStream) {
        const oldDiv = document.getElementById(oldStream.question);
        if (oldDiv && streamedTextsRef.current) {
          streamedTextsRef.current.scrollTo({
            behavior: 'smooth',
            top: oldDiv.offsetTop - (formRef?.current?.offsetHeight || 0) || 0,
          });
          oldDiv.classList.add('animate-pulse');
          setTimeout(() => {
            oldDiv.classList.remove('animate-pulse');
          }, 5000);
        }
        throw new Error('Already asked this question');
      }
      if (isBusy) throw new Error('Busy');
      setIsBusy(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/explain`,
        {
          body: JSON.stringify({
            apiKey: localStorage.getItem('openaiKey'),
            prompt,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );

      const explainations: {
        finish_reason: 'length' | 'stop';
        text: string;
      }[] = await response.json();
      let value = `${explainations[0].text}`;
      if (explainations[0].finish_reason === 'length') {
        value += '...';
      }
      setResponses((prev) => [...prev, { question, value }]);
      streamText(value, question, responses.length);
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 10);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };

  const streamText = (text: string, question: string, streamIndex: number) => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        streamedTextsRef.current?.scrollTo({
          behavior: 'smooth',
          top: streamedTextsRef.current?.scrollHeight,
        });
        index++;
      }

      setTextStreams((prev) => {
        const newStreams = [...prev];
        newStreams[streamIndex] = {
          question,
          stream: text.slice(0, index).split(''),
        };
        return newStreams;
      });

      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, 50);
  };

  return (
    <div
      className={`flex max-h-[50%] flex-col border-t border-neutral-800 bg-black`}
    >
      <div className="relative h-full overflow-scroll" ref={streamedTextsRef}>
        <div className="sticky top-0 z-10 bg-black px-4 py-2" ref={formRef}>
          <div className="mb-2 flex items-center gap-2 sm:mb-1">
            <Image
              height={'24px'}
              src={hal}
              style={{ minHeight: '24px', minWidth: '24px' }}
              width={'24px'}
            />
            <pre className="whitespace-normal text-white">
              Hello, I'm Codeamigo. I'm here to help you with this tutorial.
            </pre>
          </div>
          <div className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2">
            <Formik
              initialValues={{ question: '' }}
              onSubmit={async (values) => {
                if (!values.question) return;
                const prompt = `${code} """ ${values.question}`;
                await fetchExplain(prompt, values.question);
              }}
            >
              {({ setFieldValue, setValues, submitForm, values }) => (
                <Form className="relative">
                  <textarea
                    autoFocus
                    className="min-h-[40px] w-full resize-none rounded-md border border-neutral-800 bg-black px-3 py-2 text-sm text-white !outline-0 !ring-0 transition-colors placeholder:text-neutral-400 focus:border-neutral-700 disabled:opacity-50"
                    disabled={isBusy}
                    name="question"
                    onChange={(e) => {
                      setFieldValue('question', e.target.value);
                    }}
                    onInput={(e) => {
                      setHeight(0);
                      setTimeout(() => {
                        // @ts-ignore
                        setHeight(e.target.scrollHeight);
                      }, 1);
                    }}
                    onKeyDown={(e) => {
                      if (e.which === 13 && !e.shiftKey) {
                        e.preventDefault();

                        submitForm();
                      }
                    }}
                    placeholder={
                      isDesktop
                        ? 'Ask me anything, or hover over some code to see what I can do.'
                        : 'Ask me anything.'
                    }
                    ref={textAreaRef}
                    style={{ height: `${height}px` }}
                    value={values.question}
                  />
                  {isBusy ? (
                    <Icon
                      className="absolute right-3 top-1.5 animate-spin text-lg text-neutral-500"
                      name="cog"
                    />
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {steps[currentStep].questions.map((question) => {
                      return (
                        <pre
                          className="inline-block cursor-pointer rounded-md border border-blue-500 bg-blue-950 px-1 py-0.5 text-xs text-blue-500"
                          onClick={() => {
                            setValues({ question });
                            submitForm();
                          }}
                        >
                          {question}
                        </pre>
                      );
                    })}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        {textStreams.map(({ question, stream }, index) => {
          return (
            <div
              className={`border-b border-neutral-800 px-4 py-2 text-sm first:border-t last:border-b-0 ${
                index % 2 === 0 ? 'bg-neutral-900' : 'bg-black'
              }`}
              id={question}
            >
              <div className="mb-1">
                <pre className="inline-block rounded-md border border-green-500 bg-green-950 px-1 py-0.5 text-xs text-green-500">
                  {question}
                </pre>
              </div>
              {stream.map((char, i) => {
                if (stream.length === 0) return null;
                if ((char === '\n' && i === 0) || (char === '\n' && i === 1))
                  return null;
                if (char === '\n') return <br />;
                return <span className="text-white">{char}</span>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProgressBar = ({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div
      className="flex cursor-pointer items-center gap-2 text-xs font-light"
      onClick={() => {
        modalVar({
          callback: (step: number) => {
            setCurrentStep(step);
          },
          data: { currentStep, steps, title: 'Intro to Codeamigo' },
          name: 'steps',
          persistent: false,
        });
      }}
    >
      <div className="h-2 w-32 rounded-full bg-green-900 p-[2px]">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      <div className="text-xs text-white">
        {/* percent completed */}
        <pre>
          Step{' '}
          {`${currentStep + 1}/${steps.length} ${steps[currentStep].title}`}
        </pre>
      </div>
    </div>
  );
};

const Credits = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-32 rounded-full bg-blue-900">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          // todo: don't hardcode this
          style={{ width: `33%` }}
        />
      </div>
    </div>
  );
};

const V2 = () => {
  const [ready, setReady] = useState(false);
  const [loaderReady, setLoaderReady] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [leftPanelHeight, setLeftPanelHeight] = useState(
    defaultLeftPanelHeight
  );
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [hoverSelection, setHoverSelection] = useState<string | null>(null);

  // HIGH DEMAND
  useEffect(() => {
    if (!localStorage.getItem('openaiKey')) {
      modalVar({
        callback: () => null,
        name: 'highDemand',
      });
    }
  }, []);
  // useEffect(() => {
  //   if (!isDesktop) {
  //     modalVar({
  //       callback: () => null,
  //       name: 'mobileWarning',
  //     });
  //   }
  // }, [isDesktop]);

  useEffect(() => {
    setLeftPanelHeight(defaultLeftPanelHeight);
  }, [currentStep]);

  useEffect(() => {
    const allPassed =
      steps[currentStep].checkpoints.every((checkpoint) => checkpoint.passed) ||
      !steps[currentStep].checkpoints.length;
    setIsStepComplete(allPassed);
  }, [currentStep]);

  useEffect(() => {
    const nextCheckpoint = steps[currentStep].checkpoints.findIndex(
      (checkpoint) => {
        return !checkpoint.passed;
      }
    );
    if (nextCheckpoint !== -1) {
      setCurrentCheckpoint(nextCheckpoint);
    }
  }, [currentStep]);

  useEffect(() => {
    let timeout: any;
    if (loaderReady && editorReady) {
      timeout = setTimeout(() => {
        setReady(true);
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [editorReady, loaderReady]);

  return (
    <AnimatePresence>
      <motion.div
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        className="flex w-full flex-col items-center justify-center gap-1.5 p-5 pt-2 md:h-full"
        initial={{ opacity: 0, scale: 0 }}
        key="v2"
        style={{ transformOrigin: 'center' }}
        transition={transition}
      >
        {/* top bar */}
        <div className="flex w-full justify-between">
          <ProgressBar
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
          {/* <Credits /> */}
        </div>
        <div
          className="h-full overflow-hidden rounded-lg border border-neutral-800"
          style={{ width: '100%' }}
        >
          <SandpackProvider
            files={steps[currentStep].files}
            template="vanilla"
            theme={'dark'}
          >
            <SandpackLayout>
              <SandpackStack className="editor-instructions-container !h-full">
                <Markdown
                  currentStep={currentStep}
                  leftPanelHeight={leftPanelHeight}
                  setLeftPanelHeight={setLeftPanelHeight}
                />
                <MonacoEditor
                  currentCheckpoint={currentCheckpoint}
                  currentStep={currentStep}
                  files={steps[currentStep].files}
                  hoverSelection={hoverSelection}
                  isStepComplete={isStepComplete}
                  leftPanelHeight={leftPanelHeight}
                  onReady={() => setEditorReady(true)}
                  setCurrentCheckpoint={setCurrentCheckpoint}
                  setCurrentStep={setCurrentStep}
                  setHoverSelection={setHoverSelection}
                  setIsStepComplete={setIsStepComplete}
                  setLeftPanelHeight={setLeftPanelHeight}
                />
              </SandpackStack>
              <SandpackStack className="!h-full">
                <SandpackPreview className="!h-0" />
                <SandpackConsole className="overflow-scroll" />
                <ChatBot
                  currentStep={currentStep}
                  hoverSelection={hoverSelection}
                />
              </SandpackStack>
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </motion.div>
      <motion.div
        animate={
          ready || !loaderReady
            ? { opacity: 0, scale: 0 }
            : { opacity: 1, scale: 1 }
        }
        className="fixed left-0 top-0 flex h-full w-full animate-pulse items-center justify-center text-white"
        initial={{ opacity: 0.5, scale: 0.5 }}
        style={{ transformOrigin: 'center' }}
        transition={transition}
      >
        <Image
          height={60}
          onLoad={() => setLoaderReady(true)}
          src={hal}
          width={60}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default V2;
