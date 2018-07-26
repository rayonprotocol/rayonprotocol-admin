// shared config (dev and prod)
const ip = require('ip');
const path = require('path');
const webpack = require('webpack');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');

const isDev = process.env.NODE_ENV !== 'production';
const localIp = process.env.INBOUND ? ip.address() : 'localhost';

console.log(process.env.BUILD_ENV, 'isDev', isDev, JSON.stringify(isDev ? 'development' : 'production'));
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      assets: path.join(__dirname, '../../src/assets'),
      common: path.join(__dirname, '../../src/common'),
      home: path.join(__dirname, '../../src/home'),
      dashboard: path.join(__dirname, '../../src/dashboard'),
      transaction: path.join(__dirname, '../../src/transaction'),
      token: path.join(__dirname, '../../src/token'),
      event: path.join(__dirname, '../../src/event'),
    },
  },
  context: resolve(__dirname, '../../src'),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'awesome-typescript-loader'],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader',
            options: {
              // CSS Loader https://github.com/webpack/css-loader
              importLoaders: 1,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: isDev ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
              discardComments: {
                removeAll: true,
              },
            },
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[hash].[ext]',
              outputPath: '/img/',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              optipng: {
                enabled: true,
                optimizationLevel: 7,
              },
              gifsicle: {
                enabled: true,
                interlaced: false,
              },
            },
          },
        ],
      },
    ],
  },
  target: 'web',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      BUILD_ENV: JSON.stringify(isDev ? 'development' : 'production'),
      EMAIL_SUB_API_ROOT: JSON.stringify(isDev ? `http://localhost:3000` : `https://api.march.eco`),
      URL_APIBASE: JSON.stringify(isDev ? `http://${localIp}:3000` : 'https://api.rayonprotocol.io'),
    }),
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
  performance: {
    hints: false,
  },
};
