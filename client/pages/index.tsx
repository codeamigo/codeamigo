import Dependencies from '👨‍💻widgets/HomepageFilters/Dependencies';
import LanguagesAndTemplates from '👨‍💻widgets/HomepageFilters/LanguagesAndTemplates';
import Levels from '👨‍💻widgets/HomepageFilters/Levels';
import LessonsList from '👨‍💻widgets/LessonsList';

const Home = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:space-x-8">
      <div className="sm:sticky sm:top-4 mb-4 w-full sm:w-5/12 md:w-1/4 h-full">
        <LanguagesAndTemplates />
        <Dependencies />
        <Levels />
      </div>
      <div className="w-full sm:w-7/12 md:w-3/4">
        <LessonsList />
      </div>
    </div>
  );
};

export default Home;
