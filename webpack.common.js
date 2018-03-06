'use strict';

// Modules
var path = require('path')
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

const extractLess = new ExtractTextPlugin({
  filename: "[hash:6].app.css"
});

module.exports = {
  module : {
    rules: [
    {
      enforce: 'pre',
      test: /\.js$/,
      loader: 'eslint-loader',
      query: {
        esModules: true
      }
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: [/node_modules/]
    },
    {
      test: /\.tpl.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true,
          removeComments: true,
          collapseWhitespace: true
        }
      }]
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: env === 'development' ? true : false
          }
        }, 'postcss-loader']
      })
    },
    {
      test: /\.less$/,
      use: extractLess.extract({
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: env === 'development' ? true : false
              }
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: env === 'development' ? true : false
              }
            }
          ],
          fallback: "style-loader"
      })
    },
    {
      test: /\.(png|jpg|jpeg|gif|ico)$/,
      loader: 'url-loader?name=img/[name].[ext]&limit=10000'
    },
    {
      test: /\.(woff|woff2|ttf|eot|svg)$/,
      loader: 'file-loader?name=fonts/[name].[ext]'
    }
    ]
  },
  plugins : [
    extractLess
  ],
  resolve: {
    extensions: ['.js','.css'],
    alias: {
      uirouter: '@uirouter/angularjs/release/ui-router-angularjs.min.js',
      // 'angular-cookies': 'angular-cookies/angular-cookies.min.js',
      zepto: 'zepto-modules/_default.js',
      pickjs: 'pickjs/dist/picker.min.js',
      promise: 'es6-promise/dist/es6-promise.min.js',
      clipboard: 'clipboard/dist/clipboard.min.js',
      swiper: 'swiper/dist/js/swiper.min.js'
    }
  }
}
