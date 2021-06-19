import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import {
  emojis,
  encouragementMessages,
  encouragementTitles,
} from '👨‍💻modals/TestsPassed/model';

const TestsPassed: React.FC<Props> = () => {
  const randomN = (n: number) => Math.floor(Math.random() * n);
  const emoji = emojis[randomN(emojis.length)];
  const encouragementTitle =
    encouragementTitles[randomN(encouragementTitles.length)];
  const encouragementMessage =
    encouragementMessages[randomN(encouragementMessages.length)];

  return (
    <div className="max-w-lg mx-auto p-6 lg:px-8">
      <div className="text-3xl">{emoji}</div>
      <div className="text-xl text-text-primary font-semibold">
        {encouragementTitle}
      </div>
      <div className="text-text-primary my-4">{encouragementMessage}</div>
      <Button
        className="h-12 text-lg ml-auto mt-5"
        onClick={() => {
          modalVar().callback();
          modalVar(InitialModalState);
        }}
      >
        Next
      </Button>
    </div>
  );
};

type Props = {};

export default TestsPassed;
