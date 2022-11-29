import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

export const levelColorMap = {
  ADVANCED: 'bg-red-600',
  BEGINNER: 'bg-green-600',
  INTERMEDIATE: 'bg-yellow-300',
};

const Levels: React.FC<Props> = () => {
  const router = useRouter();

  const queryLevels = router.query.levels as string;

  return (
    <div className="p-2 mb-2 bg-bg-nav rounded-md">
      <h4 className="mb-2 text-lg font-semibold text-text-primary underline">
        Levels
      </h4>
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
            {Object.keys(levelColorMap).map((level) => {
              return (
                <label
                  className="flex justify-between mb-0.5 text-sm font-light cursor-pointer"
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
                    <div className="flex items-center ml-1 text-text-primary capitalize">
                      <div
                        // @ts-ignore
                        className={`w-2 h-2 mr-1 rounded-full ${levelColorMap[level]}`}
                      ></div>
                      {level.toLowerCase()}{' '}
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
