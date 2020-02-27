const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NODE_ENV = JSON.stringify(process.env.NODE_ENV);
console.log('NODE_ENV: ' + NODE_ENV);
const PATHS = {
	src: path.resolve(__dirname, 'src'),
	dist: path.resolve(__dirname, 'build'),
};
console.log(PATHS)
module.exports = {

	mode: 'production',
	
	externals: {
		paths: PATHS
	},
	
	context: PATHS.src,
	entry: {
		main: './script/index.js',
	},

	output: {
		path: PATHS.dist,
		filename: `script/[name].js`,
		publicPath: '/',
		// publicPath: 'http://0.0.0.0:8080/',
		library: 'webpackVariable'
	},
	
	plugins: [
		new webpack.DefinePlugin({
			NODE_ENV: NODE_ENV
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			jquery: 'jquery',
		}),
		new HtmlWebpackPlugin({
			hash: false,
			template: `${PATHS.src}/index.html`,
			filename: './index.html'
		}),
		// new MiniCssExtractPlugin({
		// 	filename: `style/[name].css`,
		// }),
	],
	
	module: {
		rules: [

			// { 
			// 	test: /\.html$/,
			// 	use: [
			// 		{
			// 			// Передаем результат в bemdecl-to-fs-loader
			// 			loader: 'bemdecl-to-fs-loader',
			// 			// Указываем уровни переопределения и расширения технологий
			// 			options: { levels: ['desktop'], extensions: ['css', 'js'] }
			// 		},
			// 		// Для начала передаем файл в html2bemdecl-loader
			// 		{ loader: 'html2bemdecl-loader' }
			// 	] 
			// },
			
			// {
			// 	test: /\.(png|jpe?g|gif|eot|ttf|woff|woff2)$/i,
			// 	loader: 'url-loader',
			// 	options: {
			// 		limit: 8192,
			// 		name: '[path][name].[ext]'
			// 	},
			// },
			
			{
				test: /\.(png|jpg|ttf|eot|woff|woff2)$/,
				use: [{
					loader: 'file-loader',
					options: {name: '[path][name].[ext]'}
				}]
			},

			{
				test: /\.svg$/,
				loader: 'svg-inline-loader'
			},

			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {presets: ['@babel/preset-env']}
					// options: {presets: ["latest"]}
				}
			},
			
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					
					{loader: 'style-loader',
						options: {
							// injectType: 'linkTag',
							// sourceMap: true
						}
					},

					// {loader: MiniCssExtractPlugin.loader,
					// 	options: {
					// 		publicPath: './build/style',
					// 	},
					// },

					{loader: 'css-loader',
						options: {
							'url': false,
						}
					},

					{loader: 'postcss-loader',
						options: {sourceMap: true}
					},

					{loader: 'sass-loader'},

					{loader: 'stylefmt-loader',
						options: {}
					},
				]
			},
		],
	},

};


// console.log(`mode = ${module.exports.mode}`);
// console.log(`context = ${module.exports.context}`);
// console.log(`entry.main = ${module.exports.entry.main}`);
// console.log(`output.path = ${module.exports.output.path}`);
// console.log(`output.filename = ${module.exports.output.filename}`);
// console.log(`output.publicPath = ${module.exports.output.publicPath}`);