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
      common: path.join(__dirname, '../../src/common'),
      dashboard: path.join(__dirname, '../../src/dashboard'),
      token: path.join(__dirname, '../../src/token'),
      main: path.join(__dirname, '../../src/main'),
      contract: path.join(__dirname, '../../src/contract'),
      kyc: path.join(__dirname, '../../src/kyc'),
      user: path.join(__dirname, '../../src/user'),
      borrower: path.join(__dirname, '../../src/borrower'),
      personaldata: path.join(__dirname, '../../src/personaldata'),
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
        use: [
          {
            loader: 'babel-loader',
            // Use require.resolve to let files outside of this module (ex. files in shared/interface)
            // know where the plugins is.
            options: {
              // https://github.com/babel/babel-loader#options
              cacheDirectory: isDev,

              // https://babeljs.io/docs/usage/options/
              babelrc: false,
              presets: [
                // JSX, Flow
                // https://github.com/babel/babel/tree/master/packages/babel-preset-react
                require.resolve('babel-preset-react'),
                // Latest stable ECMAScript features
                // https://github.com/babel/babel/tree/master/packages/babel-preset-latest
                require.resolve('babel-preset-latest'),
                // Experimental ECMAScript proposals
                // https://github.com/babel/babel/tree/master/packages/babel-preset-stage-0
                require.resolve('babel-preset-stage-0'),
              ],
              plugins: [
                // Externalise references to helpers and builtins,
                // automatically polyfilling your code without polluting globals.
                // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-runtime
                ...(isDev
                  ? [
                      // Adds component stack to warning messages
                      // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source
                      require.resolve('babel-plugin-transform-react-jsx-source'),
                      // Adds __self attribute to JSX which React will use for some warnings
                      // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-self
                      require.resolve('babel-plugin-transform-react-jsx-self'),
                    ]
                  : [
                      // TODO: This plugin has some issue. Should re-enable someday.
                      // https://github.com/facebookincubator/create-react-app/issues/553
                      // require.resolve('babel-plugin-transform-react-constant-elements'),

                      require.resolve('babel-plugin-transform-react-inline-elements'),
                      require.resolve('babel-plugin-transform-react-pure-class-to-function'),
                      require.resolve('babel-plugin-transform-react-remove-prop-types'),
                    ]),
              ],
            },
          },
          {
            loader: 'awesome-typescript-loader',
          },
        ],
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
            options: {
              data: '@import "~common/asset/partial";',
            },
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
      URL_APIBASE: JSON.stringify(isDev ? `http://${localIp}:3000` : 'https://api-admin.rayonprotocol.io'),
      ENV_BLOCKCHAIN: JSON.stringify(process.env.ENV_BLOCKCHAIN),
      INFURA_API_KEY: JSON.stringify(process.env.INFURA_API_KEY),
    }),
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      template: './main/vc/index.html',
    }),
  ],
  performance: {
    hints: false,
  },
};
