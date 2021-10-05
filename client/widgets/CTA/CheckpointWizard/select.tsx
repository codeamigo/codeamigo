import React from 'react';

import Icon from '👨‍💻components/Icon';
import {
  RegularStepFragment,
  StepExecutionTypeEnum,
} from '👨‍💻generated/graphql';

const Select: React.FC<Props> = ({ setWizardStep, step }) => {
  return (
    <>
      <div
        className="flex items-baseline justify-start cursor-pointer group-inner-1 mb-4"
        onClick={() => setWizardStep('match')}
        role="button"
      >
        <div>
          <Icon className="text-text-primary text-lg" name="regexicon" />
        </div>
        <div className="text-text-primary ml-3">
          <div className="flex items-center">
            <h3 className="font-bold text-lg">Match</h3>
            <Icon
              className="text-lg ml-2 opacity-0 group-inner-1-hover:opacity-100 transition-all duration-200"
              name="right-bold"
            />
          </div>
          <div>
            Create a regular expression to match against the user's code.
          </div>
        </div>
      </div>
      <div
        className={`flex items-baseline justify-start group-inner-1 ${
          step.executionType === StepExecutionTypeEnum.Sandpack
            ? 'hidden'
            : 'block'
        }`}
        onClick={() => setWizardStep('output')}
        role="button"
      >
        <div>
          <Icon className="text-text-primary text-lg" name="terminal" />
        </div>
        <div className="text-text-primary ml-3">
          <div className="flex items-center">
            <h3 className="font-bold text-lg">Output</h3>
            <Icon
              className="text-lg ml-2 opacity-0 group-inner-1-hover:opacity-100 transition-all duration-100"
              name="right-bold"
            />
          </div>
          <div>Check that the user's output is correct.</div>
        </div>
      </div>
      <div
        aria-label="no"
        className={`flex items-baseline justify-start group-inner-1 ${
          step.executionType === StepExecutionTypeEnum.Riju ? 'hidden' : 'block'
        }`}
        onClick={() => setWizardStep('jest')}
        role="button"
      >
        <div>
          <Icon className="text-text-primary text-lg" name="jest" />
        </div>
        <div className="text-text-primary ml-3">
          <div className="flex items-center">
            <h3 className="font-bold text-lg">Jest</h3>
            <Icon
              className="text-lg ml-2 opacity-0 group-inner-1-hover:opacity-100 transition-all duration-200"
              name="right-bold"
            />
          </div>
          <div>Write a unit test using the Jest framework.</div>
        </div>
      </div>
    </>
  );
};

type Props = {
  setWizardStep: React.Dispatch<
    React.SetStateAction<'jest' | 'match' | 'output' | 'select'>
  >;
  step: RegularStepFragment;
};

export default Select;
