const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PATHS = {
	src: path.resolve(__dirname, 'src'),
	dist: path.resolve(__dirname, 'build'),
};

module.exports = {

	externals: {
		paths: PATHS
	},
	
	context: PATHS.src,

  entry: {
    main: './script/index.js',
	},
	
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist'
	},

	plugins: [

		new MiniCssExtractPlugin({
			filename: `[name].css`,
		}),

	],
	
  module: {

    rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/'
			}, 
			
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'style-loader'
					},

					{
						loader: MiniCssExtractPlugin.loader
					},

					{
						loader: 'css-loader',
						options: { sourceMap: true }
					}, 
					
					{
						loader: 'postcss-loader',
						options: { sourceMap: true, config: { path: 'src/js/postcss.config.js' } }
					}, 
					
					{
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			}, 
			
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},

					{
						loader: MiniCssExtractPlugin.loader
					},

					{
						loader: 'css-loader',
						options: { sourceMap: true }
					},

					{
						loader: 'postcss-loader',
						options: { sourceMap: true, config: { path: 'src/js/postcss.config.js' } }
					}

				]
			}
		]
  }
}