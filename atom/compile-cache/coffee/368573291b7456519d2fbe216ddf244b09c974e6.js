(function() {
  var CompositeDisposable, exec, findFile, helpers, path, tempFile, _ref,
    __slice = [].slice;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = helpers = require('atom-linter'), findFile = _ref.findFile, exec = _ref.exec, tempFile = _ref.tempFile;

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
        "default": 'scss-lint'
      }
    },
    activate: function() {
      require('atom-package-deps').install(require('../package.json').name);
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
            var cwd, filePath;
            filePath = editor.getPath();
            cwd = path.dirname(filePath);
            return tempFile(path.basename(filePath), editor.getText(), function(tmpFilePath) {
              var config, params;
              config = findFile(cwd, '.scss-lint.yml');
              params = [tmpFilePath, '--format=JSON', config != null ? "--config=" + config : void 0].concat(__slice.call(_this.additionalArguments.split(' '))).filter(function(e) {
                return e;
              });
              return helpers.exec(_this.executablePath, params, {
                cwd: cwd
              }).then(function(stdout) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zY3NzLWxpbnQvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtFQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQTZCLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQUF2QyxFQUFDLGdCQUFBLFFBQUQsRUFBVyxZQUFBLElBQVgsRUFBaUIsZ0JBQUEsUUFEakIsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxFQUZUO09BREY7QUFBQSxNQUlBLGNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGlCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsU0FBQSxFQUFTLFdBRlQ7T0FMRjtLQURGO0FBQUEsSUFVQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxPQUFBLENBQVEsbUJBQVIsQ0FBNEIsQ0FBQyxPQUE3QixDQUFxQyxPQUFBLENBQVEsaUJBQVIsQ0FBMEIsQ0FBQyxJQUFoRSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsR0FBQSxDQUFBLG1CQURSLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixD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

//# sourceURL=/Users/Kamilius/.atom/packages/linter-scss-lint/lib/init.coffee
