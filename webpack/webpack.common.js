
const commonPaths = require('./paths');
module.exports = {
  entry: commonPaths.entryPath,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: commonPaths.imagesFolder,
            },
          },
        ],
      },
      {
        test: /\.(woff2|ttf|woff|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: commonPaths.fontsFolder,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['*', '.js', '.jsx', '.css', '.scss'],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dgram: 'empty',
    child_process: 'empty'
  },
  
  resolve: {
    alias: {
      //enable this comment for moving from react to preact
      // "react": "preact-compat",
      // "react-dom": "preact-compat"
      "Components": commonPaths.root + '/src/components/',
      "Pages": commonPaths.root + '/src/pages/',
      "Actions": commonPaths.root + '/src/redux/actions',
      "ActionType": commonPaths.root + '/src/redux/actionType',
      "Sagas": commonPaths.root +  '/src/redux/sagas',
      "Reducers": commonPaths.root + '/src/redux/reducers'
    }
  }
};