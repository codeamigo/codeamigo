import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

import { useDepsFromPkgsQuery } from '👨‍💻generated/graphql';

const Dependencies: React.FC<Props> = () => {
  const { data } = useDepsFromPkgsQuery();

  const router = useRouter();

  const queryDeps = router.query.deps as string;
  const depMap =
    data?.deps.reduce((acc, curr) => {
      if (acc[curr]) {
        acc[curr] = acc[curr] + 1;
      } else {
        acc[curr] = 1;
      }
      return acc;
    }, {} as { [key in string]: number }) || {};
  const sortedDepMap = Object.keys(depMap).sort(
    (a, b) => depMap[b] - depMap[a]
  );

  return (
    <div className="p-2 bg-bg-nav rounded-md">
      <h4 className="font-semibold mb-2 text-text-primary">Dependencies</h4>
      <Formik
        initialValues={{
          checked: queryDeps ? queryDeps.split('|') : [],
        }}
        onSubmit={() => Promise.resolve()}
        validate={(values) => {
          router.replace({
            pathname: '/',
            query: {
              ...router.query,
              deps: values.checked.join('|'),
            },
          });
        }}
      >
        {({ values }) => (
          <Form>
            {sortedDepMap.map((pkg, i) => {
              return (
                <label
                  className="flex justify-between text-sm font-light mb-0.5 cursor-pointer"
                  htmlFor={pkg}
                  key={i}
                >
                  <div>
                    <Field
                      id={pkg}
                      name="checked"
                      type="checkbox"
                      value={pkg}
                    />{' '}
                    <div className="text-text-primary inline-block">{pkg}</div>
                  </div>
                  <div
                    className={`text-xs text-text-primary font-semibold px-2 py-0.5 rounded-md ${
                      values.checked.includes(pkg)
                        ? 'bg-accent'
                        : 'bg-bg-primary'
                    }`}
                  >
                    {depMap[pkg]}
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

export default Dependencies;
