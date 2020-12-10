import Head from "next/head";
import { usePostsQuery } from "../generated/graphql";
import withApollo from "../utils/withApollo";

const Home = () => {
  const { loading, error, data } = usePostsQuery();

  if (loading) return <>Loading...</>;
  if (error) return <>Error</>;

  return (
    <div>
      {data?.posts.map((post) => {
        return <div key={post.id}>{post.title}</div>;
      })}
    </div>
  );
}

export default withApollo({ ssr: true })(Home);
