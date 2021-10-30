import withApollo from '👨‍💻utils/withApollo';
import Dependencies from '👨‍💻widgets/HomepageFilters/Dependencies';
import Languages from '👨‍💻widgets/HomepageFilters/Languages';
import Levels from '👨‍💻widgets/HomepageFilters/Levels';
import LessonsList from '👨‍💻widgets/LessonsList';

const Home = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:space-x-8">
      <div className="mb-4 w-full sm:w-1/4">
        <Languages />
        <Dependencies />
        <Levels />
      </div>
      <div className="w-full sm:w-3/4">
        <LessonsList />
      </div>
    </div>
  );
};

export default withApollo({ ssr: true })(Home);
