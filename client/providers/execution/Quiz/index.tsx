import { SandpackStack } from '@codesandbox/sandpack-react';
import { FCProviderType } from 'providers/execution/types';
import React from 'react';

import { Step, useMultipleChoiceQuizQuestionsQuery } from '👨‍💻generated/graphql';

const QuizExecutionProvider: React.FC<{ step: Step }> = ({ step }) => {
  const quizQuestions = useMultipleChoiceQuizQuestionsQuery({
    variables: {
      stepId: step.id,
    },
  });

  if (quizQuestions.loading) return <div>Loading...</div>;

  return <div>{JSON.stringify(quizQuestions.data)}</div>;
};

export default QuizExecutionProvider;
