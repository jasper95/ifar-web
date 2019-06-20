import { App } from 'App';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import path from 'path';
import fs from 'fs';
import template from 'lodash/template';
import templateSettings from 'lodash/templateSettings';

templateSettings.interpolate = / <!--{{([\s\S]+?)}}-->/g;

function getFile({ file, isObject = true }) {
  const response = isObject ? {} : '';
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data = response) => {
      if (err) {
        reject(err);
      }
      resolve(isObject ? JSON.parse(data) : data);
    });
  });
}

function retryPromise(cb, delay = 250) {
  return cb().catch(() => new Promise(() => {
    setTimeout(() => {
      retryPromise(cb);
    }, delay);
  }));
}

function getHtml({ scripts, content, stylesheets }) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta name="title" content="Shopping Cart Fresh Tees">
        <meta name="description" content="Shopping Cart App is an app where you can buy fresh tees by simple drag and dropping items you want!">
        <meta name="keywords" content="shopping cart, drag and drop, fresh tees, t-shirt shopping">
        <meta name="robots" content="index, follow">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="language" content="English">
    
        <link rel="apple-touch-icon" sizes="57x57" href="icons/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="icons/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="icons/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="icons/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="icons/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="icons/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="icons/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="icons/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="icons/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="icons/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">
        <link rel="manifest" href="icons/manifest.json">
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
        <meta name="theme-color" content="#ffffff">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <title>Shopping Cart Fresh Tees</title>
        <link rel="stylesheet" href="css/wataphak.css">
        ${stylesheets}
      </head>
      <body>
        <noscript>
          You need to enable JavaScript to run this app.
        </noscript>
        <div id="root">${content}</div>
        ${scripts}
      </body>
    </html>
  `;
}

export default async function serverRender(req, res) {
  const file = path.join(process.cwd(), 'build/loadable-stats.json');
  const stats = await retryPromise(() => getFile({ file }));
  const extractor = new ChunkExtractor({ stats, entrypoints: ['main'] });
  const context = { };
  const content = renderToString(
    <ChunkExtractorManager extractor={extractor}>
      <App context={context} location={req.path} />
    </ChunkExtractorManager>,
  );
  const result = getHtml({
    content,
    scripts: extractor.getScriptTags(),
    stylesheets: extractor.getStyleTags(),
  });
  res.writeHeader(200, { 'Content-Type': 'text/html' });
  res.write(result);
  res.end();
}
