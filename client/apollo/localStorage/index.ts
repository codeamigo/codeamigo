export const LESSONS_STORAGE_KEY = 'codeamigo-active-lessons';
export const DONATIONS_KEY = 'codeamigo-donations';

export interface LocalStorageLesson {
  currentStepId?: number;
  id: number;
}

export interface DonationsItem {
  dontAskAgain: boolean;
  hasDonated: boolean;
  lastSeenModal: number;
}

export const setLessonsItem = () => {
  localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify([]));
};

export const getOrSetLessonsItem = (): string => {
  if (localStorage.getItem(LESSONS_STORAGE_KEY)) {
    return localStorage.getItem(LESSONS_STORAGE_KEY) as string;
  } else {
    setLessonsItem();
    return getOrSetLessonsItem();
  }
};

export const removeLessonItem = (id: number) => {
  const oldLessons = JSON.parse(
    getOrSetLessonsItem()
  ) as Array<LocalStorageLesson>;

  const newLessons = oldLessons.filter(({ id: lessonId }) => lessonId !== id);

  localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(newLessons));
};

export const setLessonItem = (id: number, currentStepId?: number) => {
  let newLessons: Array<LocalStorageLesson> = [];
  const oldLessons = JSON.parse(
    getOrSetLessonsItem()
  ) as Array<LocalStorageLesson>;
  const lesson = oldLessons.find((lesson) => lesson.id === id);

  if (lesson) {
    newLessons = oldLessons.reduce((acc, lesson) => {
      if (lesson.id === id) {
        acc.push({
          currentStepId,
          id,
        });
      } else {
        acc.push(lesson);
      }
      return acc;
    }, [] as Array<LocalStorageLesson>);
  } else {
    newLessons = [...oldLessons, { currentStepId, id }];
  }

  localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(newLessons));
};

export const getLessonItem = (id: number): LocalStorageLesson => {
  const lessons = JSON.parse(
    getOrSetLessonsItem()
  ) as Array<LocalStorageLesson>;
  let lesson = lessons.find((lesson) => lesson.id === id);

  if (lesson) return lesson;
  else setLessonItem(id);

  return getLessonItem(id);
};

export const getLessonCurrentStepId = (id: number): number => {
  const lesson = getLessonItem(id);
  return lesson.currentStepId || 0;
};

export const setDonations = ({ ...args }: DonationsItem) => {
  localStorage.setItem(DONATIONS_KEY, JSON.stringify(args));
};

export const getDonations = (): DonationsItem => {
  if (localStorage.getItem(DONATIONS_KEY)) {
    return JSON.parse(localStorage.getItem(DONATIONS_KEY) as string);
  } else {
    setDonations({
      dontAskAgain: false,
      hasDonated: false,
      lastSeenModal: new Date().getTime(),
    });
    return getDonations();
  }
};
