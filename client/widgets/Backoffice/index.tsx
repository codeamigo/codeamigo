import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import { useMeQuery, useUpdateUserRoleMutation } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';
import PendingLessonsList from '👨‍💻widgets/PendingLessonsList';
import StudentList from '👨‍💻widgets/StudentList';

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
        <h2 className="mb-3 text-xl font-bold text-text-primary underline">
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
              <Button disabled={isSubmitting} type="submit">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="mt-8">
        <h2 className="mb-3 text-xl font-bold text-text-primary underline">
          Publish Pending Lessons
        </h2>
        <PendingLessonsList />
      </div>
      <div className="mt-8">
        <h2 className="mb-3 text-xl font-bold text-text-primary underline">
          Students (beta testers)
        </h2>
        <StudentList />
      </div>
    </div>
  );
};

type Props = {};

export default Backoffice;
