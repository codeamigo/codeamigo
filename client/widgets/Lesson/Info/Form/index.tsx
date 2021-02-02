import debounce from 'debounce';
import React from 'react';

import { LessonQuery, useUpdateLessonTitleMutation } from '👨‍💻generated/graphql';

const Form: React.FC<Props> = ({ lesson }) => {
  const [updateLessonTitleM] = useUpdateLessonTitleMutation();

  const updateLessonTitle = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLessonTitleM({
        variables: { id: lesson!.id, title: e.target.value },
      });
    },
    1000
  );

  return (
    <input
      className="w-full text-center border-0 focus:ring-0 p-0 text-xl bg-ternary-bg text-white"
      defaultValue={lesson?.title || ''}
      maxLength={35}
      name="title"
      onChange={updateLessonTitle}
      placeholder="Lesson title"
      type="text"
    />
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
};

export default Form;
