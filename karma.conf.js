// <!-- Created by Duncan on 12.28.2016 -->
const webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = (config) => {
  config.set({
    basePath: '',
    autoWatch: true,
    singleRun: false,
    autoWatchBatchDelay: 300,
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: ['./test/index.js'],
    preprocessors: {
      './test/index.js': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleWare: {
      // avoids walls of useless text
      noInfo: true
    }
  })
}
