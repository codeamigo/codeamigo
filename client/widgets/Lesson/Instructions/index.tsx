import { ControlledEditor } from "@monaco-editor/react";
import { debounce } from "debounce";
import React, { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import { RegularStepFragment, useUpdateStepMutation } from "@generated/graphql";
import Checkpoints from "../Checkpoints";

const Instructions: React.FC<Props> = ({ step }) => {
  const [markdown, setMarkdown] = useState(step?.instructions);
  const [view, toggleView] = useState<"editor" | "preview">("editor");
  const [updateStepM] = useUpdateStepMutation();

  const updateStep = useCallback(
    debounce((id: number, value: string | undefined) => {
      updateStepM({ variables: { id, instructions: value || "" } });
    }, 1000),
    []
  );

  useEffect(() => {
    setMarkdown(step.instructions);
  }, [step.id]);

  return (
    <>
      <div className="w-full lg:h-full flex flex-col">
        <h3>Instructions</h3>
        <div className="h-80 lg:h-full lg:flex lg:flex-col rounded-md border border-gray-200">
          {view === "editor" ? (
            <ControlledEditor
              value={markdown}
              onChange={(_, value) => {
                setMarkdown(value);
                updateStep(step.id, value);
              }}
              options={{
                wordWrap: "on",
                minimap: { enabled: false },
                quickSuggestions: false,
                automaticLayout: true,
                scrollBeyondLastLine: false
              }}
            />
          ) : (
            <ReactMarkdown
              className="markdown-body px-6 py-4"
              children={markdown || ""}
              plugins={[gfm]}
            />
          )}
        </div>
        <div>
          <Checkpoints step={step} />
        </div>
      </div>
    </>
  );
};

type Props = {
  step: RegularStepFragment;
};

export default Instructions;
