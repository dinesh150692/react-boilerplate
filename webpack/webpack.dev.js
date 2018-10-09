
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonPaths = require('./paths');

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
    new HtmlWebpackPlugin({
      template: commonPaths.templatePath,
    }),
    new MiniCssExtractPlugin({
      filename: `${commonPaths.cssFolder}/[name].[contenthash:5].css`,
      chunkFilename: `${commonPaths.cssFolder}/[name].[id].[contenthash:5].css`,
    })
  ],
};