const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
console.log(webpackConfigBase.externals.paths.dist);
console.log(path.normalize(webpackConfigBase.externals.paths.dist));


const webpackConfigDev = merge(webpackConfigBase, {

	// mode: 'development',
	mode: 'production',

	devServer: {
		port: 8080,
		// port: 1234,
		overlay: {
			warning: true,
			errors: true
		},
		hot: true,
		contentBase: path.normalize(webpackConfigBase.externals.paths.dist),
	},

	// watch: true,
	watchOptions: {
		aggregateTimeout: 100
	},
	
	// devtool: 'inline-source-map',
	devtool: 'eval',
	
	plugins: [
		new webpack.SourceMapDevToolPlugin({
			filename: '[file].map',
		})
	]
	
});

module.exports = new Promise((resolve, reject) => {
	resolve(webpackConfigDev);
	reject => console.error(reject("ошибка"));
});

// console.log("webpackConfigDev");
// console.log(webpackConfigDev);
// console.log(`devServer.contentBase = ${webpackConfigDev.devServer.contentBase}`);
// console.log(`devServer.publicPath = ${webpackConfigDev.devServer.publicPath}`);