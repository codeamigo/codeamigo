const babel = require("@babel/standalone");

const MODULE_ROOT = "/node_modules";

const transformCode = (code, path) => {
  return babel.transform(code, {
    presets: ["es2015", "react"],
    filename: path,
  });
};

// ⛔️⛔️⛔️⛔️⛔️
// This code is important and should be tested
// thoroughly when changed. It runs through all
// possible files to get the next required path.
// ⛔️⛔️⛔️⛔️⛔️
const findBestMatch = (files, runPath) => {
  switch (true) {
    case !!files[runPath]: {
      return runPath;
    }
    case !!files[`${MODULE_ROOT}/${runPath}/index.js`]: {
      return `${MODULE_ROOT}/${runPath}/index.js`;
    }
    default:
      const fileKeys = Object.keys(files);
      const cleanRunPath = runPath.replace("./", "");

      const opt1 = fileKeys.find((file) => file.includes(`${cleanRunPath}.js`));
      const opt2 = fileKeys.find((file) => file.includes(cleanRunPath));

      switch (true) {
        case opt1 !== undefined: {
          return opt1;
        }
        case opt2 !== undefined: {
          return opt2;
        }
      }

      console.error(`No file found for ${runPath}`);
  }
};

const runCode = (files, runPath) => {
  try {
    const path = findBestMatch(files, runPath);
    const code = files[path];
    const babelOutput = transformCode(code, path);

    const require = (path) => {
      return runCode(files, path);
    };

    const exports = {};
    const module = { exports };
    eval(babelOutput.code);

    return module.exports;
  } catch (e) {
    console.log(e);
  }
};

window.addEventListener("message", ({ data }) => {
  if (data.from !== "editor") return;

  console.log(data);

  runCode(data.files, data.runPath);
});
