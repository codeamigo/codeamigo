// Need to have sandpack support for sse type sandboxes
// https://github.com/codesandbox/sandpack/discussions/253

import { getParameters } from 'codesandbox/lib/api/define';
import fetch from 'node-fetch';
import { CodeSandboxI } from 'src/types/codesandbox';

import { getPath } from './getPath';

export async function forkCodesandbox(
  id: string
): Promise<{ codesandboxId: string }> {
  try {
    const sandboxReq = await fetch(
      `https://codesandbox.io/api/v1/sandboxes/${id}`
    );
    const { data: sandbox }: CodeSandboxI = await sandboxReq.json();

    const files = sandbox.modules.reduce((acc, module) => {
      const filename = getPath(module, sandbox.directories);

      return {
        ...acc,
        [filename]: { content: module.code, isBinary: false },
      };
    }, {});

    const newSandboxReq = await fetch(
      `https://codesandbox.io/api/v1/sandboxes/define`,
      {
        body: JSON.stringify({
          embed: 1,
          json: 1,
          parameters: getParameters({ files }),
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }
    );
    const newSandbox: { sandbox_id: string } = await newSandboxReq.json();

    return {
      codesandboxId: newSandbox.sandbox_id,
    };
  } catch (e) {
    return Promise.reject(e);
  }
}
