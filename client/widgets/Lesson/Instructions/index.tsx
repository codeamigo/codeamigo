import { ControlledEditor } from "@monaco-editor/react";
import { debounce } from "debounce";
import React, { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import {
  RegularStepFragment,
  useUpdateStepMutation,
} from "@generated/graphql";

const Instructions: React.FC<Props> = ({ step }) => {
  const [markdown, setMarkdown] = useState(step?.instructions);
  const [updateStepM] = useUpdateStepMutation();

  const updateStep = useCallback(
    debounce((id: number, value: string | undefined) => {
      updateStepM({ variables: { id, instructions: value || "" } });
    }, 1000),
    []
  );

  useEffect(() => {
    setMarkdown(step.instructions)
  }, [step.id])

  return (
    <>
      <div className="px-4 py-5 bg-white sm:p-6 w-1/2">
        <h3>Instructions</h3>
        <div className="rounded-md border border-gray-200">
          <ControlledEditor
            height="300px"
            width="100%"
            value={markdown}
            onChange={(_, value) => {
              setMarkdown(value);
              updateStep(step.id, value);
            }}
            options={{
              wordWrap: "on",
              minimap: { enabled: false },
              quickSuggestions: false
            }}
          />
        </div>
      </div>
      <div className="px-4 py-5 bg-white sm:p-6 w-1/2">
        <ReactMarkdown
          className="markdown-body px-6 py-4"
          children={markdown || ""}
          plugins={[gfm]}
        />
      </div>
    </>
  );
};

type Props = {
  step: RegularStepFragment;
};

export default Instructions;
