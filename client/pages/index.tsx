import { useRouter } from 'next/router';

import { useLessonsQuery } from '../generated/graphql';
import withApollo from '../utils/withApollo';

const Home = () => {
  const { data, error, loading } = useLessonsQuery();
  const router = useRouter();

  if (loading) return <>Loading...</>;
  if (error) return <>Error</>;

  return (
    <div className="container mx-auto p-10">
      <div className="grid grid-cols-4 gap-6">
        {data?.lessons.map((lesson) => {
          return (
            <div
              className="p-3 rounded-lg border-gray-200 border-2 cursor-pointer"
              key={lesson.id}
              onClick={() => router.push(`/lessons/edit/${lesson.id}`)}
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
    </div>
  );
};

export default withApollo({ ssr: true })(Home);
