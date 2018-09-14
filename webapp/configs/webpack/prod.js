// production config
const merge = require('webpack-merge');
const {
  resolve
} = require('path');

const commonConfig = require('./common');

console.log()

module.exports = merge(commonConfig, {
  entry: resolve(__dirname,'../../src/main/vc/RayonAdminApp.tsx'),
  output: {
    filename: 'js/bundle.[chunkhash].min.js',
    path: resolve(__dirname, '../../dist'),
  },
  plugins: [],
});
