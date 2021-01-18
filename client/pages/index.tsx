import { useRouter } from 'next/router';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import { useLessonsQuery, useMeQuery } from '👨‍💻generated/graphql';
import withApollo from '👨‍💻utils/withApollo';

const Home = () => {
  const { data: meData } = useMeQuery();
  const { data } = useLessonsQuery();
  const router = useRouter();

  const handleClick = (id: number) => {
    if (meData?.me?.isAuthenticated) {
      router.push(`/lessons/start/${id}`);
    } else {
      modalVar({
        callback: () => router.push(`/lessons/start/${id}`),
        name: 'login',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {data?.lessons.map((lesson) => {
        return (
          <div
            className="p-3 rounded-lg border-gray-200 border cursor-pointer"
            key={lesson.id}
            onClick={() => handleClick(lesson.id)}
          >
            <h2 className="text-md">{lesson.title}</h2>
            <h3 className="text-xs">By: {lesson.owner.username}</h3>
            <div className="flex justify-between mt-4 text-xs">
              <div className="grid grid-cols-2 gap-1">
                <div className="grid grid-cols-2 gap-0.5">
                  <Icon className="text-gray-500" name="users" />{' '}
                  <div>{lesson.students?.length}</div>
                </div>
                <div className="grid grid-cols-2 gap-0.5">
                  <Icon className="text-gray-500" name="heart" />{' '}
                  <div>{lesson.likes || 0}</div>
                </div>
              </div>
              <div>{new Date(parseInt(lesson.createdAt)).toDateString()}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default withApollo({ ssr: true })(Home);
