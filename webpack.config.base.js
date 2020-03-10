const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NODE_ENV = JSON.stringify(process.env.NODE_ENV);
console.log('NODE_ENV: ' + NODE_ENV);
const PATHS = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'build'),
};
// const setCurrentColorForId = require('./my_modules/setCurrentColorForId.js')


// console.log(PATHS)
module.exports = {
  mode: 'production',
  // mode: 'development',
  
  externals: {
    paths: PATHS
  },
  
  context: PATHS.src,
  entry: {
    main: './script/index.js',
    // 'babel.polyfill' : '@babel/polyfill'
  },

  output: {
    path: PATHS.dist,
    filename: `script/[name].js`,
    publicPath: '/',
    // publicPath: 'http://0.0.0.0:8080/',
    // library: 'webpackVariable'
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
      inject: 'head',
      template: `${PATHS.src}/index.html`,
      filename: './index.html'
    }),
    // new CopyWebpackPlugin([
    //   // { from: PATHS.src + '/libs', to: `libs` },
    //   // { from: PATHS.src + '/favicon', to: `favicon` },
    //   // { from: PATHS.src + '/fonts', to: `fonts` },
    // ]),
    new SpriteLoaderPlugin({
      // extract: true,
      // spriteFilename:'./img/icons.svg'
    }),
    // new MiniCssExtractPlugin({
    // 	filename: `style/[name].css`,
    // }),
    // new BundleAnalyzerPlugin(),// анализ размера бандла
    // new BabelMinifyWebpackPlugin()
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
        use: [
          {
          loader: 'file-loader',
          options: {name: '[path][name].[ext]'}
          }
        ]
      },

      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              // symbolId: filePath => path.basename(filePath),
              extract: true,
              spriteFilename:'./img/img-sprite-vector.svg'
            }
          },
          // {
          //   loader: 'file-loader',
          //   options: {name: '[path][name].[ext]'}
          // },
          {
            loader: 'svgo-loader',
            options: {
              full: true,
              plugins: [
                {collapseGroups: true}
              ]
            }
          },
          {
            loader: 'svgo-loader',
            options: {
              // full: true,
              plugins: [
                {convertStyleToAttrs: false},
                {removeAttributesBySelector: {
                  selectors: [
                    {
                      selector: '[id="icons"]',
                      attributes: "id"
                    }
                  ]
                }},
                {
                  'setCurrentColorForId' : {
                    type        : 'perItem',
                    name        : 'setCurrentColorForId',
                    description : 'Removes the ID attr from the <svg> element',
                    fn          : function(item) {
                      if ( item.hasAttr('id', 'stroke_x003d_currentColor') ) {
                        item.addAttr({
                          name: "stroke",
                          value: "currentColor",
                          prefix: '',
                          local: "stroke"
                        });
                        item.removeAttr('id');
                      }
                      if ( item.hasAttr('id', 'fill_x003d_currentColor') ) {
                        item.addAttr({
                          name: "fill",
                          value: "currentColor",
                          prefix: '',
                          local: "fill"
                        });
                        item.removeAttr('id');
                      }
                    }
                  }
                },
                {removeViewBox: false},
                {cleanupIDs: false},
                {removeDimensions: true},
                {convertPathData: true},
                {removeStyleElement: true},
                {removeAttrs: {
                  preserveCurrentColor: true,
                  attrs: [
                    'stroke',
                    'stroke-width',
                    'stroke-linecap',
                    'stroke-linejoin',
                    'fill',
                    'fill-rule',
                    'clip-rule',
                  ]
                }},
              ]
            }
          }
        ]
      },

      {
        test: /\.js$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: 
          {
            presets: [
              // 'env',
              '@babel/preset-env',
              // "latest"
            ]
          }
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
            // options: {
            //   sourceMap: true
            // }
          },

          {loader: 'sass-loader'},

          {loader: 'stylefmt-loader',
            options: {}
          },
        ]
      },
    ],
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

};


// console.log(`mode = ${module.exports.mode}`);
// console.log(`context = ${module.exports.context}`);
// console.log(`entry.main = ${module.exports.entry.main}`);
// console.log(`output.path = ${module.exports.output.path}`);
// console.log(`output.filename = ${module.exports.output.filename}`);
// console.log(`output.publicPath = ${module.exports.output.publicPath}`);