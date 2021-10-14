import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';

const RegisterAfterPreview: React.FC<Props> = () => {
  return (
    <div className="p-6 lg:px-4 mx-auto w-96 max-w-lg">
      <div className="text-3xl">🎉</div>
      <div className="text-xl font-semibold text-text-primary">Nice work!</div>
      <div className="leading-5 text-text-primary">
        If you enjoyed that lesson please consider signing up to save your
        progress.
      </div>
      <div className="flex items-center mt-6">
        <Button
          onClick={() =>
            modalVar({
              callback: modalVar().callback,
              name: 'register',
            })
          }
        >
          Sign Up
        </Button>
        <div className="ml-2 text-sm text-text-primary">
          Follow us on{' '}
          <a
            className="text-accent"
            href="https://twitter.com/codeamigo_dev"
            target="_blank"
          >
            Twitter
          </a>{' '}
        </div>
      </div>
    </div>
  );
};

type Props = {};

export default RegisterAfterPreview;
