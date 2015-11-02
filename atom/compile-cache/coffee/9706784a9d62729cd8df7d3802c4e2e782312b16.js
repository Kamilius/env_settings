(function() {
  module.exports = {
    config: {
      jshintExecutablePath: {
        "default": '',
        type: 'string',
        description: 'Leave empty to use bundled'
      }
    },
    provideLinter: function() {
      var helpers, jshintPath, provider, reporter;
      jshintPath = require('path').join(__dirname, '..', 'node_modules', '.bin', 'jshint');
      helpers = require('atom-linter');
      reporter = require('jshint-json');
      return provider = {
        grammarScopes: ['source.js', 'source.js.jsx'],
        scope: 'file',
        lintOnFly: true,
        lint: function(textEditor) {
          var exePath, filePath, parameters, text;
          exePath = atom.config.get('linter-jshint.jshintExecutablePath') || jshintPath;
          filePath = textEditor.getPath();
          text = textEditor.getText();
          parameters = ['--reporter', reporter, '--extract', 'auto', '--filename', filePath, '-'];
          return helpers.exec(exePath, parameters, {
            stdin: text
          }).then(function(output) {
            return JSON.parse(output).result.filter(function(entry) {
              return entry.error.id;
            }).map(function(entry) {
              var error, pointEnd, pointStart;
              error = entry.error;
              pointStart = [error.line - 1, error.character - 1];
              pointEnd = [error.line - 1, error.character];
              return {
                type: error.id.substr(1, error.id.length - 2),
                text: "" + error.code + " - " + error.reason,
                filePath: filePath,
                range: [pointStart, pointEnd]
              };
            });
          });
        }
      };
    }
  };

}).call(this);
