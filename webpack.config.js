const path = require(`path`)
const webpack = require(`webpack`)
const NodemonPlugin = require('nodemon-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = (env) => ({
  context: __dirname,
  mode: env,
  entry: {
    main: `./main.ts`,
  },

  output: {
    filename: `[name].js`,
    path: path.resolve(__dirname, `dist`),
  },

  resolve: {
    extensions: [`.ts`, `.tsx`, `.js`],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /(node_modules)/,
        loader: `ts-loader`,
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: `babel-loader`,
      },
    ],
  },

  devtool: `source-map`,

  target: `node`,

  externals: {
    puppeteer: 'require("puppeteer")',
  },

  plugins: [
    new NodemonPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(env),
    }),
    new CopyPlugin([
      {
        from: 'src/janus/canyan-janus',
        to: 'janus/config',
      },
    ]),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
})
