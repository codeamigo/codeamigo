import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';

const RegisterAfterPreview: React.FC<Props> = () => {
  return (
    <div className="p-6 lg:px-4 mx-auto w-96 max-w-lg">
      <div className="text-3xl">🎉</div>
      <div className="text-xl font-semibold text-text-primary">Nice work!</div>
      <div className="text-text-primary">
        To continue and save your changes please sign up.
      </div>
      <Button
        className="mt-3"
        onClick={() =>
          modalVar({
            callback: modalVar().callback,
            name: 'register',
          })
        }
      >
        Sign Up
      </Button>
    </div>
  );
};

type Props = {};

export default RegisterAfterPreview;
