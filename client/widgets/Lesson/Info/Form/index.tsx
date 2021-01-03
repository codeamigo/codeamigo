import Icon from '@components/Icon';
import { LessonQuery, useUpdateLessonTitleMutation } from '@generated/graphql';
import debounce from 'debounce';
import React from 'react';

const Form: React.FC<Props> = ({ lesson, toggleShowSteps }) => {
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
      className="w-full text-center border-0 focus:ring-0 p-0 text-xl bg-gray-800 text-white"
      defaultValue={lesson?.title}
      maxLength={40}
      name="title"
      onChange={updateLessonTitle}
      placeholder="Lesson title"
      type="text"
    />
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
  toggleShowSteps: () => void;
};

export default Form;
