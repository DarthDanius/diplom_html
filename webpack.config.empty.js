const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base.js');

const webpackConfigBuild = merge(webpackConfigBase, {

});

module.exports = new Promise((resolve, reject) => {
  resolve(webpackConfigBuild);
  reject => console.error(reject("ERROR"));
  
});