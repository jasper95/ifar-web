import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import loadable from '@loadable/component';
import { Helmet as Head } from 'react-helmet';
import { withRouter } from 'react-router';
import flow from 'lodash/flow';
import Snackbar from 'components/Snackbar';
import { useAppData } from 'apollo/appData';
import Footer from './Footer';
import Header from './Header';

const AsyncDialog = loadable(props => import(`components/Dialogs/${props.path}`));

function Page(props) {
  const {
    children,
    hasNavigation, hasFooter,
    pageId, className, pageDescription, router,
  } = props;
  const [appData, setAppData] = useAppData();
  const { toast, dialog } = appData;
  let { pageTitle } = props;
  if (pageTitle) {
    pageTitle = `InternLink - ${pageTitle}`;
  } else {
    pageTitle = 'Internlink';
  }
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta name="Description" content={pageDescription || 'Description here'} />
        <meta name="og:description" content={pageDescription || 'Description here'} />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <meta property="og:image" content="/static/img/logo.png" />
        <meta property="og:site_name" content="Internlink" />
        <meta property="og:locale" content="en_US" />
        <meta name="robots" content="index, follow" />

        <meta name="theme-color" content="#000000" />

        <link rel="manifest" href="/static/manifest.json" />
        <link rel="shortcut icon" href="/static/icons/favicon.ico" />

        <link rel="stylesheet" type="text/css" href="/static/css/react-md.indigo-pink.min.css" />
        {/* {router.asPath !== '/' && (
          <link rel="canonical" href={`${process.env.HOSTNAME}/${router.asPath}`} />
        )} */}
      </Head>
      {hasNavigation && (
        <Header />
      )}
      {toast && (
        <Snackbar
          onClose={() => setAppData({ toast: null })}
          open={!!toast}
          {...toast}
        />
      )}
      {dialog && dialog.path && (
        <AsyncDialog path={dialog.path} {...dialog.prpps} />
      )}
      <main className={`page page-${pageId} ${className}`}>
        {children}
      </main>


      {hasFooter && (
        <Footer />
      )}
    </>
  );
}

const EnhancedPage = flow(withRouter)(Page);

EnhancedPage.defaultProps = {
  hasNavigation: true,
  hasFooter: true,
  pageId: '',
};

export default EnhancedPage;
