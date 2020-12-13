import fetch from "node-fetch";
import { getParameters } from "codesandbox/lib/api/define";

interface IFiles {
  [key: string]: {
    content: string;
    isBinary: boolean;
  };
}

export async function generateSandbox(files: IFiles) {
  const parameters = getParameters({ files });

  const sandboxId = await fetch(
    `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}&json=1`
  ).then((res) => res.json());

  return `https://${sandboxId}.csb.app`;
}
