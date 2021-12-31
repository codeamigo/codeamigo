import fetch from "node-fetch";
import { CodeSandboxI } from "src/types/codesandbox";
import { ITemplate } from "src/utils/templates";

import { getPath } from "./getPath";

export async function getTemplateFromCodesandbox(
  id: string
): Promise<Omit<ITemplate, "templateName">> {
  try {
    const response = await fetch(
      `https://codesandbox.io/api/v1/sandboxes/${id}`
    );
    const { data: sandbox }: CodeSandboxI = await response.json();

    if (sandbox.is_sse)
      return Promise.reject("SSE Sandboxes are not supported.");

    return {
      codeModules: sandbox.modules.map((module) => {
        const filename = getPath(module, sandbox.directories, true);

        return {
          isEntry: module.title === sandbox.entry,
          name: filename,
          value: module.code,
        };
      }),
      executionType: "sandpack",
      lang: "javascript",
    };
  } catch (e) {
    return Promise.reject(e);
  }
}
