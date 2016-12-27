/**
 * Created by charleen on 12/27/16.
 */
const path= require ('path');

module.exports = {
    entry: {
      // entry: './client/client.js',
    },
    output: {
      path: path.resolve('dist'),
      filename:'bundle.js',
      publicPath: '/dist/'
    },
  module: {
    loaders: []
  }

};
