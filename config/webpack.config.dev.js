const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

// App files location
const PATHS = {
  app: path.resolve(__dirname, '../frontend/js'),
  commons_frontend: path.resolve(__dirname, '../melinda-ui-commons/frontend'),
  commons_styles: path.resolve(__dirname, '../melinda-ui-commons/frontend/styles'),
  styles: path.resolve(__dirname, '../frontend/styles'),
  build: path.resolve(__dirname, '../build')
};

const plugins = [
  // Shared code
  new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.bundle.js'),
  // Avoid publishing files when compilation fails
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
  }),
  new webpack.optimize.OccurenceOrderPlugin()
];

const sassLoaders = [
  'style-loader',
  'css-loader?sourceMap',
  'postcss-loader',
  'sass-loader?outputStyle=expanded'
];

module.exports = {
  env : process.env.NODE_ENV,
  entry: {
    app: path.resolve(PATHS.app, 'main.js'),
    vendor: ['react']
  },
  output: {
    path: PATHS.build,
    filename: 'js/[name].js',
    publicPath: '/'
  },
  stats: {
    colors: true,
    reasons: true
  },
  resolve: {
    alias: {
      commons: path.resolve(PATHS.commons_frontend, 'js'),
      styles: PATHS.commons_styles
    },
    // We can now require('file') instead of require('file.jsx')
    extensions: ['', '.js', '.jsx', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: [PATHS.app, PATHS.commons_frontend]
      },
      {
        test: /\.scss$/,
        loader: sassLoaders.join('!')
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  plugins: plugins,
  postcss: function () {
    return [autoprefixer({
      browsers: ['last 6 versions']
    })];
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../frontend'),
    port: 3000,
    historyApiFallback: true
  },
  devtool: 'eval'
};