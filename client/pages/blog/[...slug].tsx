import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const BlogPost: React.FC<Props> = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.query?.slug?.length) {
      window.location.replace(
        `https://docs.codeamigo.dev/blog/${router.query.slug[0]}`
      );
    }
  }, [router.query.slug]);

  return <div></div>;
};

type Props = {};

export default BlogPost;
