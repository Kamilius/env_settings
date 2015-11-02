Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jscs = require('jscs');

var _jscs2 = _interopRequireDefault(_jscs);

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
          // We need re-initialize JSCS before every lint
          // or it will looses the errors, didn't trace the error
          // must be something with new 2.0.0 JSCS
          _this2.jscs = new _jscs2['default']();
          _this2.jscs.registerDefaultRules();

          var filePath = editor.getPath();
          var configFiles = ['.jscsrc', '.jscs.json', 'package.json'];

          // Search for project config file
          var config = (0, _atomLinter.findFile)(filePath, configFiles);

          // Set config to `null` if `jscsConfig` is found in `package.json`
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

              _this2.isMissingConfig = true;
              _this2.jscs.configure(options);
            }
          } else {
            _this2.jscs.configure(options);
          }

          // We don't have a config file present in project directory
          // let's return an empty array of errors
          if (_this2.isMissingConfig && _this2.onlyConfig) return [];

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
        'enum': ['airbnb', 'crockford', 'google', 'grunt', 'jquery', 'mdcs', 'node-style-guide', 'wikimedia', 'yandex']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNjcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O29CQUNELE1BQU07OzBCQUNILGFBQWE7O2tCQUNULElBQUk7O2lDQUNILHFCQUFxQjs7OztBQU5uRCxXQUFXLENBQUM7O0lBUVMsVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0F1RGQsb0JBQUc7OztBQUNoQixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDNUQsY0FBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFNO0FBQ2xDLGNBQUksTUFBSyxTQUFTLEVBQUU7QUFDbEIsa0JBQUssU0FBUyxFQUFFLENBQUM7V0FDbEI7U0FDRixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1dBRWdCLHNCQUFHO0FBQ2xCLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDekI7OztXQUVtQix5QkFBRzs7O0FBQ3JCLGFBQU87QUFDTCxxQkFBYSxFQUFFLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQztBQUM3QyxhQUFLLEVBQUUsTUFBTTtBQUNiLGlCQUFTLEVBQUUsSUFBSTtBQUNmLFlBQUksRUFBRSxjQUFDLE1BQU0sRUFBSzs7OztBQUloQixpQkFBSyxJQUFJLEdBQUcsdUJBQVUsQ0FBQztBQUN2QixpQkFBSyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7QUFFakMsY0FBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xDLGNBQU0sV0FBVyxHQUFHLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQzs7O0FBRzlELGNBQUksTUFBTSxHQUFHLGdCQXpGWixRQUFRLEVBeUZhLFFBQVEsRUFB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LG1CQUFXLEVBQUUsZ0dBQWdHO0FBQzdHLFlBQUksRUFBRSxTQUFTO0FBQ2YsbUJBQVMsS0FBSztPQUNmO0FBQ0QsZ0JBQVUsRUFBRTtBQUNWLGFBQUssRUFBRSxhQUFhO0FBQ3BCLG1CQUFXLEVBQUUsaUVBQWlFO0FBQzlFLFlBQUksRUFBRSxTQUFTO0FBQ2YsbUJBQVMsS0FBSztPQUNmO0FBQ0QsZUFBUyxFQUFFO0FBQ1QsYUFBSyxFQUFFLGFBQWE7QUFDcEIsbUJBQVcsRUFBRSx3QkFBd0I7QUFDckMsWUFBSSxFQUFFLFNBQVM7QUFDZixtQkFBUyxLQUFLO09BQ2Y7QUFDRCxlQUFTLEVBQUU7QUFDVCxhQUFLLEVBQUUsbUJBQW1CO0FBQzFCLFlBQUksRUFBRSxRQUFRO0FBQ2QsbUJBQVMsT0FBTztBQUNoQixnQkFBTSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUM7T0FDM0I7S0FDRjs7OztTQUVnQixlQUFHO0FBQ2xCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUM5Qzs7O1NBRWdCLGVBQUc7QUFDbEIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQzlDOzs7U0FFb0IsZUFBRztBQUN0QixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDbEQ7OztTQUVtQixlQUFHO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUNqRDs7O1NBRW1CLGVBQUc7QUFDckIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0tBQ2pEOzs7U0FyRGtCLFVBQVU7OztxQkFBVixVQUFVO0FBdUs5QixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNjcy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgSlNDUyBmcm9tICdqc2NzJztcbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgeyBmaW5kRmlsZSB9IGZyb20gJ2F0b20tbGludGVyJztcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCBzdHJpcEpTT05Db21tZW50cyBmcm9tICdzdHJpcC1qc29uLWNvbW1lbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGludGVySlNDUyB7XG5cbiAgc3RhdGljIGNvbmZpZyA9IHtcbiAgICBwcmVzZXQ6IHtcbiAgICAgIHRpdGxlOiAnUHJlc2V0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUHJlc2V0IG9wdGlvbiBpcyBpZ25vcmVkIGlmIGEgY29uZmlnIGZpbGUgaXMgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ2FpcmJuYicsXG4gICAgICBlbnVtOiBbJ2FpcmJuYicsICdjcm9ja2ZvcmQnLCAnZ29vZ2xlJywgJ2dydW50JywgJ2pxdWVyeScsICdtZGNzJywgJ25vZGUtc3R5bGUtZ3VpZGUnLCAnd2lraW1lZGlhJywgJ3lhbmRleCddXG4gICAgfSxcbiAgICBlc25leHQ6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXR0ZW1wdHMgdG8gcGFyc2UgeW91ciBjb2RlIGFzIEVTNissIEpTWCwgYW5kIEZsb3cgdXNpbmcgdGhlIGJhYmVsLWpzY3MgcGFja2FnZSBhcyB0aGUgcGFyc2VyLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgb25seUNvbmZpZzoge1xuICAgICAgdGl0bGU6ICdPbmx5IENvbmZpZycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Rpc2FibGUgbGludGVyIGlmIHRoZXJlIGlzIG5vIGNvbmZpZyBmaWxlIGZvdW5kIGZvciB0aGUgbGludGVyLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgZml4T25TYXZlOiB7XG4gICAgICB0aXRsZTogJ0ZpeCBvbiBzYXZlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRml4IEphdmFTY3JpcHQgb24gc2F2ZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgZGlzcGxheUFzOiB7XG4gICAgICB0aXRsZTogJ0Rpc3BsYXkgZXJyb3JzIGFzJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ2Vycm9yJyxcbiAgICAgIGVudW06IFsnZXJyb3InLCAnd2FybmluZyddXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldCBwcmVzZXQoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MucHJlc2V0Jyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGVzbmV4dCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5lc25leHQnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgb25seUNvbmZpZygpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5vbmx5Q29uZmlnJyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGZpeE9uU2F2ZSgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5maXhPblNhdmUnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGlzcGxheUFzKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLmRpc3BsYXlBcycpO1xuICB9XG5cbiAgc3RhdGljIGFjdGl2YXRlKCkge1xuICAgIHRoaXMub2JzZXJ2ZXIgPSBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLm9uV2lsbFNhdmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5maXhPblNhdmUpIHtcbiAgICAgICAgICB0aGlzLmZpeFN0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMub2JzZXJ2ZXIuZGlzcG9zZSgpO1xuICB9XG5cbiAgc3RhdGljIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmpzJywgJ3NvdXJjZS5qcy5qc3gnXSxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiAoZWRpdG9yKSA9PiB7XG4gICAgICAgIC8vIFdlIG5lZWQgcmUtaW5pdGlhbGl6ZSBKU0NTIGJlZm9yZSBldmVyeSBsaW50XG4gICAgICAgIC8vIG9yIGl0IHdpbGwgbG9vc2VzIHRoZSBlcnJvcnMsIGRpZG4ndCB0cmFjZSB0aGUgZXJyb3JcbiAgICAgICAgLy8gbXVzdCBiZSBzb21ldGhpbmcgd2l0aCBuZXcgMi4wLjAgSlNDU1xuICAgICAgICB0aGlzLmpzY3MgPSBuZXcgSlNDUygpO1xuICAgICAgICB0aGlzLmpzY3MucmVnaXN0ZXJEZWZhdWx0UnVsZXMoKTtcblxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGNvbmZpZ0ZpbGVzID0gWycuanNjc3JjJywgJy5qc2NzLmpzb24nLCAncGFja2FnZS5qc29uJ107XG5cbiAgICAgICAgLy8gU2VhcmNoIGZvciBwcm9qZWN0IGNvbmZpZyBmaWxlXG4gICAgICAgIGxldCBjb25maWcgPSBmaW5kRmlsZShmaWxlUGF0aCwgY29uZmlnRmlsZXMpO1xuXG4gICAgICAgIC8vIFNldCBjb25maWcgdG8gYG51bGxgIGlmIGBqc2NzQ29uZmlnYCBpcyBmb3VuZCBpbiBgcGFja2FnZS5qc29uYFxuICAgICAgICBpZiAoY29uZmlnICYmIGNvbmZpZy5pbmRleE9mKCdwYWNrYWdlLmpzb24nKSA+IC0xKSB7XG4gICAgICAgICAgY29uc3QgeyBqc2NzQ29uZmlnIH0gPSByZXF1aXJlKGNvbmZpZyk7XG4gICAgICAgICAgaWYgKCFqc2NzQ29uZmlnKSBjb25maWcgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VhcmNoIGZvciBob21lIGNvbmZpZyBmaWxlXG4gICAgICAgIGlmICghY29uZmlnKSB7XG4gICAgICAgICAgY29uc3QgaG9tZURpciA9IHJlcXVpcmUoJ3VzZXItaG9tZScpO1xuICAgICAgICAgIGlmIChob21lRGlyKSBjb25maWcgPSBmaW5kRmlsZShob21lRGlyLCBjb25maWdGaWxlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPcHRpb25zIHBhc3NlZCB0byBganNjc2AgZnJvbSBwYWNrYWdlIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgZXNuZXh0OiB0aGlzLmVzbmV4dCwgcHJlc2V0OiB0aGlzLnByZXNldCB9O1xuXG4gICAgICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmF3Q29uZmlnID0gcmVhZEZpbGVTeW5jKGNvbmZpZywgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgICAgICAgICAgbGV0IHBhcnNlZENvbmZpZyA9IEpTT04ucGFyc2Uoc3RyaXBKU09OQ29tbWVudHMocmF3Q29uZmlnKSk7XG5cbiAgICAgICAgICAgIGlmIChjb25maWcuaW5kZXhPZigncGFja2FnZS5qc29uJykgPiAtMSkge1xuICAgICAgICAgICAgICBpZiAocGFyc2VkQ29uZmlnLmpzY3NDb25maWcpIHtcbiAgICAgICAgICAgICAgICBwYXJzZWRDb25maWcgPSBwYXJzZWRDb25maWcuanNjc0NvbmZpZztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGBqc2NzQ29uZmlnYCBrZXkgaW4gYHBhY2thZ2UuanNvbmAnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmpzY3MuY29uZmlndXJlKHBhcnNlZENvbmZpZyk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIFdhcm4gdXNlciBvbmx5IG9uY2VcbiAgICAgICAgICAgIGlmICghdGhpcy53YXJuTG9jYWxDb25maWcpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdbbGludGVyLWpzY3NdIE5vIGNvbmZpZyBmb3VuZCwgb3IgZXJyb3Igd2hpbGUgbG9hZGluZyBpdC4nKTtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycm9yLnN0YWNrKTtcbiAgICAgICAgICAgICAgdGhpcy53YXJuTG9jYWxDb25maWcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmlzTWlzc2luZ0NvbmZpZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmpzY3MuY29uZmlndXJlKG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmpzY3MuY29uZmlndXJlKG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2UgZG9uJ3QgaGF2ZSBhIGNvbmZpZyBmaWxlIHByZXNlbnQgaW4gcHJvamVjdCBkaXJlY3RvcnlcbiAgICAgICAgLy8gbGV0J3MgcmV0dXJuIGFuIGVtcHR5IGFycmF5IG9mIGVycm9yc1xuICAgICAgICBpZiAodGhpcy5pc01pc3NpbmdDb25maWcgJiYgdGhpcy5vbmx5Q29uZmlnKSByZXR1cm4gW107XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGVycm9ycyA9IHRoaXMuanNjc1xuICAgICAgICAgIC5jaGVja1N0cmluZyh0ZXh0LCBmaWxlUGF0aClcbiAgICAgICAgICAuZ2V0RXJyb3JMaXN0KCk7XG5cbiAgICAgICAgcmV0dXJuIGVycm9ycy5tYXAoKHsgcnVsZSwgbWVzc2FnZSwgbGluZSwgY29sdW1uIH0pID0+IHtcblxuICAgICAgICAgIC8vIENhbGN1bGF0ZSByYW5nZSB0byBtYWtlIHRoZSBlcnJvciB3aG9sZSBsaW5lXG4gICAgICAgICAgLy8gd2l0aG91dCB0aGUgaW5kZW50YXRpb24gYXQgYmVnaW5pbmcgb2YgbGluZVxuICAgICAgICAgIGNvbnN0IGluZGVudExldmVsID0gZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KGxpbmUgLSAxKTtcbiAgICAgICAgICBjb25zdCBzdGFydENvbCA9IGVkaXRvci5nZXRUYWJMZW5ndGgoKSAqIGluZGVudExldmVsO1xuICAgICAgICAgIGNvbnN0IGVuZENvbCA9IGVkaXRvci5nZXRCdWZmZXIoKS5saW5lTGVuZ3RoRm9yUm93KGxpbmUgLSAxKTtcbiAgICAgICAgICBjb25zdCByYW5nZSA9IFtbbGluZSAtIDEsIHN0YXJ0Q29sXSwgW2xpbmUgLSAxLCBlbmRDb2xdXTtcblxuICAgICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLmRpc3BsYXlBcztcbiAgICAgICAgICBjb25zdCBodG1sID0gYDxzcGFuIGNsYXNzPSdiYWRnZSBiYWRnZS1mbGV4aWJsZSc+JHtydWxlfTwvc3Bhbj4gJHttZXNzYWdlfWA7XG5cbiAgICAgICAgICByZXR1cm4geyB0eXBlLCBodG1sLCBmaWxlUGF0aCwgcmFuZ2UgfTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmaXhTdHJpbmcoKSB7XG4gICAgaWYgKCF0aGlzLmlzTWlzc2luZ0NvbmZpZyAmJiAhdGhpcy5vbmx5Q29uZmlnKSB7XG4gICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICBjb25zdCBwYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuXG4gICAgICByZXR1cm4gZWRpdG9yLnNldFRleHQodGhpcy5qc2NzLmZpeFN0cmluZyh0ZXh0LCBwYXRoKS5vdXRwdXQpO1xuICAgIH1cbiAgfVxufTtcbiJdfQ==