var concat = require('broccoli-concat');
var uglifyJavaScript = require('broccoli-uglify-js');
var compileSass = require('broccoli-sass');
var mergeTrees = require('broccoli-merge-trees')

// This isn't used by the actual plugin, only by the example HTML page;
// I prefer if nothing is loaded from the web during development (despite
// the fact that the plugin will load the correct version of jQuery if not
// already present on the page).
var jQuery = concat('javascript', {
  inputFiles: ['jquery-1.11.3.js'],
  outputFile: '/jquery.js'
});

var appJs = concat('.', {
  inputFiles: ['bower_components/chosen/chosen.jquery.min.js',
    'javascript/language_config.js',
    'javascript/html_builder.js',
    'javascript/jquery.paging.js',
    'javascript/widget.js'
  ],
  outputFile: '/widget.js'
});
appJs = uglifyJavaScript(appJs);

var appCss = compileSass(['sass', 'bower_components/bootstrap-sass/assets/stylesheets',
  'bower_components/bootstrap-chosen'], 'style.scss', 'widget.css');

var html = concat('.', {
  inputFiles: ['example.html'],
  outputFile: '/example.html'
});

module.exports = mergeTrees([jQuery, appJs, appCss, html])
