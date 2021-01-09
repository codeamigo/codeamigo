import { useRouter } from 'next/router';

import { useLessonsQuery, useMeQuery } from '../generated/graphql';
import { useGlobalState } from '../state';
import { useApp } from '../state2';
import withApollo from '../utils/withApollo';

const Home = () => {
  const { actions } = useApp();
  const [user] = useGlobalState('user');
  const { data, error, loading } = useLessonsQuery();
  const router = useRouter();

  const handleClick = (id: number) => {
    if (user.data?.me) {
      router.push(`/lessons/start/${id}`);
    } else {
      actions.modal.setModal({
        callback: () => router.push(`/lessons/start/${id}`),
        name: 'login',
      });
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      {data?.lessons.map((lesson) => {
        return (
          <div
            className="p-3 rounded-lg border-gray-200 border-2 cursor-pointer"
            key={lesson.id}
            onClick={() => handleClick(lesson.id)}
          >
            <h2 className="text-xl">{lesson.title}</h2>
            <h3 className="text-xs">By: {lesson.owner.username}</h3>
            {/* <div className="text-base mt-4 leading-tight">{lesson.description}</div> */}
            <h6 className="text-xs mt-4">
              {new Date(parseInt(lesson.createdAt)).toLocaleDateString()}
            </h6>
          </div>
        );
      })}
    </div>
  );
};

export default withApollo({ ssr: true })(Home);
