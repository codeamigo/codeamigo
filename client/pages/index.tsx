import Head from 'next/head';

import Dependencies from '👨‍💻widgets/HomepageFilters/Dependencies';
import LanguagesAndTemplates from '👨‍💻widgets/HomepageFilters/LanguagesAndTemplates';
import Levels from '👨‍💻widgets/HomepageFilters/Levels';
import LessonsList from '👨‍💻widgets/LessonsList';

const Home = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:space-x-8">
      <Head>
        <script type="application/javascript">
          {`;(function () {
    window.Zigpoll = {
      accountId: '61903b87a693e36a9327bd62'
    };

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.src = "//cdn.zigpoll.com/static/js/main.js";

    document.head.appendChild(script);
  }());`}
        </script>
      </Head>
      <div className="sm:sticky sm:top-4 mb-4 w-full sm:w-5/12 md:w-1/4 h-full">
        <LanguagesAndTemplates />
        <Dependencies />
        <Levels />
      </div>
      <div className="w-full sm:w-7/12 md:w-3/4">
        <LessonsList />
      </div>
      <div id="zigpoll-embed-target"></div>
    </div>
  );
};

export default Home;
