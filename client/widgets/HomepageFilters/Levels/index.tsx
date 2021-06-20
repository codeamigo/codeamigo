import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

const Levels: React.FC<Props> = () => {
  const router = useRouter();

  const queryLevels = router.query.levels as string;

  return (
    <div className="p-2 mt-2 bg-bg-nav rounded-md">
      <h4 className="font-semibold mb-2 text-text-primary">Levels</h4>
      <Formik
        initialValues={{
          checked: queryLevels ? queryLevels.split('|') : [],
        }}
        onSubmit={() => Promise.resolve()}
        validate={(values) => {
          router.replace({
            pathname: '/',
            query: {
              ...router.query,
              levels: values.checked.join('|'),
            },
          });
        }}
      >
        {() => (
          <Form>
            {[
              ['Beginner', 'bg-green-600'],
              ['Intermediate', 'bg-yellow-300'],
              ['Advanced', 'bg-red-600'],
            ].map(([level, color]) => {
              return (
                <label
                  className="flex justify-between text-sm font-light mb-0.5 cursor-pointer"
                  htmlFor={level}
                  key={level}
                >
                  <div className="flex items-center">
                    <Field
                      id={level}
                      name="checked"
                      type="checkbox"
                      value={level.toUpperCase()}
                    />{' '}
                    <div className="flex items-center text-text-primary ml-1">
                      <div
                        className={`w-2 h-2 mr-1 rounded-full ${color}`}
                      ></div>
                      {level}{' '}
                    </div>
                  </div>
                </label>
              );
            })}
          </Form>
        )}
      </Formik>
    </div>
  );
};

type Props = {};

export default Levels;
