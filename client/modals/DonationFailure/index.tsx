import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';

const DonationSuccess: React.FC<Props> = () => {
  return (
    <div className="p-6 lg:px-4 mx-auto w-96 max-w-lg">
      <div className="text-3xl">😌</div>
      <div className="text-lg font-semibold text-text-primary">
        No worries! Maybe another time.
      </div>
      <div className="mt-3 text-sm text-text-primary">
        Keep in mind: your contribution helps keep codeamigo free to use for
        everyone.
      </div>
      <Button
        nature="secondary"
        onClick={() => {
          modalVar({ callback: () => null, name: 'donate' });
        }}
      >
        Retry
      </Button>
    </div>
  );
};

type Props = {};

export default DonationSuccess;
