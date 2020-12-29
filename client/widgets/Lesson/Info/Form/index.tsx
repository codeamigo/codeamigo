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
    <div className="w-full py-2 px-4 flex items-center bg-gray-800">
      <Icon
        className="text-white cursor-pointer text-xl"
        name="list"
        onClick={toggleShowSteps}
      />
      <input
        className="w-full text-center border-0 focus:ring-0 p-0 text-xl bg-gray-800 text-white"
        defaultValue={lesson?.title}
        maxLength={40}
        name="title"
        onChange={updateLessonTitle}
        placeholder="Lesson title"
        type="text"
      />
      <div className="bg-green-300 ring-1 ring-green-300 ring-opacity-50 h-2 w-2 rounded-full"></div>
    </div>
  );
};

type Props = {
  lesson: LessonQuery['lesson'];
  toggleShowSteps: () => void;
};

export default Form;
