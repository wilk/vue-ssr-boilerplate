const path = require('path')
const projectRoot = path.resolve(__dirname, '../src')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BabiliPlugin = require("babili-webpack-plugin")

module.exports = function ({isClient = true}) {
  const isProd = process.env.NODE_ENV === 'production',
    plugins = isClient ? [new ExtractTextPlugin('[name].[hash].css')] : []

  if (isClient && isProd) plugins.push(new BabiliPlugin())

  return {
    devtool: isProd ? false : '#source-map',
    entry: {
      // @todo: add more entries, not just vendor and app
      app: './src/client-entry.js',
      vendor: [
        'babel-polyfill',
        'es6-promise',
        'vue',
        'vue-router',
        'vuex',
        'vuex-router-sync',
        'axios'
      ]
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/dist/',
      filename: '[name].[hash].js'
    },
    resolve: {
      extensions: ['.vue', '.js', '.json'],
      alias: {
        'public': path.resolve(__dirname, '../public')
      }
    },
    module: {
      noParse: /es6-promise\.js$/, // avoid webpack shimming process
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              sass: isClient ? ExtractTextPlugin.extract({
                use: ['css-loader', 'sass-loader'],
                fallback: 'vue-style-loader'
              }) : 'vue-style-loader!css-loader!sass-loader',
              scss: isClient ? ExtractTextPlugin.extract({
                use: ['css-loader', 'sass-loader'],
                fallback: 'vue-style-loader'
              }) : 'vue-style-loader!css-loader!sass-loader'
            },
            postcss: [
              require('autoprefixer')({
                browsers: ['last 3 versions']
              })
            ]
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: projectRoot,
          exclude: /node_modules/,
          options: {
            cacheDirectory: !isProd,
            presets: [['env', {
              targets: {
                browsers: ['last 2 versions', '> 5%'],
                node: 'current'
              }
            }]],
            plugins: ['transform-object-rest-spread']
          }
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[ext]?[hash]'
          }
        },
        {
          test: /\.js$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          enforce: "pre",
          include: [path.resolve(__dirname, '../src')],
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        },
        {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
        {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/octet-stream"},
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"}
      ]
    },

    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false
    },

    plugins
  }
}
