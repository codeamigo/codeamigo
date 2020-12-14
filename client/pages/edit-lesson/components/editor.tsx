import { ControlledEditor } from "@monaco-editor/react";
import React from "react";

const Editor: React.FC<Props> = ({ setCode }) => {
  return (
    <div className="w-2/4 pr-4 bg-white sm:pr-6">
      <ul className="list-reset flex pl-2">
        <li className="list-none relative cursor-pointer">
          <a
            className={`border-gray-200 text-gray-700 bg-white inline-block text-sm py-2 px-4 font-medium border border-b-0 rounded-t hover:text-gray-700`}
          >
            Checkpoint #1
          </a>
        </li>
      </ul>
      <div className="rounded-md border border-gray-200">
        <ControlledEditor
          height="300px"
          width="100%"
          language="typescript"
          options={{
            iframe: true,
            minimap: { enabled: false },
          }}
          onChange={(_, value) => setCode(value || "")}
        />
      </div>
    </div>
  );
};

type Props = {
  setCode: (value: string) => void;
};

export default Editor;
