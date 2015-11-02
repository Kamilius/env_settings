(function() {
  var CompositeDisposable, exec, findFile, helpers, path, tempFile, _ref,
    __slice = [].slice;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = helpers = require("atom-linter"), findFile = _ref.findFile, exec = _ref.exec, tempFile = _ref.tempFile;

  path = require('path');

  module.exports = {
    config: {
      additionalArguments: {
        title: 'Additional Arguments',
        type: 'string',
        "default": ''
      },
      executablePath: {
        title: 'Executable Path',
        type: 'string',
        "default": ''
      }
    },
    activate: function() {
      console.log('activate linter-scss-lint');
      this.subs = new CompositeDisposable;
      this.subs.add(atom.config.observe('linter-scss-lint.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
      return this.subs.add(atom.config.observe('linter-scss-lint.additionalArguments', (function(_this) {
        return function(additionalArguments) {
          return _this.additionalArguments = additionalArguments;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subs.dispose();
    },
    provideLinter: function() {
      var provider;
      return provider = {
        grammarScopes: ['source.css.scss', 'source.scss'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(editor) {
            var filePath;
            filePath = editor.getPath();
            return tempFile(path.basename(filePath), editor.getText(), function(tmpFilePath) {
              var config, params;
              config = findFile(path.dirname(filePath), '.scss-lint.yml');
              params = [tmpFilePath, "--format=JSON", config != null ? "--config=" + config : void 0].concat(__slice.call(_this.additionalArguments.split(' '))).filter(function(e) {
                return e;
              });
              if (_this.executablePath === '') {
                throw new TypeError("Error linting " + filePath + ": No 'scss-lint' executable specified");
              }
              return helpers.exec(_this.executablePath, params).then(function(stdout) {
                var lint;
                lint = (function() {
                  try {
                    return JSON.parse(stdout);
                  } catch (_error) {}
                })();
                if (lint == null) {
                  throw new TypeError(stdout);
                }
                if (!lint[tmpFilePath]) {
                  return [];
                }
                return lint[tmpFilePath].map(function(msg) {
                  var col, line;
                  line = (msg.line || 1) - 1;
                  col = (msg.column || 1) - 1;
                  return {
                    type: msg.severity || 'error',
                    text: (msg.reason || 'Unknown Error') + (msg.linter ? " (" + msg.linter + ")" : ''),
                    filePath: filePath,
                    range: [[line, col], [line, col + (msg.length || 0)]]
                  };
                });
              });
            });
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zY3NzLWxpbnQvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtFQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQTZCLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQUF2QyxFQUFDLGdCQUFBLFFBQUQsRUFBVyxZQUFBLElBQVgsRUFBaUIsZ0JBQUEsUUFEakIsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxFQUZUO09BREY7QUFBQSxNQUlBLGNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGlCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEVBRlQ7T0FMRjtLQURGO0FBQUEsSUFVQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDJCQUFaLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxHQUFBLENBQUEsbUJBRFIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGlDQUFwQixFQUNSLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFD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

//# sourceURL=/Users/Kamilius/.atom/packages/linter-scss-lint/lib/init.coffee
