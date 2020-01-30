import fs from 'fs';
import path from 'path';
import { html } from 'common-tags';
import serialize from 'serialize-javascript';

// Match main.asdf123.js in production mode or bundle.js in dev mode
const mainCssBundleRegex = /(main)\.(?:.*\.)?css$/;
const mainBundleRegex = /(chunk)\.(?:.*\.)?js$/;

let bundlesCss;
try {
	bundlesCss = fs.readdirSync(
		process.env.NODE_ENV === 'production' ? './build/static/css' : path.join(__dirname, '../../build/static/css')
	);
} catch (err) {
	console.error(err);
	throw new Error(
		'It looks like you didn\'t run "yarn run dev:web" or "yarn run build:web" before starting render. Please wait until either of them completes before starting render.'
	);
}
let bundles;
try {
	bundles = fs.readdirSync(process.env.NODE_ENV === 'production' ? './build/static/js' : path.join(__dirname, '../../build/static/js'));
} catch (err) {
	console.error(err);
	throw new Error(
		'It looks like you didn\'t run "yarn run dev:web" or "yarn run build:web" before starting render. Please wait until either of them completes before starting render.'
	);
}

// Get the main bundle filename
const mainCssBundle = bundlesCss.find(bundle => mainCssBundleRegex.test(bundle));
const mainBundle = bundles.find(bundle => mainBundleRegex.test(bundle));

if (!mainCssBundle || !mainBundle) {
	throw new Error(
		'It looks like you didn\'t run "yarn run dev:web" or "yarn run build:web" before starting render. Please wait until either of them completes before starting render.'
	);
}

export const createLinkTag = ({ href }) => `<link href="${href}" rel="stylesheet">`;
export const createScriptTag = ({ src }) => `<script defer="defer" src="${src}"></script>`;

export const getHeader = ({ metaTags, nonce }) => {
	// prettier-ignore
	return html`
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <noscript id="jss-insertion-point"></noscript>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#000000">
        <link rel="manifest" href="/manifest.json">
        ${metaTags}
        ${createLinkTag({ href: `/static/css/${mainCssBundle}` })}
      </head>
      <body>
        <div id="root">`;
};

export const getFooter = ({ data, nonce }) => {
	return html`</div>
      <script nonce="${nonce}">window.__DATA__=${serialize(data)}</script>
      <script defer="defer" type="text/javascript" src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.find,Symbol.iterator"></script>
      ${createScriptTag({ src: `/static/js/${mainBundle}` })}
    </body>
    </html>
  `;
};
