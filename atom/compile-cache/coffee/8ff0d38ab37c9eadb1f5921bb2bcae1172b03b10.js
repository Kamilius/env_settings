(function() {
  var CoverageView;

  CoverageView = require('./coverage-view');

  module.exports = {
    config: {
      pathToLCOV: {
        type: 'string',
        "default": '/Users/Developer/Projects/foo/test/coverage/PhantomJS 1.9.8 (Mac OS X)/lcov.info'
      },
      basePath: {
        type: 'string',
        "default": '/Users/Developer/Projects/foo'
      }
    },
    activate: function() {
      atom.workspace.getTextEditors().forEach(function(editor) {
        return new CoverageView(editor);
      });
      return atom.workspace.onDidAddTextEditor(function(event) {
        return new CoverageView(event.textEditor);
      });
    },
    deactivate: function() {}
  };

}).call(this);
