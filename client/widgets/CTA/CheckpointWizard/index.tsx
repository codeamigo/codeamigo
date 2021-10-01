import React from 'react';

import Icon from '👨‍💻components/Icon';

const CheckpointWizard: React.FC<Props> = () => {
  return (
    <div className="opacity-0 invisible mb-1 group-hover:mb-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute left-0 bottom-full bg-bg-nav text-text-primary p-4 rounded-lg md:w-72 md:transform">
      <div
        className="flex items-baseline justify-start cursor-pointer group-inner-1 mb-4"
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
        className="flex items-baseline justify-start cursor-pointer group-inner-1 mb-4"
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
        className="flex items-baseline justify-start cursor-pointer group-inner-1"
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
    </div>
  );
};

type Props = {};

export default CheckpointWizard;
