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
      className="p-0 w-full md:text-center bg-transparent border-0 focus:ring-0 text-text-primary"
      defaultValue={lesson?.title || ''}
      maxLength={90}
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
