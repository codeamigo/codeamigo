import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import InputField from '👨‍💻components/Form/InputField';
import { useMeQuery, useUpdateUserRoleMutation } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';
import PendingLessonsList from '👨‍💻widgets/PendingLessonsList';

const Backoffice: React.FC<Props> = () => {
  const { data } = useMeQuery();
  const router = useRouter();
  const [updateUserRole] = useUpdateUserRoleMutation();

  useEffect(() => {
    if (data?.me?.role !== 'ADMIN') {
      router.push('/me?tab=activity');
    }
  }, []);

  return (
    <div>
      <div className="md:w-1/4">
        <h2 className="underline text-xl text-gray-700 font-bold mb-3">
          Create Admin
        </h2>
        <Formik
          initialValues={{}}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await updateUserRole({
              variables: {
                // @ts-ignore
                id: values.id,
                role: 'ADMIN',
              },
            });
            if (data?.updateUserRole.errors) {
              setErrors(toErrorMap(data.updateUserRole.errors));
              return;
            }

            window.alert(
              `${data?.updateUserRole.user?.username} is now an ADMIN.`
            );
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField label="User ID" name="id" type="number" />
              <button
                className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isSubmitting}
                type="submit"
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="mt-8">
        <h2 className="underline text-xl text-gray-700 font-bold mb-3">
          Publish Pending Lessons
        </h2>
        <PendingLessonsList />
      </div>
    </div>
  );
};

type Props = {};

export default Backoffice;
