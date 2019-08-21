import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import { Helmet as Head } from 'react-helmet';
import flowRight from 'lodash/flowRight';
import Snackbar from 'components/Snackbar';
import { withAuth } from 'apollo/auth';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import DialogTitleWithBack from './DialogTitleWithBack';
import Footer from './Footer';
import Header from './Header';

const AsyncDialog = loadable(props => import(`components/Dialogs/${props.path}`));

const pageSelector = createSelector(
  state => state.toast,
  state => state.dialog,
  state => state.temporaryClosedDialogs,
  (toast, dialog, temporaryClosedDialogs) => ({ toast, dialog, hasTemporaryClosed: temporaryClosedDialogs.length > 0 }),
);

function Page(props) {
  const {
    children,
    hasNavigation, hasFooter,
    pageId, className, pageDescription,
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

        <link rel="apple-touch-icon" sizes="180x180" href="/static/favicons/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#ffc40d"/>
        <meta name="msapplication-TileImage" content="/static/favicons/mstile-144x144.png"/>
        <meta name="theme-color" content="#ffffff"/>

        <link rel="stylesheet" type="text/css" href="/static/css/react-md.indigo-pink.min.css" />
        <link rel="stylesheet" type="text/css" href="/static/css/Draft.css" />
        <link rel="stylesheet" type="text/css" href="/static/css/rafiIcons.css" />
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
        <AsyncDialog
          path={dialog.path}
          {...dialog.props}
          dialogTitleRenderer={appData.hasTemporaryClosed ? DialogTitleWithBack : undefined}
        />
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

const EnhancedPage = flowRight(
  withAuth,
)(Page);

Page.propTypes = {
  pageId: PropTypes.string,
  hasFooter: PropTypes.bool,
  hasNavigation: PropTypes.bool,
};

Page.defaultProps = {
  hasNavigation: true,
  hasFooter: true,
  pageId: '',
};

EnhancedPage.propTypes = Page.propTypes;
EnhancedPage.defaultProps = Page.defaultProps;

export default EnhancedPage;
