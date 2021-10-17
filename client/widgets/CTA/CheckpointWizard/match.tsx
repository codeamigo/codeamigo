import { Field, Form, Formik } from 'formik';
import React, { KeyboardEventHandler } from 'react';

import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import Icon from '👨‍💻components/Icon';
import {
  RegularStepFragment,
  useCreateMatchCheckpointMutation,
} from '👨‍💻generated/graphql';

const Match: React.FC<Props> = ({ selectFile, setWizardStep, step }) => {
  const [createMatchCheckpointM] = useCreateMatchCheckpointMutation();
  const createMatchCheckpoint = async (values: {
    file: string;
    regex: string;
  }) => {
    await createMatchCheckpointM({
      refetchQueries: ['Checkpoints', 'Step'],
      variables: {
        fileToMatchRegex: values.file,
        matchRegex: values.regex,
        stepId: step.id,
      },
    });

    setWizardStep('select');
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    selectFile && selectFile(ev.target.value);
  };

  const handleRegexChange: React.ChangeEventHandler<HTMLInputElement> = (
    ev
  ) => {
    console.log(ev.target.value.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'));
    console.log(ev.target);
    window.postMessage({ regex: ev.target.value }, '*');
  };

  const handleKeyDown = (
    keyEvent: React.KeyboardEvent<HTMLFormElement>,
    submitForm: () => Promise<void>
  ) => {
    if (keyEvent.keyCode === 13 && keyEvent.shiftKey) {
      submitForm();
    }
  };

  return (
    <div className="text-text-primary">
      <div className="flex">
        <Icon className="block mr-2 text-lg" name="regexicon" />
        <h3 className="text-lg font-bold">Match</h3>
      </div>
      <Formik
        initialValues={{
          file: step.codeModules?.find(({ isEntry }) => !!isEntry)
            ?.name as string,
          regex: '',
        }}
        onSubmit={createMatchCheckpoint}
        validate={(values) => {
          const errors = {};
          try {
            new RegExp(`/${values.regex}/`).test;
          } catch (e) {
            // @ts-ignore
            errors.regex = 'Invalid regex';
          }

          return errors;
        }}
      >
        {({ isSubmitting, isValid, submitForm, values }) => (
          <>
            <Form onKeyDown={(ev) => handleKeyDown(ev, submitForm)}>
              <div className="mt-2 mb-1">Select a file</div>
              <Field
                as="select"
                className="w-full text-sm text-black rounded-lg"
                name="file"
                onChangeCapture={handleFileChange}
              >
                {step?.codeModules
                  ?.filter(({ name }) => name && name[name.length - 1] !== '/')
                  ?.filter(({ name }) => name && !name.includes('spec'))
                  .map(({ name }) => (
                    <option key={name} value={name!}>
                      {name?.substr(1)}
                    </option>
                  ))}
              </Field>
              <div className="mt-3 mb-1">
                Enter a regular expression to match
              </div>
              <InputField
                className="text-black"
                component={'textarea'}
                label=""
                name="regex"
                onChangeCapture={handleRegexChange}
                required
                style={{ resize: 'none' }}
                type="textarea"
              />
              <div className="mt-1 text-xs">Regex: /{values.regex}/g</div>
              <div className="flex items-center mt-2">
                <Icon
                  className="mr-4 text-base"
                  name="left-bold"
                  onClick={() => setWizardStep('select')}
                  role="button"
                />
                <Button disabled={!isValid || isSubmitting} type="submit">
                  Submit
                </Button>
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
