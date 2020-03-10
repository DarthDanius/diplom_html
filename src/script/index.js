'use strict'

// import '@babel/plugin-transform-typeof-symbol';
// import 'babel-polyfill';
// require('whatwg-fetch');
// require('intl');
// require('url-polyfill');
// require('core-js/web/dom-collections');
// require('core-js/es6/map');
// require('core-js/es6/string');
// require('core-js/es6/array');
// require('core-js/es6/object');
// require('../img-sprite-vector/' + name + '.svg');
require.context('../', true, /(?<=img-sprite-vector\/)[^\/]+?.svg/)
import './main.js'
import '../style/index.scss'

