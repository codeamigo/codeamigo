import { Form, Formik } from "formik";
import React from "react";
import { useRouter } from "next/router";

import InputField from "../components/form/InputField";
import { useCreateLessonMutation } from "../generated/graphql";
import { toErrorMap } from "../utils";
import withApollo from "../utils/withApollo";

const CreateLesson: React.FC<Props> = () => {
  const router = useRouter();
  const [createLesson, { data }] = useCreateLessonMutation();

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
          <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl text-blue-800 font-semibold justify-center flex mb-4">
              Create Lesson
            </h1>
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid gap-6">
                  <InputField label="Title" name="title" type="text" />
                  <InputField
                    label="Description"
                    name="description"
                    type="text"
                  />
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Create Lesson
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

type Props = {};

export default withApollo({ ssr: false })(CreateLesson);
