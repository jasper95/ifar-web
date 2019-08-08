import { App } from 'App';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { getMarkupFromTree } from '@apollo/react-hooks';
import initApollo from 'apollo/initApollo';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { parseCookies } from 'lib/tools';
import configureStore from 'lib/configureStore';
import serialize from 'serialize-javascript';
import stats from '../build/loadable-stats.json';

function getHtml({
  scripts, content, stylesheets, initialData, helmet,
}) {
  return `
    <!DOCTYPE html>
    <html lang='en' dir='ltr' class='rafi'>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${stylesheets}
      </head>
      <body>
        <div id="root">${content}</div>
        ${initialData}
        ${scripts}
      </body>
    </html>
  `;
}

export default async function serverRender(req, res) {
  const extractor = new ChunkExtractor({ stats, entrypoints: ['main'] });
  const context = { };
  const initOptions = {
    getToken: () => parseCookies(req).token,
  };
  const apollo = initApollo(
    {},
    initOptions,
  );
  let content;
  const store = configureStore(initOptions);
  try {
    content = await getMarkupFromTree({
      renderFunction: renderToString,
      tree: (
        <ChunkExtractorManager extractor={extractor}>
          <App context={context} store={store} location={req.url} apolloClient={apollo} />
        </ChunkExtractorManager>
      ),
    });
  } catch (err) {
    console.log('err', err);
  }
  if (context.url) {
    res.writeHead(302, {
      Location: context.url,
    });
    return res.end();
  }
  const initialData = `
    <script>window.__APOLLO_STATE__ = ${serialize(apollo.cache.extract(), { isJSON: true })}</script>
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
  return res.send(result);
}
