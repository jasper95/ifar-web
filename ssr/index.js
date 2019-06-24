import { App } from 'App';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { getMarkupFromTree } from 'react-apollo-hooks';
import initialState from 'apollo/initialState';
import initApollo from 'apollo/initApollo';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { parseCookies } from 'lib/tools';
import serialize from 'serialize-javascript';
import stats from '../build/loadable-stats.json';

function getHtml({
  scripts, content, stylesheets, initialData,
}) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charSet='utf-8' />
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no'
        />
        <meta property='og:image' content='/static/img/logo.png'/>
        <meta property='og:site_name' content='Internlink'/>
        <meta property='og:description' content='Internlink by Jasper Bernales' />
        <meta property='og:locale' content='en_US' />
        <meta name='robots' content='index, follow' />
    
        <meta name='theme-color' content='#000000' />
    
        <link rel='manifest' href='/static/manifest.json'/>
        <link rel='shortcut icon' href='/static/icons/favicon.ico'/>
    
        <link rel='stylesheet' type='text/css' href='/static/css/react-md.indigo-pink.min.css' />
        <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900' rel='stylesheet' />
        <link rel='stylesheet' type='text/css' href='/static/css/materialIcons.css' />
        <link rel='stylesheet' type='text/css' href='/static/css/proxima.css' />
        <link rel='stylesheet' type='text/css' href='/static/css/react-draft-wysiwyg.css' />
        <link rel='stylesheet' type='text/css' href='/static/css/rangeslider.css' />
        ${stylesheets}
        ${initialData}
      </head>
      <body>
        <div id="root">${content}</div>
        ${scripts}
      </body>
    </html>
  `;
}

export default async function serverRender(req, res) {
  const extractor = new ChunkExtractor({ stats, entrypoints: ['main'] });
  const context = { };
  const apollo = initApollo(
    initialState,
    {
      getToken: () => parseCookies(req).token,
    },
  );
  let content;
  try {
    content = await getMarkupFromTree({
      renderFunction: renderToString,
      tree: (
        <ChunkExtractorManager extractor={extractor}>
          <App context={context} location={req.url} apolloClient={apollo} />
        </ChunkExtractorManager>
      ),
    });
  } catch (err) {
    console.log('err', err);
  }
  const initialData = `
    <script>
      window.__APOLLO_STATE__ = ${serialize(apollo.cache.extract(), { isJSON: true })}
    </script>
  `;
  const result = getHtml({
    content,
    scripts: extractor.getScriptTags(),
    stylesheets: extractor.getStyleTags(),
    initialData,
  });
  res.setHeader('Content-Type', 'text/html');
  res.send(result);
}
