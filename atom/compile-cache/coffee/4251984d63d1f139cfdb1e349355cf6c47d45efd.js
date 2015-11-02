(function() {
  var CompositeDisposable, exec, findFile, helpers, path, _ref,
    __slice = [].slice;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = helpers = require("atom-linter"), findFile = _ref.findFile, exec = _ref.exec;

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
        grammarScopes: ['source.css.scss'],
        scope: 'file',
        lintOnFly: false,
        lint: (function(_this) {
          return function(editor) {
            var config, filePath, params;
            filePath = editor.getPath();
            config = findFile(path.dirname(filePath), '.scss-lint.yml');
            params = [filePath, "--format=JSON", config != null ? "--config=" + config : void 0].concat(__slice.call(_this.additionalArguments.split(' '))).filter(function(e) {
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
              if (!lint[filePath]) {
                return [];
              }
              return lint[filePath].map(function(msg) {
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
          };
        })(this)
      };
    }
  };

}).call(this);
