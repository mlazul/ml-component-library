const path = require('path');

const webpack = require('webpack');
const validate = require('webpack-validator');
const combineLoaders = require('webpack-combine-loaders');

const HtmlWebpackPlugin = require('html-webpack-plugin');


const webpackConfig = {
  context: path.resolve(__dirname, 'src'),

  devServer: {
    https: false,
    host: 'localhost',
    port: '8000',

    contentBase: path.resolve(__dirname, 'src'),
    historyApiFallback: true,
    compress: true,

    hot: true,
    inline: true,

    // --progress - [assets, children, chunks, colors, errors, hash, timings, version, warnings]
    stats: {
      assets: true,
      children: true,
      chunks: false,
      colors: true,
      errors: true,
      errorDetails: true, //depends on {errors: true}
      hash: true,
      modules: false,
      publicPath: true,
      reasons: false,
      source: true, //what does this do?
      timings: true,
      version: true,
      warnings: true
    }
  },

  // devtool: 'cheap-module-eval-source-map', //javascript sourcemaps
  devtool: 'eval', //javascript sourcemaps

  entry: {
    app: [
      'react-hot-loader/patch',
      './index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: 'http://localhost:8000/', // Use absolute paths to avoid the way that URLs are resolved by Chrome when they're parsed from a dynamically loaded CSS blob. Note: Only necessary in Dev.
    filename: '[name].bundle.js',
    library: 'Library',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src/components'),
          path.resolve(__dirname, 'src/index.js')
        ],
        loader: 'babel'
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src/assets/styles'),
          path.resolve(__dirname, 'src/components')
        ],
        loader: combineLoaders([
          {
            loader: 'style'
          },
          {
            loader: 'css',
            query: {
              modules: true,
              localIdentName: '[folder]__[local]--[hash:base64:10]',
              sourceMap: true,
              import: false,
              url: true
            }
          },
          {
            loader: 'resolve-url',
            query: {
              sourceMap: true,
              silent: false,
              fail: true,
              keepQuery: true
            }
          },
          {
            loader: 'postcss',
            query: {
              sourceMap: true
            }
          }
        ])
      },
      // Font Definitions
      {
        test: /\.ttf$/,
        include: [
          path.resolve(__dirname, 'src/assets/fonts')
        ],
        loader: 'file',
        query: {
          limit: 10000,
          mimetype: 'application/octet-stream',
          name: 'assets/fonts/[name].[ext]'
        }
      },
      {
        test: /\.png$/,
        include: [
          path.resolve(__dirname, 'src/assets/images')
        ],
        loader: 'file',
        query: {
          limit: 25000,
          mimetype: 'image/png',
          name: 'assets/images/[name].[ext]'
        }
      },
      {
        test: /\.svg$/,
        include: [
          path.resolve(__dirname, 'src/assets/images')
        ],
        loader: 'file',
        query: {
          limit: 10000,
          minetype: 'image/svg+xml',
          name: 'assets/images/[name].[ext]'
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: true,
      hash: true,
      cache: true,
      // chunks: ['app'],
      chunksSortMode: 'dependency',
      showErrors: true
    }),
    // Enable multi-pass compilation for enhanced performance
    // in larger projects. Good default.
    new webpack.HotModuleReplacementPlugin({
      multiStep: true
    }),
    //see possible syntax errors at the browser console instead of hmre overlay
    new webpack.NoErrorsPlugin()
  ],

  postcss: (_webpack) => {
    return [
      require('postcss-smart-import')({
        addDependencyTo: _webpack,
        root: path.resolve(__dirname, 'src'),
        path: ['assets', 'components'],
        skipDuplicates: false
      }),
      require('postcss-cssnext')()
    ];
  },

  resolve: {
    alias: {
      Images: path.resolve(__dirname, 'src/assets/images'),
      Styles: path.resolve(__dirname, 'src/assets/styles'),
    },
    extensions: ['', '.js', '.jsx']
  }
};


module.exports = validate(webpackConfig, {
  rules: {
    'no-root-files-node-modules-nameclash': true, //default
    'loader-enforce-include-or-exclude': false,
    'loader-prefer-include': false
  }
});