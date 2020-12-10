import { Form, Formik } from "formik";
import React from "react";
import { useRouter } from "next/router";

import InputField from "../components/form/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils";
import withApollo from "../utils/withApollo";

const Register: React.FC<Props> = () => {
  const router = useRouter();
  const [register, { data }] = useRegisterMutation();

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={async (values, { setErrors }) => {
        const { data } = await register({ variables: values });
        if (data?.register.errors) {
          setErrors(toErrorMap(data.register.errors));
        }

        if (data?.register.user) {
          router.push("/");
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl text-blue-800 font-semibold justify-center flex mb-4">
              Register
            </h1>
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid gap-6">
                  <InputField label="Username" name="username" type="text" />
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                  />
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Register
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

export default withApollo({ ssr: false })(Register);
