import { Field, Form, Formik } from 'formik';
import React, { useRef } from 'react';

import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import Icon from '👨‍💻components/Icon';
import { RegularStepFragment } from '👨‍💻generated/graphql';

const Match: React.FC<Props> = ({ setWizardStep, step }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const files = step?.codeModules?.map(({ name }) => name);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    window.postMessage({ search: ev.target.value });
    setTimeout(() => {
      formRef?.current?.getElementsByTagName('input')[0].focus();
    }, 1);
  };

  return (
    <div className="text-text-primary">
      <div className="flex mb-4">
        <Icon
          className="text-md"
          name="left-bold"
          onClick={() => setWizardStep('select')}
          role="button"
        />
      </div>
      <div className="flex">
        <Icon className="text-lg block mr-2" name="regexicon" />
        <h3 className="text-lg font-bold">Match</h3>
      </div>
      <Formik
        initialValues={{ regex: '' }}
        onSubmit={() => console.log('todo')}
      >
        {({ values }) => (
          <>
            <Form ref={formRef}>
              <div className="mt-2 mb-1">
                In which file should the regex be checked?
              </div>
              <Field
                as="select"
                className="text-black rounded-lg text-sm w-full"
                name="color"
              >
                {step?.codeModules?.map(({ id, name }) => {
                  return <option value={id}>{name}</option>;
                })}
              </Field>
              <div className="mt-3 mb-1">
                Enter a regular expression below to match your student's desired
                input.
              </div>
              <InputField
                className="text-black"
                label=""
                name="regex"
                onChangeCapture={handleChange}
                type="text"
              />
              <div className="text-xs mt-1">Regex: /{values.regex}/g</div>
              <div className="flex justify-end mt-2">
                <Button type="submit">Submit</Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

type Props = {
  setWizardStep: React.Dispatch<
    React.SetStateAction<'jest' | 'match' | 'output' | 'select'>
  >;
  step: RegularStepFragment;
};

export default Match;
