import debounce from "debounce";
import React from "react";
import {
  LessonQuery,
  useUpdateLessonDescriptionMutation,
  useUpdateLessonTitleMutation,
} from "../../../generated/graphql";

const InfoForm: React.FC<Props> = ({ lesson }) => {
  const [updateLessonDescriptionM] = useUpdateLessonDescriptionMutation();
  const [updateLessonTitleM] = useUpdateLessonTitleMutation();

  const updateLessonTitle = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLessonTitleM({
        variables: { id: lesson!.id, title: e.target.value },
      });
    },
    1000
  );

  const updateLessonDescription = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLessonDescriptionM({
        variables: { id: lesson!.id, description: e.target.value },
      });
    },
    1000
  );

  return (
    <div className="px-4 py-5 bg-white sm:p-6 w-1/2">
      <div className="grid gap-2">
        <input
          type="text"
          name="title"
          placeholder="Lesson title"
          className="border-0 focus:ring-0 p-0 text-2xl"
          defaultValue={lesson?.title}
          onChange={updateLessonTitle}
        />
        <input
          name="description"
          type="text"
          placeholder="Add a description"
          className="border-0 focus:ring-0 p-0 text-lg"
          defaultValue={lesson?.description || ''}
          onChange={updateLessonDescription}
        />
      </div>
    </div>
  );
};

type Props = {
  lesson: LessonQuery["lesson"];
};

export default InfoForm;
