const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

module.exports = {
  entry: {
     // This is the "main" file which should include all other modules
    entry: './client/main.js',
  },
  output: {
    path: path.resolve('./client/dist'),
    publicPath: 'client/dist/',
    filename:'build.js',
  },

  module: {
    loaders: [
      {
        // Ask webpack to check: If this file ends with .js, then apply some transforms
        test: /\.js$/,
        // Transform it with babel
        loader: 'babel-loader',
        // don't transform node_modules folder (which don't need to be compiled)
        exclude: /node_modules/
      },
      {
        // Looks for .vue files to complie into js, html, css
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
       new webpack.ProvidePlugin({
          Vue: ['vue/dist/vue.common.js', 'default']
        })
     ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
};
