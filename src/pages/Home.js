import React from 'react';
import { Helmet as Head } from 'react-helmet';
import JobPosts from 'components/JobPosts';

function Index(props) {
  const { user, posts } = props;
  return (
    <>
      <Head>
        <title>Job Search</title>
        <meta name="description" content="description for indexing bots" />
      </Head>
      <div>Welcome</div>
    </>
  );
}


export default Index;
