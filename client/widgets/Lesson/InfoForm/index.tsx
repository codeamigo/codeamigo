import debounce from "debounce";
import React from "react";

import { LessonQuery, useUpdateLessonTitleMutation } from "@generated/graphql";
import Icon from "../../../components/Icon";

const InfoForm: React.FC<Props> = ({ lesson }) => {
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
      <Icon name='list' className='text-white cursor-pointer text-xl' />
      <input
        type="text"
        name="title"
        placeholder="Lesson title"
        className="w-full text-center border-0 focus:ring-0 p-0 text-xl bg-gray-800 text-white"
        defaultValue={lesson?.title}
        onChange={updateLessonTitle}
        maxLength={40}
      />
      <div className='bg-green-300 ring-1 ring-green-300 ring-opacity-50 h-2 w-2 rounded-full'></div>
    </div>
  );
};

type Props = {
  lesson: LessonQuery["lesson"];
};

export default InfoForm;
