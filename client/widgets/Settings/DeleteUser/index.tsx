import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

import Button from '👨‍💻components/Button';
import {
  MeDocument,
  MeQuery,
  useDeleteUserMutation,
  useMeQuery,
} from '👨‍💻generated/graphql';

const DeleteUser: React.FC<Props> = () => {
  const router = useRouter();
  const me = useMeQuery();
  const [deleteUser] = useDeleteUserMutation();

  return (
    <div>
      <div className="md:w-1/4">
        <h2
          aria-label={`User ID: ${me.data?.me?.id}`}
          className="underline hint--top text-xl text-text-primary font-bold mb-3"
        >
          Delete Account
        </h2>
        <Formik
          initialValues={{}}
          onSubmit={async (values) => {
            const yes = window.confirm(
              'Are you sure you want to delete your account? All data associated with your account will be deleted.'
            );

            if (!yes) return;

            const q = {
              query: MeDocument,
            };

            const { data } = await deleteUser({
              update: (store) => {
                store.writeQuery<MeQuery>({
                  ...q,
                  data: {
                    me: null,
                  },
                });
              },
              variables: {
                ...values,
              },
            });

            if (data?.deleteUser) {
              router.push('/');
            } else {
              window.alert('Error deleting account.');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3">
              <Button
                className="bg-red-600 text-white justify-center"
                disabled={isSubmitting}
                type="submit"
              >
                Delete Account
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

type Props = {};

export default DeleteUser;
