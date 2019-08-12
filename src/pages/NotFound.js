import React from 'react';
import { Helmet as Head } from 'react-helmet';

function NotFound(props) {
  const { user, posts } = props;
  return (
    <>
      <Head>
        <title>Page Not Found</title>
        <meta name="description" content="description for indexing bots" />
      </Head>
      <div className="dbContainer dbContainer-notFound">
        <div className="notFound">
          <div className="notFound_container">
            <h1 className="notFound_errCode">
              404
            </h1>
            <h2 className="notFound_header">
              This page is lost
            </h2>
            <p className="notFound_desc">
              The page you're looking for isn't available.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


export default NotFound;
