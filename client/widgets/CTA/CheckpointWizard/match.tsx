import { Field, Form, Formik } from 'formik';
import React from 'react';

import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import Icon from '👨‍💻components/Icon';
import { RegularStepFragment } from '👨‍💻generated/graphql';

const Match: React.FC<Props> = ({ selectFile, setWizardStep, step }) => {
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    selectFile && selectFile(ev.target.value);
  };

  const handleRegexChange: React.ChangeEventHandler<HTMLInputElement> = (
    ev
  ) => {
    window.postMessage({ search: ev.target.value });
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
            <Form>
              <div className="mt-2 mb-1">
                In which file should the regex be checked?
              </div>
              <Field
                as="select"
                className="text-black rounded-lg text-sm w-full"
                name="color"
                onChangeCapture={handleFileChange}
              >
                {step?.codeModules
                  ?.filter(({ name }) => name && name[name.length - 1] !== '/')
                  .map(({ id, name }) => {
                    return <option value={name!}>{name?.substr(1)}</option>;
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
                onChangeCapture={handleRegexChange}
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
  selectFile?: React.Dispatch<React.SetStateAction<string | null>>;
  setWizardStep: React.Dispatch<
    React.SetStateAction<'jest' | 'match' | 'output' | 'select'>
  >;
  step: RegularStepFragment;
};

export default Match;
