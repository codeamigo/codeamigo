import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';

const ResetPasswordSent: React.FC<Props> = () => {
  return (
    <div className="max-w-lg w-96 mx-auto p-6 lg:px-4">
      <div className="text-lg">💌</div>
      <div className="text-text-primary">
        Password reset link sent to {modalVar().data}
      </div>
    </div>
  );
};

type Props = {};

export default ResetPasswordSent;
