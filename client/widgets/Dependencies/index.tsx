import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

import { useDependenciesQuery } from '👨‍💻generated/graphql';

const CODEAMIGO_DEPS = ['codeamigo-jest-lite'];

const Dependencies: React.FC<Props> = () => {
  const { data } = useDependenciesQuery();
  const router = useRouter();

  const queryDeps = router.query.deps as string;
  const filterCodeamigoDeps = data?.dependencies.filter(
    ({ package: pkg }) => !CODEAMIGO_DEPS.includes(pkg)
  );
  const depMap =
    filterCodeamigoDeps?.reduce((acc, curr) => {
      if (acc[curr.package]) {
        acc[curr.package] = acc[curr.package] + 1;
      } else {
        acc[curr.package] = 1;
      }
      return acc;
    }, {} as { [key in string]: number }) || {};
  const sortedDepMap = Object.keys(depMap).sort(
    (a, b) => depMap[b] - depMap[a]
  );

  return (
    <div className="p-2 bg-ternary-bg rounded-md">
      <h4 className="font-semibold mb-2 text-primary">Dependencies</h4>
      <Formik
        initialValues={{
          checked: queryDeps ? queryDeps.split('|') : [],
        }}
        onSubmit={() => Promise.resolve()}
        validate={(values) => {
          router.replace(`/?deps=${values.checked.join('|')}`);
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
                    <div className="text-primary inline-block">{pkg}</div>
                  </div>
                  <div
                    className={`text-xs text-primary-bg font-semibold px-2 py-0.5 rounded-md ${
                      values.checked.includes(pkg)
                        ? 'bg-primary'
                        : 'bg-secondary'
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
