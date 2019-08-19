import React from 'react';
import { Helmet as Head } from 'react-helmet';

function Index() {
  return (
    <>
      <Head>
        <title>RAMONS</title>
        <meta name="description" content="RAMONS Risk Management" />
      </Head>
      <div className="dbContainer dbContainer-home" />
    </>
  );
}


export default Index;
