import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useCreateLessonMutation } from '👨‍💻generated/graphql';

const CreateLesson = () => {
  const router = useRouter();
  const [createLesson, { data }] = useCreateLessonMutation();

  useEffect(() => {
    async function create() {
      const response = await createLesson({
        variables: { title: 'My Awesome Lesson' },
      });
      const id = response.data?.createLesson.id;
      router.replace(`/lessons/edit/${id}`);
    }

    create();
  }, []);

  // handle
  return null;
};

export default CreateLesson;
