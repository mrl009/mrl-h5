'use strict';

// Modules
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpackMerge = require('webpack-merge')

const commonConfig = require('./webpack.common')

module.exports = webpackMerge(commonConfig, {
  entry: {
    vendor: ['angular', 'zepto', 'md5', 'promise', 'uirouter', 'clipboard', 'swiper'],
    config: './src/config',
    app: './main',
  },
  devtool: 'none',
  output: {
    path: __dirname + '/dist',
    //publicPath: 'https://www.fenyin365.com/',
    publicPath: './',
    filename: '[chunkhash:6].[name].js',
    chunkFilename: '[chunkhash:6].[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '彩票',
      template: './src/index.html',
      inject: 'body',
      filename: 'index.html',
      staticPath: '',
      minify:{    //压缩HTML文件
        // removeComments: true,    //移除HTML中的注释
        collapseWhitespace: true    //删除空白符与换行符
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
      '__PROD__': true,
      '__DEV__': false
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", 'config'],
      filename:"[chunkhash:6].[name].js",
      minChunks: Infinity //Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'config',
      filename: '[chunkhash:6].[name].js',
      minChunks: 1
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.css|less$/,
      minimize: true,
      debug: false,
    }),
    new CopyWebpackPlugin([
    {
      from: __dirname + path.join('/src', '/**/**/*.tple.html'),
      to: __dirname + '/dist'
    },
    {
      from: __dirname + '/.htaccess',
      to: __dirname + '/dist'
    }, {
        from: __dirname + '/webapi.php',
        to: __dirname + '/dist'
    }], {
      ignore: [
        '*.js',
        '*.less'
      ],
      copyUnmodified: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: {
        comments: false
      },
      mangle: {
        except: [
          '$state',
          '$stateParams',
          '$timeout',
          '$interval',
          '$location',
          '$rootScope',
          '$scope',
          '$stateProvider',
          '$http',
          '$urlRouterProvider',
          '$locationProvider',
          '$httpProvider',
          '$httpParamSerializer',
          '$sce',
          '$compile',
          '$cookieStore',
          '$cookies',
          'Lottery',
          '$11x5',
          'Yb',
          'K3',
          'Pk10',
          'Pcdd',
          'Lhc',
          'DB',
          'CtrlUtil',
          'Ssc',
          'Core',
          'Layer',
          'Util',
          'resources',
          'DT',
          'RS',
          'CS',
          'S_lottery',
          'S_normal'
        ]
      }
    })
  ]
})
