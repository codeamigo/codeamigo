import React, { useEffect } from 'react';

import { setDonations } from '👨‍💻apollo/localStorage';

const DonationSuccess: React.FC<Props> = () => {
  useEffect(() => {
    setDonations({
      dontAskAgain: true,
      hasDonated: true,
      lastSeenModal: new Date().getTime(),
    });
  });

  return (
    <div className="p-6 lg:px-4 mx-auto w-96 max-w-lg">
      <div className="text-3xl">🎉</div>
      <div className="text-lg font-semibold text-text-primary">
        Thank you for your contribution!
      </div>
      <div className="mt-3 text-sm text-text-primary">
        Your contribution helps keep codeamigo free for everyone to use.
      </div>
    </div>
  );
};

type Props = {};

export default DonationSuccess;
