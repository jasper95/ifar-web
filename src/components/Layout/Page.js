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
  // const [appData, setAppData] = useAppData();
  const appData = {};
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
        <meta name="og:description" content={pageDescription || 'Description here'} />
        {/* {router.asPath !== '/' && (
          <link rel="canonical" href={`${process.env.HOSTNAME}/${router.asPath}`} />
        )} */}
      </Head>
      {hasNavigation && (
        <Header />
      )}
      {toast && (
        <Snackbar
          onClose={() => setAppData('toast', null)}
          open={!!toast}
          {...toast}
        />
      )}
      {dialog && dialog.path && (
        <AsyncDialog path={dialog.path} {...dialog.prpps} />
      )}
      {/* {Dialog && (
        <Dialog {...dialog.props} />
      )} */}

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
