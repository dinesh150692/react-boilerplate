var path = require('path');
const webpack = require('webpack');
const commonPaths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const CompressionPlugin =  require('compression-webpack-plugin');

const BuildProperties = require('../build.properties.json');
// the clean options to use
let cleanOptions = {
  root:     __dirname + '/' + '../',
  verbose:  true,
  exclude:  ['manifest.json', 'favicon.ico', 'logo.svg'],
  dry:      false
};

//Public url will be prepended to the chunk files
var publicUrl = '/';

module.exports = {
  mode: 'production',
  entry: commonPaths.entryPath,
  output: {
    filename: `${commonPaths.jsFolder}/[name].[contenthash:5].js`,
    path: commonPaths.outputPath,
    publicPath: publicUrl,
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
    //To display the progress of the webpack build
    new webpack.ProgressPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    //To clear the destination directory before webpack build
    new CleanWebpackPlugin(['build'], cleanOptions),
    //To create html
    new HtmlWebpackPlugin({
      template: commonPaths.templatePath,
      inject: true,
      manifest: __dirname + '/src/manifest.json',
      serviceWorker: '/service-worker.js',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    //To extract css in the js files into separate/single file
    new MiniCssExtractPlugin({
      filename: `${commonPaths.cssFolder}/[name].[contenthash:5].css`,
      chunkFilename: `${commonPaths.cssFolder}/[name].[id].[contenthash:5].css`,
    }),
    //To add preload attribute to all the chunks
    // new PreloadWebpackPlugin({
    //   fileBlacklist: [/[0-9]{1-2}.[a-zA-Z0-9]{5}\.js$/],
    //   rel: 'prefetch',
    //   as(entry) {
    //     if (/\.css$/.test(entry)) return 'style';
    //     if (/\.woff$/.test(entry)) return 'font';
    //     if (/\.png$/.test(entry)) return 'image';
    //     return 'script';
    //   }
    // }),
    //To create a service worker file
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
    //To extract css which is need for initial page load alone separately so 
    //that initial load is quicker
    new HtmlCriticalWebpackPlugin({
        base: path.resolve(__dirname, '../build/'),
        src: 'index.html',
        dest: 'index.html',
        inline: true,
        minify: true,
        extract: true,
        width: 375,
        height: 565,
        penthouse: {
          blockJSRequests: false,
        }
    }),
    //To add compression to your build
    // new CompressionPlugin({
    //   algorithm: "gzip",
    //   test: /\.js$|\.css$|\.html$/,
    //   threshold: 10240,
    //   minRatio: 0.8
    // })
  ],
  optimization: {
    minimizer: [
      //To minimize your generated js file
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      //To optimize css in your code
      new OptimizeCSSAssetsPlugin({})
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        //To create npm module into separate file so that it can be cached unless 
        //module is changed
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            if(module.context.match(/[\\/]node_modules[\\/](react-dom|react|preact-compat|preact)([\\/]|$)/)){
              return `npm.preactBundle`;
            }else if(module.context.match(/[\\/]node_modules[\\/](react-router|react-router-dom|history|invariant)([\\/]|$)/)){
              return `npm.reactRouterBundle`;
            }else if(module.context.match(/[\\/]node_modules[\\/](react-redux|redux|redux-*)([\\/]|$)/)){
              return `npm.reduxBundle`;
            }else if(module.context.match(/[\\/]node_modules[\\/](babel|webpack|core-js)([\\/]|$)/)){
              return `npm.polyfillBundle`;
            }else{
              //const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              // npm package names are URL-safe, but some servers don't like @ symbols
              // return `npm.${packageName.replace('@', '')}`;
              return 'npm.otherBundle';
            }
          },
          chunks: "initial"
        },
      },
    },
  }
};