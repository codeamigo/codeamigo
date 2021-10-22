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
        className="flex justify-start items-baseline mb-4 cursor-pointer group-inner-1"
        onClick={() => setWizardStep('match')}
        role="button"
      >
        <div>
          <Icon className="text-lg text-text-primary" name="regexicon" />
        </div>
        <div className="ml-3 text-text-primary">
          <div className="flex items-center">
            <h3 className="text-lg font-bold">Match</h3>
            <Icon
              className="ml-2 text-lg opacity-0 group-inner-1-hover:opacity-100 transition-all duration-200"
              name="right-bold"
            />
          </div>
          <div>
            Create a regular expression to match against the user's code.
          </div>
        </div>
      </div>
      {/* <div
        className={`flex opacity-50 hint--right hint--no-animate items-baseline justify-start group-inner-1 cursor-not-allowed pointer-events-none ${
          step.executionType === StepExecutionTypeEnum.Sandpack
            ? 'hidden'
            : 'block'
        }`}
        onClick={() => setWizardStep('output')}
        role="button"
      >
        <div>
          <Icon className="text-lg text-text-primary" name="terminal" />
        </div>
        <div className="ml-3 text-text-primary">
          <div className="flex items-center">
            <h3 className="text-lg font-bold">Output</h3>
            <Icon
              className="ml-2 text-lg opacity-0 group-inner-1-hover:opacity-100 transition-all duration-100"
              name="right-bold"
            />
          </div>
          <div>Check that the user's output is correct.</div>
        </div>
      </div> */}
      <div
        aria-label="no"
        className={`flex items-baseline justify-start group-inner-1 ${
          step.executionType === StepExecutionTypeEnum.Riju ? 'hidden' : 'block'
        }`}
        onClick={() => setWizardStep('jest')}
        role="button"
      >
        <div>
          <Icon className="text-lg text-text-primary" name="jest" />
        </div>
        <div className="ml-3 text-text-primary">
          <div className="flex items-center">
            <h3 className="text-lg font-bold">Jest</h3>
            <Icon
              className="ml-2 text-lg opacity-0 group-inner-1-hover:opacity-100 transition-all duration-200"
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
