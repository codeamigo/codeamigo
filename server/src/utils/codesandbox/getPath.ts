import { CodeSandboxI } from "src/types/codesandbox";

export function getPath(
  module: CodeSandboxI["data"]["modules"][0],
  directories: CodeSandboxI["data"]["directories"],
  includePrefix?: boolean
) {
  let parent: string | undefined = module.directory_shortid;
  let name = "/" + module.title;
  let path = "";

  while (parent) {
    const directory = directories.find((m) => m.shortid === parent);
    parent = directory?.directory_shortid;

    path = "/" + directory?.title + path;
  }

  const fullpath = `${path}${name}`;
  const filename = includePrefix ? fullpath : fullpath.slice(1);

  return filename;
}
