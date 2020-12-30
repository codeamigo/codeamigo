import { LessonQuery } from '@generated/graphql';
import React from 'react';

import Form from './Form';
import View from './View';

const Info: React.FC<Props> = ({ isEditting, ...rest }) => {
  return isEditting ? <Form {...rest} /> : <View {...rest} />;
};

type Props = {
  isEditting?: boolean;
  lesson: LessonQuery['lesson'];
  toggleShowSteps: () => void;
};

export default Info;
