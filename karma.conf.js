module.exports = function(config) {
    config.set({
        basePath: './',
        frameworks: ['jasmine-jquery', 'jasmine'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true,
        files: [
          'Tests/*.js', 'js/jquery-1.10.1.js', 'jquery.mermery.min.js',
          {
            pattern:  'Tests/*.html',
            watched:  true,
            served:   true,
            included: false
          }
        ],
        client: {
          captureConsole: true
        }
    });
}
