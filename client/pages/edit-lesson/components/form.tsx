import { ControlledEditor } from "@monaco-editor/react";
import { Formik, Form, Field } from "formik";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import {
  useUpdateLessonMutation,
  useCreateOrUpdateStepMutation,
  LessonQuery,
  Step,
  Lesson,
  StepsQuery,
} from "../../../generated/graphql";

import Editor from "./editor";

const defaultMD = `## Step \#

### Instructions
1. Add instructions for the step here.
2. You can use markdown to add [links](https://google.com)
3. Or use it to add \`code\` snippets.

\`\`\`
You can also write code in blocks.
\`\`\`

Remember to be short and sweet. 😘
`;

const StepForm: React.FC<Props> = ({ stepIdx, lesson, refetch }) => {
  const steps = lesson!.steps || [];
  const sortedSteps = steps
    .slice()
    .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1));

  const [code, setCode] = useState<string>("");
  const [step, setStep] = useState(sortedSteps[stepIdx]);
  const [markdown, setMarkdown] = useState(step?.instructions || defaultMD);

  const lessonId = lesson!.id;

  useEffect(() => {
    setStep(sortedSteps[stepIdx]);
    setMarkdown(sortedSteps[stepIdx].instructions);
  }, [stepIdx]);

  const [updateLesson] = useUpdateLessonMutation();
  const [createOrUpdateStep] = useCreateOrUpdateStepMutation();

  return (
    <Formik
      initialValues={{
        title: lesson?.title || "",
        description: lesson?.description || "",
      }}
      onSubmit={async (values, { setErrors }) => {
        try {
          await updateLesson({
            variables: { id: lessonId, ...values },
          });
          await createOrUpdateStep({
            variables: {
              id: step.id,
              lessonId: lessonId,
              instructions: markdown,
            },
          });
          refetch();
        } catch (e) {
          console.log(e);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="w-11/12 w-full">
          <>
            <div className="flex w-full justify-between">
              <div className="px-4 py-5 bg-white sm:p-6 w-1/2">
                <div className="grid gap-2">
                  <Field
                    name="title"
                    type="text"
                    placeholder="Lesson title"
                    className="border-0 focus:ring-0 p-0 text-2xl"
                  />
                  <Field
                    name="description"
                    type="text"
                    placeholder="Add a description"
                    className="border-0 focus:ring-0 p-0 text-lg"
                  />
                </div>
              </div>
              <div className="px-4 py-5 bg-white sm:p-6">
                <button
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
            <div className="flex w-full">
              <div className="w-2/4 pl-4 bg-white sm:pl-6">
                <h1>Instructions</h1>
                <div className="rounded-md border border-gray-200">
                  <ControlledEditor
                    height="300px"
                    width="100%"
                    value={markdown}
                    onChange={(_, value) => setMarkdown(value || "")}
                    options={{
                      wordWrap: "on",
                      minimap: { enabled: false },
                    }}
                  />
                </div>
              </div>
              <div className="w-2/4 pl-4 bg-white sm:pl-6">
                <ReactMarkdown
                  className="markdown-body px-6 py-4"
                  children={markdown}
                  plugins={[gfm]}
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <h1>Checkpoint #1</h1>
              <Editor setCode={setCode} />
            </div>
          </>
        </Form>
      )}
    </Formik>
  );
};

type Props = {
  lesson: LessonQuery["lesson"];
  stepIdx: number;
  refetch: any;
};

export default StepForm;
