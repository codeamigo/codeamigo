import React from 'react';

import { isMobileWarningAcknowledgedVar } from '👨‍💻apollo/cache/lesson';
import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';

const MobileWarning: React.FC<Props> = () => {
  return (
    <div className="mx-auto max-w-lg p-6 lg:px-8">
      <h1 className="mb-1 flex items-center gap-1 text-lg font-semibold text-white sm:text-xl">
        <Icon className="" name="attention" />
        <span>Mobile Browser Not Supported</span>
      </h1>
      <div className="text-xs text-neutral-500">
        Certain features like code highlighting are not supported on mobile
        browsers. However, you can still interact with the Codeamigo Assistant.
        <br />
        <br />
        For the best experience, please consider using a desktop browser.
      </div>
      <div className="mt-4">
        <Button
          onClick={() => {
            modalVar(InitialModalState);
            isMobileWarningAcknowledgedVar(true);
          }}
        >
          <span>Continue Anyway</span>
        </Button>
      </div>
    </div>
  );
};

type Props = {};

export default MobileWarning;
