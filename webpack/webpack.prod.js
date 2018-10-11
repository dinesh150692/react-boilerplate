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
const safePostCssParser = require('postcss-safe-parser');
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


// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
        sourceMap: false,
      },
    },
  ];
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: false,
      },
    });
  }
  return loaders;
};


module.exports = {
  mode: 'production',
  entry: commonPaths.entryPath,
  output: {
    filename: `${commonPaths.jsFolder}/[name].[contenthash:5].js`,
    path: commonPaths.outputPath,
    publicPath: publicUrl,
    chunkFilename: `${commonPaths.jsFolder}/[name].[contenthash:5].js`,
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },

    
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // `MiniCSSExtractPlugin` extracts styles into CSS
          // files. If you use code splitting, async bundles will have their own separate CSS chunk file.
          // By default we support CSS Modules with the extension .module.css
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            loader: getStyleLoaders({
              importLoaders: 1,
              sourceMap: false,
            }),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },
          // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
          // using the extension .module.css
          {
            test: cssModuleRegex,
            loader: getStyleLoaders({
              importLoaders: 1,
              sourceMap: false,
              modules: true
            }),
          },
          // Opt-in support for SASS. The logic here is somewhat similar
          // as in the CSS routine, except that "sass-loader" runs first
          // to compile SASS files into CSS.
          // By default we support SASS Modules with the
          // extensions .module.scss or .module.sass
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            loader: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: false,
              },
              'sass-loader'
            ),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },
          // Adds support for CSS Modules, but using SASS
          // using the extension .module.scss or .module.sass
          {
            test: sassModuleRegex,
            loader: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: false,
                modules: true
              },
              'sass-loader'
            ),
          }    
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
      new OptimizeCSSAssetsPlugin({
        parser: safePostCssParser
      })
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
              return `npm.otherBundle`;
            }
          },
          chunks: "initial"
        },
      },
    },
  }
};