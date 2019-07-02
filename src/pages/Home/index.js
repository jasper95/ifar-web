import React from 'react';
import { Helmet as Head } from 'react-helmet';
import Page from 'components/Layout/Page';
import JobPosts from 'components/JobPosts';

function Index(props) {
  const { user, posts } = props;
  return (
    <Page>
      <Head>
        <title>Job Search</title>
        <meta name="description" content="description for indexing bots" />
      </Head>
      <JobPosts posts={[]} isAdmin={user && user.role === 'ADMIN'} />
    </Page>
  );
}


export default Index;
