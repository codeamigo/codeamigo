import { useRouter } from 'next/router';
import React from 'react';

import Icon from '👨‍💻components/Icon';
import { LessonQuery } from '👨‍💻generated/graphql';

import Form from './Form';
import View from './View';

const Info: React.FC<Props> = ({ isEditting, ...rest }) => {
  const router = useRouter();

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
      <div className="w-1/4" />
    </div>
  );
};

type Props = {
  isEditting?: boolean;
  lesson: LessonQuery['lesson'];
  toggleShowSteps: () => void;
};

export default Info;
