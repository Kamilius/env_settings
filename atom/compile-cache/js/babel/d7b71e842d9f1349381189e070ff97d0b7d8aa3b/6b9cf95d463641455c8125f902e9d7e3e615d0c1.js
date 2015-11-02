Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _atomLinter = require('atom-linter');

var _fs = require('fs');

var _stripJsonComments = require('strip-json-comments');

var _stripJsonComments2 = _interopRequireDefault(_stripJsonComments);

'use babel';

var LinterJSCS = (function () {
  function LinterJSCS() {
    _classCallCheck(this, LinterJSCS);
  }

  _createClass(LinterJSCS, null, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      // Install dependencies using atom-package-deps
      require("atom-package-deps").install("linter-jscs");

      this.observer = atom.workspace.observeTextEditors(function (editor) {
        editor.getBuffer().onWillSave(function () {
          if (_this.fixOnSave) {
            _this.fixString();
          }
        });
      });
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.observer.dispose();
    }
  }, {
    key: 'provideLinter',
    value: function provideLinter() {
      var _this2 = this;

      return {
        grammarScopes: ['source.js', 'source.js.jsx'],
        scope: 'file',
        lintOnFly: true,
        lint: function lint(editor) {
          var JSCS = require('jscs');

          // We need re-initialize JSCS before every lint
          // or it will looses the errors, didn't trace the error
          // must be something with new 2.0.0 JSCS
          _this2.jscs = new JSCS();
          _this2.jscs.registerDefaultRules();

          var filePath = editor.getPath();
          var configFiles = ['.jscsrc', '.jscs.json', 'package.json'];

          // Search for project config file
          var config = (0, _atomLinter.findFile)(filePath, configFiles);

          // Reset config if `jscsConfig` is not found in `package.json`
          if (config && config.indexOf('package.json') > -1) {
            var _require = require(config);

            var jscsConfig = _require.jscsConfig;

            if (!jscsConfig) config = null;
          }

          // Search for home config file
          if (!config) {
            var homeDir = require('user-home');
            if (homeDir) config = (0, _atomLinter.findFile)(homeDir, configFiles);
          }

          // Options passed to `jscs` from package configuration
          var options = { esnext: _this2.esnext, preset: _this2.preset };

          if (config) {
            try {
              var rawConfig = (0, _fs.readFileSync)(config, { encoding: 'utf8' });
              var parsedConfig = JSON.parse((0, _stripJsonComments2['default'])(rawConfig));

              if (config.indexOf('package.json') > -1) {
                if (parsedConfig.jscsConfig) {
                  parsedConfig = parsedConfig.jscsConfig;
                } else {
                  throw new Error('No `jscsConfig` key in `package.json`');
                }
              }

              _this2.jscs.configure(parsedConfig);
            } catch (error) {
              // Warn user only once
              if (!_this2.warnLocalConfig) {
                console.warn('[linter-jscs] No config found, or error while loading it.');
                console.warn(error.stack);
                _this2.warnLocalConfig = true;
              }

              // Reset config to null
              config = null;
              _this2.jscs.configure(options);
            }
          } else {
            _this2.jscs.configure(options);
          }

          // We don't have a config file present in project directory
          // let's return an empty array of errors
          if (!config && _this2.onlyConfig) return [];

          var text = editor.getText();
          var errors = _this2.jscs.checkString(text, filePath).getErrorList();

          return errors.map(function (_ref) {
            var rule = _ref.rule;
            var message = _ref.message;
            var line = _ref.line;
            var column = _ref.column;

            // Calculate range to make the error whole line
            // without the indentation at begining of line
            var indentLevel = editor.indentationForBufferRow(line - 1);
            var startCol = editor.getTabLength() * indentLevel;
            var endCol = editor.getBuffer().lineLengthForRow(line - 1);
            var range = [[line - 1, startCol], [line - 1, endCol]];

            var type = _this2.displayAs;
            var html = '<span class=\'badge badge-flexible\'>' + rule + '</span> ' + message;

            return { type: type, html: html, filePath: filePath, range: range };
          });
        }
      };
    }
  }, {
    key: 'fixString',
    value: function fixString() {
      if (!this.isMissingConfig && !this.onlyConfig) {
        var editor = atom.workspace.getActiveTextEditor();
        var path = editor.getPath();
        var text = editor.getText();

        return editor.setText(this.jscs.fixString(text, path).output);
      }
    }
  }, {
    key: 'config',
    value: {
      preset: {
        title: 'Preset',
        description: 'Preset option is ignored if a config file is found for the linter.',
        type: 'string',
        'default': 'airbnb',
        'enum': ['airbnb', 'crockford', 'google', 'grunt', 'jquery', 'mdcs', 'node-style-guide', 'wikimedia', 'wordpress', 'yandex']
      },
      esnext: {
        description: 'Attempts to parse your code as ES6+, JSX, and Flow using the babel-jscs package as the parser.',
        type: 'boolean',
        'default': false
      },
      onlyConfig: {
        title: 'Only Config',
        description: 'Disable linter if there is no config file found for the linter.',
        type: 'boolean',
        'default': false
      },
      fixOnSave: {
        title: 'Fix on save',
        description: 'Fix JavaScript on save',
        type: 'boolean',
        'default': false
      },
      displayAs: {
        title: 'Display errors as',
        type: 'string',
        'default': 'error',
        'enum': ['error', 'warning']
      }
    },
    enumerable: true
  }, {
    key: 'preset',
    get: function get() {
      return atom.config.get('linter-jscs.preset');
    }
  }, {
    key: 'esnext',
    get: function get() {
      return atom.config.get('linter-jscs.esnext');
    }
  }, {
    key: 'onlyConfig',
    get: function get() {
      return atom.config.get('linter-jscs.onlyConfig');
    }
  }, {
    key: 'fixOnSave',
    get: function get() {
      return atom.config.get('linter-jscs.fixOnSave');
    }
  }, {
    key: 'displayAs',
    get: function get() {
      return atom.config.get('linter-jscs.displayAs');
    }
  }]);

  return LinterJSCS;
})();

exports['default'] = LinterJSCS;
;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNjcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVzQixNQUFNOzswQkFDSCxhQUFhOztrQkFDVCxJQUFJOztpQ0FDSCxxQkFBcUI7Ozs7QUFMbkQsV0FBVyxDQUFDOztJQU9TLFVBQVU7V0FBVixVQUFVOzBCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBdURkLG9CQUFHOzs7O0FBRWhCLGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQzVELGNBQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBTTtBQUNsQyxjQUFJLE1BQUssU0FBUyxFQUFFO0FBQ2xCLGtCQUFLLFNBQVMsRUFBRSxDQUFDO1dBQ2xCO1NBQ0YsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztXQUVnQixzQkFBRztBQUNsQixVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3pCOzs7V0FFbUIseUJBQUc7OztBQUNyQixhQUFPO0FBQ0wscUJBQWEsRUFBRSxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUM7QUFDN0MsYUFBSyxFQUFFLE1BQU07QUFDYixpQkFBUyxFQUFFLElBQUk7QUFDZixZQUFJLEVBQUUsY0FBQyxNQUFNLEVBQUs7QUFDaEIsY0FBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7OztBQUs3QixpQkFBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUN2QixpQkFBSyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7QUFFakMsY0FBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xDLGNB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S2FtaWxpdXMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3MvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICdhdG9tJztcbmltcG9ydCB7IGZpbmRGaWxlIH0gZnJvbSAnYXRvbS1saW50ZXInO1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHN0cmlwSlNPTkNvbW1lbnRzIGZyb20gJ3N0cmlwLWpzb24tY29tbWVudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW50ZXJKU0NTIHtcblxuICBzdGF0aWMgY29uZmlnID0ge1xuICAgIHByZXNldDoge1xuICAgICAgdGl0bGU6ICdQcmVzZXQnLFxuICAgICAgZGVzY3JpcHRpb246ICdQcmVzZXQgb3B0aW9uIGlzIGlnbm9yZWQgaWYgYSBjb25maWcgZmlsZSBpcyBmb3VuZCBmb3IgdGhlIGxpbnRlci4nLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnYWlyYm5iJyxcbiAgICAgIGVudW06IFsnYWlyYm5iJywgJ2Nyb2NrZm9yZCcsICdnb29nbGUnLCAnZ3J1bnQnLCAnanF1ZXJ5JywgJ21kY3MnLCAnbm9kZS1zdHlsZS1ndWlkZScsICd3aWtpbWVkaWEnLCAnd29yZHByZXNzJywgJ3lhbmRleCddXG4gICAgfSxcbiAgICBlc25leHQ6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXR0ZW1wdHMgdG8gcGFyc2UgeW91ciBjb2RlIGFzIEVTNissIEpTWCwgYW5kIEZsb3cgdXNpbmcgdGhlIGJhYmVsLWpzY3MgcGFja2FnZSBhcyB0aGUgcGFyc2VyLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgb25seUNvbmZpZzoge1xuICAgICAgdGl0bGU6ICdPbmx5IENvbmZpZycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Rpc2FibGUgbGludGVyIGlmIHRoZXJlIGlzIG5vIGNvbmZpZyBmaWxlIGZvdW5kIGZvciB0aGUgbGludGVyLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgZml4T25TYXZlOiB7XG4gICAgICB0aXRsZTogJ0ZpeCBvbiBzYXZlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRml4IEphdmFTY3JpcHQgb24gc2F2ZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgZGlzcGxheUFzOiB7XG4gICAgICB0aXRsZTogJ0Rpc3BsYXkgZXJyb3JzIGFzJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ2Vycm9yJyxcbiAgICAgIGVudW06IFsnZXJyb3InLCAnd2FybmluZyddXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldCBwcmVzZXQoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MucHJlc2V0Jyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGVzbmV4dCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5lc25leHQnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgb25seUNvbmZpZygpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5vbmx5Q29uZmlnJyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGZpeE9uU2F2ZSgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5maXhPblNhdmUnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGlzcGxheUFzKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLmRpc3BsYXlBcycpO1xuICB9XG5cbiAgc3RhdGljIGFjdGl2YXRlKCkge1xuICAgIC8vIEluc3RhbGwgZGVwZW5kZW5jaWVzIHVzaW5nIGF0b20tcGFja2FnZS1kZXBzXG4gICAgcmVxdWlyZShcImF0b20tcGFja2FnZS1kZXBzXCIpLmluc3RhbGwoXCJsaW50ZXItanNjc1wiKTtcblxuICAgIHRoaXMub2JzZXJ2ZXIgPSBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLm9uV2lsbFNhdmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5maXhPblNhdmUpIHtcbiAgICAgICAgICB0aGlzLmZpeFN0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMub2JzZXJ2ZXIuZGlzcG9zZSgpO1xuICB9XG5cbiAgc3RhdGljIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmpzJywgJ3NvdXJjZS5qcy5qc3gnXSxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiAoZWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IEpTQ1MgPSByZXF1aXJlKCdqc2NzJyk7XG5cbiAgICAgICAgLy8gV2UgbmVlZCByZS1pbml0aWFsaXplIEpTQ1MgYmVmb3JlIGV2ZXJ5IGxpbnRcbiAgICAgICAgLy8gb3IgaXQgd2lsbCBsb29zZXMgdGhlIGVycm9ycywgZGlkbid0IHRyYWNlIHRoZSBlcnJvclxuICAgICAgICAvLyBtdXN0IGJlIHNvbWV0aGluZyB3aXRoIG5ldyAyLjAuMCBKU0NTXG4gICAgICAgIHRoaXMuanNjcyA9IG5ldyBKU0NTKCk7XG4gICAgICAgIHRoaXMuanNjcy5yZWdpc3RlckRlZmF1bHRSdWxlcygpO1xuXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgY29uZmlnRmlsZXMgPSBbJy5qc2NzcmMnLCAnLmpzY3MuanNvbicsICdwYWNrYWdlLmpzb24nXTtcblxuICAgICAgICAvLyBTZWFyY2ggZm9yIHByb2plY3QgY29uZmlnIGZpbGVcbiAgICAgICAgbGV0IGNvbmZpZyA9IGZpbmRGaWxlKGZpbGVQYXRoLCBjb25maWdGaWxlcyk7XG5cbiAgICAgICAgLy8gUmVzZXQgY29uZmlnIGlmIGBqc2NzQ29uZmlnYCBpcyBub3QgZm91bmQgaW4gYHBhY2thZ2UuanNvbmBcbiAgICAgICAgaWYgKGNvbmZpZyAmJiBjb25maWcuaW5kZXhPZigncGFja2FnZS5qc29uJykgPiAtMSkge1xuICAgICAgICAgIGNvbnN0IHsganNjc0NvbmZpZyB9ID0gcmVxdWlyZShjb25maWcpO1xuICAgICAgICAgIGlmICghanNjc0NvbmZpZykgY29uZmlnID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNlYXJjaCBmb3IgaG9tZSBjb25maWcgZmlsZVxuICAgICAgICBpZiAoIWNvbmZpZykge1xuICAgICAgICAgIGNvbnN0IGhvbWVEaXIgPSByZXF1aXJlKCd1c2VyLWhvbWUnKTtcbiAgICAgICAgICBpZiAoaG9tZURpcikgY29uZmlnID0gZmluZEZpbGUoaG9tZURpciwgY29uZmlnRmlsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3B0aW9ucyBwYXNzZWQgdG8gYGpzY3NgIGZyb20gcGFja2FnZSBjb25maWd1cmF0aW9uXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGVzbmV4dDogdGhpcy5lc25leHQsIHByZXNldDogdGhpcy5wcmVzZXQgfTtcblxuICAgICAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhd0NvbmZpZyA9IHJlYWRGaWxlU3luYyhjb25maWcsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgICAgICAgICAgIGxldCBwYXJzZWRDb25maWcgPSBKU09OLnBhcnNlKHN0cmlwSlNPTkNvbW1lbnRzKHJhd0NvbmZpZykpO1xuXG4gICAgICAgICAgICBpZiAoY29uZmlnLmluZGV4T2YoJ3BhY2thZ2UuanNvbicpID4gLTEpIHtcbiAgICAgICAgICAgICAgaWYgKHBhcnNlZENvbmZpZy5qc2NzQ29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VkQ29uZmlnID0gcGFyc2VkQ29uZmlnLmpzY3NDb25maWc7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBganNjc0NvbmZpZ2Aga2V5IGluIGBwYWNrYWdlLmpzb25gJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5qc2NzLmNvbmZpZ3VyZShwYXJzZWRDb25maWcpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAvLyBXYXJuIHVzZXIgb25seSBvbmNlXG4gICAgICAgICAgICBpZiAoIXRoaXMud2FybkxvY2FsQ29uZmlnKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybignW2xpbnRlci1qc2NzXSBObyBjb25maWcgZm91bmQsIG9yIGVycm9yIHdoaWxlIGxvYWRpbmcgaXQuJyk7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvci5zdGFjayk7XG4gICAgICAgICAgICAgIHRoaXMud2FybkxvY2FsQ29uZmlnID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVzZXQgY29uZmlnIHRvIG51bGxcbiAgICAgICAgICAgIGNvbmZpZyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmpzY3MuY29uZmlndXJlKG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmpzY3MuY29uZmlndXJlKG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2UgZG9uJ3QgaGF2ZSBhIGNvbmZpZyBmaWxlIHByZXNlbnQgaW4gcHJvamVjdCBkaXJlY3RvcnlcbiAgICAgICAgLy8gbGV0J3MgcmV0dXJuIGFuIGVtcHR5IGFycmF5IG9mIGVycm9yc1xuICAgICAgICBpZiAoIWNvbmZpZyAmJiB0aGlzLm9ubHlDb25maWcpIHJldHVybiBbXTtcblxuICAgICAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgZXJyb3JzID0gdGhpcy5qc2NzXG4gICAgICAgICAgLmNoZWNrU3RyaW5nKHRleHQsIGZpbGVQYXRoKVxuICAgICAgICAgIC5nZXRFcnJvckxpc3QoKTtcblxuICAgICAgICByZXR1cm4gZXJyb3JzLm1hcCgoeyBydWxlLCBtZXNzYWdlLCBsaW5lLCBjb2x1bW4gfSkgPT4ge1xuXG4gICAgICAgICAgLy8gQ2FsY3VsYXRlIHJhbmdlIHRvIG1ha2UgdGhlIGVycm9yIHdob2xlIGxpbmVcbiAgICAgICAgICAvLyB3aXRob3V0IHRoZSBpbmRlbnRhdGlvbiBhdCBiZWdpbmluZyBvZiBsaW5lXG4gICAgICAgICAgY29uc3QgaW5kZW50TGV2ZWwgPSBlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3cobGluZSAtIDEpO1xuICAgICAgICAgIGNvbnN0IHN0YXJ0Q29sID0gZWRpdG9yLmdldFRhYkxlbmd0aCgpICogaW5kZW50TGV2ZWw7XG4gICAgICAgICAgY29uc3QgZW5kQ29sID0gZWRpdG9yLmdldEJ1ZmZlcigpLmxpbmVMZW5ndGhGb3JSb3cobGluZSAtIDEpO1xuICAgICAgICAgIGNvbnN0IHJhbmdlID0gW1tsaW5lIC0gMSwgc3RhcnRDb2xdLCBbbGluZSAtIDEsIGVuZENvbF1dO1xuXG4gICAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMuZGlzcGxheUFzO1xuICAgICAgICAgIGNvbnN0IGh0bWwgPSBgPHNwYW4gY2xhc3M9J2JhZGdlIGJhZGdlLWZsZXhpYmxlJz4ke3J1bGV9PC9zcGFuPiAke21lc3NhZ2V9YDtcblxuICAgICAgICAgIHJldHVybiB7IHR5cGUsIGh0bWwsIGZpbGVQYXRoLCByYW5nZSB9O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZpeFN0cmluZygpIHtcbiAgICBpZiAoIXRoaXMuaXNNaXNzaW5nQ29uZmlnICYmICF0aGlzLm9ubHlDb25maWcpIHtcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgIGNvbnN0IHBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG5cbiAgICAgIHJldHVybiBlZGl0b3Iuc2V0VGV4dCh0aGlzLmpzY3MuZml4U3RyaW5nKHRleHQsIHBhdGgpLm91dHB1dCk7XG4gICAgfVxuICB9XG59O1xuIl19
//# sourceURL=/Users/Kamilius/.atom/packages/linter-jscs/index.js
