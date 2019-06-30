import { App } from 'App';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { getMarkupFromTree } from 'react-apollo-hooks';
import initialState from 'apollo/initialState';
import initApollo from 'apollo/initApollo';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { parseCookies } from 'lib/tools';
import serialize from 'serialize-javascript';
import stats from '../build/loadable-stats.json';

function getHtml({
  scripts, content, stylesheets, initialData, helmet,
}) {
  return `
    <!DOCTYPE html>
    <html lang='en' dir='ltr' class='interlink'>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
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
    helmet: Helmet.renderStatic(),
  });
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send(result);
}
