var path = require('path');
var webpackConf = require("./webpack.config.js");
webpackConf.devtool = 'inline-source-map';
webpackConf.entry = {}

module.exports = function(config) {
  config.set({

    browserNoActivityTimeout: 100000,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai-as-promised', 'sinon-chai', 'nike-burnside'],

    // list of files / patterns to load in the browser
    files: [
        "app/**/*.test.js"
    ],
    // list of files to exclude
    exclude: [
    ],

    webpack: webpackConf,

    webpackMiddleware: {
      noInfo: true
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'app/**/*.test.js': ['webpack']
    },

    coverageReporter: {
        dir: 'reports/coverage/',
        reporters: [
            { type: 'text' },
            { type: 'lcov', subdir: '.' },
            { type: 'json-summary', subdir: '.' },
            { type: 'text', subdir: '.', file: 'lcov.info' }
        ]
    },

    htmlReporter: {
      outputDir: 'reports',
      templatePath: null,
      focusOnFailures: true,
      namedFiles: false,
      pageTitle: 'summary',
      urlFriendlyName: true
    },

    junitReporter: {
        outputDir: 'reports/unit',
        outputFile: 'xunit.xml',
        suite: ''
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'junit', 'html', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    client: {
        mocha: {
            timeout : 10000000 // 1 minute
        }
    }
  });
};