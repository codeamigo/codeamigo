import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';

const DonationSuccess: React.FC<Props> = () => {
  return (
    <div className="mx-auto w-96 max-w-lg p-6 lg:px-4">
      <div className="text-3xl">😌</div>
      <div className="text-text-primary text-lg font-semibold">
        No worries! Maybe another time.
      </div>
      <div className="text-text-primary mt-3 text-sm">
        Keep in mind: your contribution helps keep codeamigo free to use for
        everyone.
      </div>
      <Button
        className="mt-6"
        nature="secondary"
        onClick={() => {
          modalVar({ callback: () => null, name: 'donate', persistent: false });
        }}
      >
        Retry
      </Button>
    </div>
  );
};

type Props = {};

export default DonationSuccess;
