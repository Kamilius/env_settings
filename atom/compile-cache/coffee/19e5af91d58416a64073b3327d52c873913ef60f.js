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
      if (process.platform === 'win32') {
        jshintPath = require('path').join(__dirname, '..', 'node_modules', '.bin', 'jshint.cmd');
      } else {
        jshintPath = require('path').join(__dirname, '..', 'node_modules', '.bin', 'jshint');
      }
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
            var error;
            try {
              output = JSON.parse(output).result;
            } catch (_error) {
              error = _error;
              atom.notifications.addError("Invalid Result recieved from JSHint", {
                detail: "Check your console for more info",
                dismissible: true
              });
              console.log('JSHint Result:', output);
              return [];
            }
            output = output.filter(function(entry) {
              return entry.error.id;
            });
            return output.map(function(entry) {
              var pointEnd, pointStart, type;
              error = entry.error;
              pointStart = [error.line - 1, error.character - 1];
              pointEnd = [error.line - 1, error.character];
              type = error.code.substr(0, 1);
              return {
                type: type === 'E' ? 'Error' : type === 'W' ? 'Warning' : 'Info',
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
