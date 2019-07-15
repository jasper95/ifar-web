import React from 'react';
import { Helmet as Head } from 'react-helmet';
import Page from 'components/Layout/Page';
import JobPosts from 'components/JobPosts';
import { withAuth } from 'apollo/auth';

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


export default withAuth({ requireAuth: 'optional' })(Index);
