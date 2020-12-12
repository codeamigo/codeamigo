import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Editor from "@monaco-editor/react";

import { useCreateLessonMutation } from "../generated/graphql";
import { toErrorMap } from "../utils";
import withApollo from "../utils/withApollo";

const CreateLesson: React.FC<Props> = () => {
  let input: any;
  const router = useRouter();
  const [createLesson, { data }] = useCreateLessonMutation();
  const inputElement = useRef(null);

  useEffect(() => {
    if (inputElement.current) {
      // @ts-ignore
      inputElement.current.focus();
    }
  }, []);

  // handle

  return (
    <Formik
      initialValues={{ title: "", description: "" }}
      onSubmit={async (values, { setErrors }) => {
        try {
          const { data } = await createLesson({ variables: values });
          router.push("/");
        } catch (e) {
          console.log(e);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <>
            <div className="max-w-2xl px-8">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid gap-1">
                  <input
                    autoFocus={true}
                    ref={inputElement}
                    name="title"
                    type="text"
                    placeholder="Lesson title"
                    onBlur={console.log}
                    className="border-0 focus:ring-0 text-2xl"
                  />
                  <input
                    name="description"
                    type="text"
                    placeholder="Add a description"
                    className="border-0 focus:ring-0 text-lg"
                  />
                </div>
              </div>
            </div>
            <div className="w-full px-8">
              <div className="w-2/4">
                <Editor
                  height="300px"
                  options={{ minimap: { enabled: false } }}
                />
              </div>
              <div className="w-2/4"></div>
            </div>
          </>
        </Form>
      )}
    </Formik>
  );
};

type Props = {};

export default withApollo({ ssr: false })(CreateLesson);
