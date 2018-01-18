const path = require('path');
const webpack = require('webpack');

// App files location
const PATHS = {
  app: path.resolve(__dirname, '../frontend/js'),
  commons_frontend: path.resolve(__dirname, '../melinda-ui-commons/frontend'),
  commons_styles: path.resolve(__dirname, '../melinda-ui-commons/frontend/styles'),
  commons_server: path.resolve(__dirname, '../melinda-ui-commons/server'),
  styles: path.resolve(__dirname, '../frontend/styles'),
  build: path.resolve(__dirname, '../build')
};

const plugins = [
  // Shared code
   new webpack.optimize.CommonsChunkPlugin({ name:'vendor', filename: 'js/vendor.bundle.js' }),
  // Avoid publishing files when compilation fails
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.§.NODE_ENV': JSON.stringify('development'),
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
    __PROD__: JSON.stringify(false)
  }),
  new webpack.optimize.OccurrenceOrderPlugin()
];

const sassLoaders = [
  'style-loader',
  'css-loader?sourceMap',
  'postcss-loader',
  'sass-loader?outputStyle=expanded'
];

module.exports = {
  // env : process.env.NODE_ENV,
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      path.resolve(PATHS.app, 'main.js')
    ],
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
      styles: PATHS.commons_styles,
      transformations: path.resolve(PATHS.commons_server, 'record-transformations'),
    },
    // We can now require('file') instead of require('file.jsx')
    extensions: ['.js', '.jsx', '.scss']
  },
  module: {
    loaders: [
      {
        test: /translit\.js$/,
        loaders: ['shebang-loader'],
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader', 'shebang-loader'],
        include: [PATHS.app, PATHS.commons_frontend, PATHS.commons_server]
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
  devServer: {
    contentBase: path.resolve(__dirname, '../frontend'),
    port: 3000,
    historyApiFallback: true
  },
  devtool: 'eval'
};