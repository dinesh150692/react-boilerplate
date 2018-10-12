
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const commonPaths = require('./paths');

const BuildProperties = require('../build.properties.json');
module.exports = {
  mode: 'development',
  entry: commonPaths.entryPath,
  output: {
    filename: '[name].js',
    path: commonPaths.outputPath,
    chunkFilename: '[name].[contenthash:5].js',
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new HtmlWebpackPlugin({
      template: commonPaths.templatePath,
    }),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: BuildProperties.version,
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        minify: true,
        navigateFallback:  'index.html',
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      }
    ),
    new MiniCssExtractPlugin({
      filename: `${commonPaths.cssFolder}/[name].[contenthash:5].css`,
      chunkFilename: `${commonPaths.cssFolder}/[name].[id].[contenthash:5].css`,
    })
  ],
};