import withApollo from '👨‍💻utils/withApollo';
import Dependencies from '👨‍💻widgets/Dependencies';
import Lessons from '👨‍💻widgets/Lessons';

const Home = () => {
  return (
    <div className="flex space-x-8">
      <div className="w-1/4">
        <Dependencies />
      </div>
      <div className="w-3/4">
        <Lessons />
      </div>
    </div>
  );
};

export default withApollo({ ssr: true })(Home);
