import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import loadable from '@loadable/component';
import { Helmet as Head } from 'react-helmet';
import { withRouter } from 'react-router';
import flow from 'lodash/flow';
import Snackbar from 'components/Snackbar';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import Footer from './Footer';
import Header from './Header';

const AsyncDialog = loadable(props => import(`components/Dialogs/${props.path}`));
const pageSelector = createSelector(
  state => state.toast,
  state => state.dialog,
  (toast, dialog) => ({ toast, dialog }),
);
function Page(props) {
  const {
    children,
    hasNavigation, hasFooter,
    pageId, className, pageDescription, router,
    isDashboard = false
  } = props;
  const appData = useSelector(pageSelector);
  const dispatch = useDispatch();
  const { toast, dialog } = appData;
  let { pageTitle } = props;
  if (pageTitle) {
    pageTitle = `RAFI - ${pageTitle}`;
  } else {
    pageTitle = 'RAFI';
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
      </Head>
      {hasNavigation && (
        <Header />
      )}
      {toast && (
        <Snackbar
          onClose={() => dispatch({ type: 'HIDE_NOTIFICATION' })}
          open={!!toast}
          {...toast}
        />
      )}
      {dialog && dialog.path && (
        <AsyncDialog path={dialog.path} {...dialog.props} />
      )}
      <main className={`page page-${pageId} ${className}`}>
        { isDashboard 
          ? ( <div className='dbContainer'> {children} </div> )
          : children
        }
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
