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
    <div className="p-6 lg:px-4 mx-auto w-96 max-w-lg">
      <div className="text-3xl">{emoji}</div>
      <div className="text-xl font-semibold text-text-primary">
        {encouragementTitle}
      </div>
      <div className="my-4 text-text-primary">{encouragementMessage}</div>
      <Button
        className="mt-5 ml-auto h-12 text-lg"
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
