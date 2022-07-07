import React from 'react';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import {
  LessonQuery,
  useLessonQuery,
  useUpdateLessonStatusMutation,
} from '👨‍💻generated/graphql';
import Label from '👨‍💻widgets/Lesson/Info/LessonOptions/Label';
import Tags from '👨‍💻widgets/Lesson/Info/LessonOptions/Tags';

const LessonOptions: React.FC<Props> = ({
  lessonId,
  setShowOptions,
  showOptions,
}) => {
  const { data } = useLessonQuery({
    variables: { id: lessonId },
  });
  const [updateLessonStatusM] = useUpdateLessonStatusMutation();
  const lesson = data?.lesson;

  if (!lesson) return null;

  let disabledMessage;
  if (!lesson.label) {
    disabledMessage = 'A label is required.';
  }
  if (!lesson.tags || lesson.tags?.length < 1) {
    disabledMessage = 'Please add at least 1 tag.';
  }

  const publishLesson = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    await updateLessonStatusM({
      variables: { id, status: 'PENDING_PUBLISH' },
    });
  };

  return (
    <div className="flex items-center">
      {lesson.status === 'PENDING_PUBLISH' ? (
        <Button className="py-1" disabled offset>
          Awaiting Approval
        </Button>
      ) : (
        <div
          aria-label={disabledMessage}
          className={`${
            !!disabledMessage ? 'hint--no-animate hint--bottom-left' : ''
          }`}
        >
          <Button
            className="py-1"
            disabled={!!disabledMessage}
            nature="secondary"
            onClick={(e) => publishLesson(e, lesson.id)}
          >
            Publish
          </Button>
        </div>
      )}
      <Icon
        className="ml-2 sm:ml-4 text-text-primary"
        name="list-add"
        onClick={() => setShowOptions(!showOptions)}
      />
    </div>
  );
};

export const Options: React.FC<OptionsProps> = (props) => {
  return (
    <div className="flex absolute z-30 gap-6 justify-end py-2 px-4 pr-16 w-full border-b shadow-2xl bg-bg-primary border-bg-nav-offset">
      <Label {...props} />
      <Tags {...props} />
    </div>
  );
};

type Props = {
  lessonId: number;
  setShowOptions: (val: boolean) => void;
  showOptions: boolean;
};

type OptionsProps = {
  lesson: LessonQuery['lesson'];
};

export default LessonOptions;
