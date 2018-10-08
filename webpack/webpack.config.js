const common = require('./webpack.common');
const webpackMerge = require('webpack-merge');

const envs = {
  development: 'dev',
  production: 'prod',
};
const env = envs[process.env.NODE_ENV || 'development'];
const envConfig = require(`./webpack.${env}.js`);
module.exports = webpackMerge(common, envConfig);