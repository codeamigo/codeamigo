import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { statusVar } from '👨‍💻apollo/cache';
import Icon from '👨‍💻components/Icon';
import { LessonQuery } from '👨‍💻generated/graphql';
import UserMenu from '👨‍💻widgets/UserMenu';

import Form from './Form';
import View from './View';

const Info: React.FC<Props> = ({ isEditting, ...rest }) => {
  const router = useRouter();
  const status = useReactiveVar(statusVar);
  const [ping, setPing] = useState(false);

  useEffect(() => {
    setPing(true);

    setTimeout(() => {
      setPing(false);
    }, 1500);
  }, [status.lastSaved]);

  return (
    <div className="w-full py-2 px-4 flex items-center bg-gray-800">
      <div className="flex w-1/4">
        <Icon
          className="text-white cursor-pointer text-xl"
          name="list"
          onClick={rest.toggleShowSteps}
        />
        <Icon
          className="text-white cursor-pointer text-md ml-4"
          name="home"
          onClick={() => router.push('/')}
        />
      </div>
      <div className="w-1/2">
        {isEditting ? <Form {...rest} /> : <View {...rest} />}
      </div>
      <div className="w-1/4 flex justify-end items-center">
        {status.connected ? (
          <div
            aria-label={`Last saved: ${new Date(
              status.lastSaved
            ).toTimeString()}`}
            className="relative flex h-3 w-3 hint--left hint--no-animate"
          >
            {ping && (
              <div className="h-4 w-4 absolute -left-0.5 -top-0.5 inline-flex animate-ping-quick bg-green-400 opacity-50 rounded-full" />
            )}
            <div className="h-full w-full bg-green-400 rounded-full" />
          </div>
        ) : (
          <div className="relative flex h-3 w-3">
            <div className="h-4 w-4 absolute -left-0.5 -top-0.5 inline-flex animate-ping bg-red-600 rounded-full" />
            <div className="h-full w-full bg-red-600 rounded-full" />
          </div>
        )}
        <UserMenu />
      </div>
    </div>
  );
};

type Props = {
  isEditting?: boolean;
  lesson: LessonQuery['lesson'];
  toggleShowSteps: () => void;
};

export default Info;
