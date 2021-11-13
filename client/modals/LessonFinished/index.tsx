import React from 'react';

import { InitialModalState, modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';

const LessonFinished: React.FC<Props> = () => {
  return (
    <div className="p-6 lg:px-4 mx-auto w-96 max-w-lg">
      <div className="text-3xl font-bold text-text-primary">🎉 Nice Work!</div>
      <div className="mt-2 text-sm text-text-primary">
        You've just finished <b>{modalVar().data.lessonTitle}</b>.
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-3.5 items-center">
          <a
            aria-label="Talk to us on Discord"
            className="hint--top hint--no-animate"
            href="https://discord.gg/n64Ann2zRc"
            target="_blank"
          >
            <Icon
              className="opacity-80 hover:opacity-100 transition-opacity duration-100 text-text-primary"
              name="discord"
            />
          </a>
          <a
            aria-label="Contribute on GitHub"
            className="hint--top hint--no-animate"
            href="https://github.com/codeamigo/codeamigo"
            target="_blank"
          >
            <Icon
              className="opacity-80 hover:opacity-100 transition-opacity duration-100 text-text-primary"
              name="github"
            />
          </a>
          <a
            aria-label="Share on Twitter"
            className="hint--top hint--no-animate"
            href={`https://twitter.com/intent/tweet?url=https://codeamigo.dev/lessons/${
              modalVar().data.lessonId
            }&text=${encodeURI(
              `🎉 I just finished "${
                modalVar().data.lessonTitle
              }" on @codeamigo_dev!`
            )}`}
            target="_blank"
          >
            <Icon
              className="opacity-80 hover:opacity-100 transition-opacity duration-100 text-text-primary"
              name="twitter"
            />
          </a>
        </div>
        <Button
          nature="secondary"
          onClick={() => {
            modalVar().callback();
            modalVar(InitialModalState);
          }}
        >
          Find Another Lesson
        </Button>
      </div>
    </div>
  );
};

type Props = {};

export default LessonFinished;
