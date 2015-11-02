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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNjcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O29CQUNELE1BQU07OzBCQUNILGFBQWE7O2tCQUNULElBQUk7O2lDQUNILHFCQUFxQjs7OztBQU5uRCxXQUFXLENBQUM7O0lBUVMsVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0F1RGQsb0JBQUc7OztBQUNoQixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDNUQsY0FBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFNO0FBQ2xDLGNBQUksTUFBSyxTQUFTLEVBQUU7QUFDbEIsa0JBQUssU0FBUyxFQUFFLENBQUM7V0FDbEI7U0FDRixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1dBRWdCLHNCQUFHO0FBQ2xCLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDekI7OztXQUVtQix5QkFBRzs7O0FBQ3JCLGFBQU87QUFDTCxxQkFBYSxFQUFFLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQztBQUM3QyxhQUFLLEVBQUUsTUFBTTtBQUNiLGlCQUFTLEVBQUUsSUFBSTtBQUNmLFlBQUksRUFBRSxjQUFDLE1BQU0sRUFBSzs7OztBQUloQixpQkFBSyxJQUFJLEdBQUcsdUJBQVUsQ0FBQztBQUN2QixpQkFBSyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7QUFFakMsY0FBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xDLGNBQU0sV0FBVyxHQUFHLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQzs7O0FBRzlELGNBQUksTUFBTSxHQUFHLGdCQXpGWixRQUFRLEVBeUZhLFFBQVEsRUFB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VyxFQUFFLGdHQUFnRztBQUM3RyxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7T0FDZjtBQUNELGdCQUFVLEVBQUU7QUFDVixhQUFLLEVBQUUsYUFBYTtBQUNwQixtQkFBVyxFQUFFLGlFQUFpRTtBQUM5RSxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7T0FDZjtBQUNELGVBQVMsRUFBRTtBQUNULGFBQUssRUFBRSxhQUFhO0FBQ3BCLG1CQUFXLEVBQUUsd0JBQXdCO0FBQ3JDLFlBQUksRUFBRSxTQUFTO0FBQ2YsbUJBQVMsS0FBSztPQUNmO0FBQ0QsZUFBUyxFQUFFO0FBQ1QsYUFBSyxFQUFFLG1CQUFtQjtBQUMxQixZQUFJLEVBQUUsUUFBUTtBQUNkLG1CQUFTLE9BQU87QUFDaEIsZ0JBQU0sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO09BQzNCO0tBQ0Y7Ozs7U0FFZ0IsZUFBRztBQUNsQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDOUM7OztTQUVnQixlQUFHO0FBQ2xCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUM5Qzs7O1NBRW9CLGVBQUc7QUFDdEIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tBQ2xEOzs7U0FFbUIsZUFBRztBQUNyQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDakQ7OztTQUVtQixlQUFHO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUNqRDs7O1NBckRrQixVQUFVOzs7cUJBQVYsVUFBVTtBQXdLOUIsQ0FBQyIsImZpbGUiOiIvVXNlcnMvS2FtaWxpdXMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3MvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IEpTQ1MgZnJvbSAnanNjcyc7XG5pbXBvcnQgeyBSYW5nZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgZmluZEZpbGUgfSBmcm9tICdhdG9tLWxpbnRlcic7XG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgc3RyaXBKU09OQ29tbWVudHMgZnJvbSAnc3RyaXAtanNvbi1jb21tZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbnRlckpTQ1Mge1xuXG4gIHN0YXRpYyBjb25maWcgPSB7XG4gICAgcHJlc2V0OiB7XG4gICAgICB0aXRsZTogJ1ByZXNldCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1ByZXNldCBvcHRpb24gaXMgaWdub3JlZCBpZiBhIGNvbmZpZyBmaWxlIGlzIGZvdW5kIGZvciB0aGUgbGludGVyLicsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdhaXJibmInLFxuICAgICAgZW51bTogWydhaXJibmInLCAnY3JvY2tmb3JkJywgJ2dvb2dsZScsICdncnVudCcsICdqcXVlcnknLCAnbWRjcycsICdub2RlLXN0eWxlLWd1aWRlJywgJ3dpa2ltZWRpYScsICd5YW5kZXgnXVxuICAgIH0sXG4gICAgZXNuZXh0OiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ0F0dGVtcHRzIHRvIHBhcnNlIHlvdXIgY29kZSBhcyBFUzYrLCBKU1gsIGFuZCBGbG93IHVzaW5nIHRoZSBiYWJlbC1qc2NzIHBhY2thZ2UgYXMgdGhlIHBhcnNlci4nLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIG9ubHlDb25maWc6IHtcbiAgICAgIHRpdGxlOiAnT25seSBDb25maWcnLFxuICAgICAgZGVzY3JpcHRpb246ICdEaXNhYmxlIGxpbnRlciBpZiB0aGVyZSBpcyBubyBjb25maWcgZmlsZSBmb3VuZCBmb3IgdGhlIGxpbnRlci4nLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIGZpeE9uU2F2ZToge1xuICAgICAgdGl0bGU6ICdGaXggb24gc2F2ZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZpeCBKYXZhU2NyaXB0IG9uIHNhdmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIGRpc3BsYXlBczoge1xuICAgICAgdGl0bGU6ICdEaXNwbGF5IGVycm9ycyBhcycsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdlcnJvcicsXG4gICAgICBlbnVtOiBbJ2Vycm9yJywgJ3dhcm5pbmcnXVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXQgcHJlc2V0KCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLnByZXNldCcpO1xuICB9XG5cbiAgc3RhdGljIGdldCBlc25leHQoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MuZXNuZXh0Jyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IG9ubHlDb25maWcoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3Mub25seUNvbmZpZycpO1xuICB9XG5cbiAgc3RhdGljIGdldCBmaXhPblNhdmUoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MuZml4T25TYXZlJyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGRpc3BsYXlBcygpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5kaXNwbGF5QXMnKTtcbiAgfVxuXG4gIHN0YXRpYyBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLm9ic2VydmVyID0gYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5vbldpbGxTYXZlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZml4T25TYXZlKSB7XG4gICAgICAgICAgdGhpcy5maXhTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLm9ic2VydmVyLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHN0YXRpYyBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5qcycsICdzb3VyY2UuanMuanN4J10sXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogKGVkaXRvcikgPT4ge1xuICAgICAgICAvLyBXZSBuZWVkIHJlLWluaXRpYWxpemUgSlNDUyBiZWZvcmUgZXZlcnkgbGludFxuICAgICAgICAvLyBvciBpdCB3aWxsIGxvb3NlcyB0aGUgZXJyb3JzLCBkaWRuJ3QgdHJhY2UgdGhlIGVycm9yXG4gICAgICAgIC8vIG11c3QgYmUgc29tZXRoaW5nIHdpdGggbmV3IDIuMC4wIEpTQ1NcbiAgICAgICAgdGhpcy5qc2NzID0gbmV3IEpTQ1MoKTtcbiAgICAgICAgdGhpcy5qc2NzLnJlZ2lzdGVyRGVmYXVsdFJ1bGVzKCk7XG5cbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBjb25zdCBjb25maWdGaWxlcyA9IFsnLmpzY3NyYycsICcuanNjcy5qc29uJywgJ3BhY2thZ2UuanNvbiddO1xuXG4gICAgICAgIC8vIFNlYXJjaCBmb3IgcHJvamVjdCBjb25maWcgZmlsZVxuICAgICAgICBsZXQgY29uZmlnID0gZmluZEZpbGUoZmlsZVBhdGgsIGNvbmZpZ0ZpbGVzKTtcblxuICAgICAgICAvLyBSZXNldCBjb25maWcgaWYgYGpzY3NDb25maWdgIGlzIG5vdCBmb3VuZCBpbiBgcGFja2FnZS5qc29uYFxuICAgICAgICBpZiAoY29uZmlnICYmIGNvbmZpZy5pbmRleE9mKCdwYWNrYWdlLmpzb24nKSA+IC0xKSB7XG4gICAgICAgICAgY29uc3QgeyBqc2NzQ29uZmlnIH0gPSByZXF1aXJlKGNvbmZpZyk7XG4gICAgICAgICAgaWYgKCFqc2NzQ29uZmlnKSBjb25maWcgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VhcmNoIGZvciBob21lIGNvbmZpZyBmaWxlXG4gICAgICAgIGlmICghY29uZmlnKSB7XG4gICAgICAgICAgY29uc3QgaG9tZURpciA9IHJlcXVpcmUoJ3VzZXItaG9tZScpO1xuICAgICAgICAgIGlmIChob21lRGlyKSBjb25maWcgPSBmaW5kRmlsZShob21lRGlyLCBjb25maWdGaWxlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPcHRpb25zIHBhc3NlZCB0byBganNjc2AgZnJvbSBwYWNrYWdlIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgZXNuZXh0OiB0aGlzLmVzbmV4dCwgcHJlc2V0OiB0aGlzLnByZXNldCB9O1xuXG4gICAgICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmF3Q29uZmlnID0gcmVhZEZpbGVTeW5jKGNvbmZpZywgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgICAgICAgICAgbGV0IHBhcnNlZENvbmZpZyA9IEpTT04ucGFyc2Uoc3RyaXBKU09OQ29tbWVudHMocmF3Q29uZmlnKSk7XG5cbiAgICAgICAgICAgIGlmIChjb25maWcuaW5kZXhPZigncGFja2FnZS5qc29uJykgPiAtMSkge1xuICAgICAgICAgICAgICBpZiAocGFyc2VkQ29uZmlnLmpzY3NDb25maWcpIHtcbiAgICAgICAgICAgICAgICBwYXJzZWRDb25maWcgPSBwYXJzZWRDb25maWcuanNjc0NvbmZpZztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGBqc2NzQ29uZmlnYCBrZXkgaW4gYHBhY2thZ2UuanNvbmAnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmpzY3MuY29uZmlndXJlKHBhcnNlZENvbmZpZyk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIFdhcm4gdXNlciBvbmx5IG9uY2VcbiAgICAgICAgICAgIGlmICghdGhpcy53YXJuTG9jYWxDb25maWcpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdbbGludGVyLWpzY3NdIE5vIGNvbmZpZyBmb3VuZCwgb3IgZXJyb3Igd2hpbGUgbG9hZGluZyBpdC4nKTtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycm9yLnN0YWNrKTtcbiAgICAgICAgICAgICAgdGhpcy53YXJuTG9jYWxDb25maWcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZXNldCBjb25maWcgdG8gbnVsbFxuICAgICAgICAgICAgY29uZmlnID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuanNjcy5jb25maWd1cmUob3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuanNjcy5jb25maWd1cmUob3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZSBkb24ndCBoYXZlIGEgY29uZmlnIGZpbGUgcHJlc2VudCBpbiBwcm9qZWN0IGRpcmVjdG9yeVxuICAgICAgICAvLyBsZXQncyByZXR1cm4gYW4gZW1wdHkgYXJyYXkgb2YgZXJyb3JzXG4gICAgICAgIGlmICghY29uZmlnICYmIHRoaXMub25seUNvbmZpZykgcmV0dXJuIFtdO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBlcnJvcnMgPSB0aGlzLmpzY3NcbiAgICAgICAgICAuY2hlY2tTdHJpbmcodGV4dCwgZmlsZVBhdGgpXG4gICAgICAgICAgLmdldEVycm9yTGlzdCgpO1xuXG4gICAgICAgIHJldHVybiBlcnJvcnMubWFwKCh7IHJ1bGUsIG1lc3NhZ2UsIGxpbmUsIGNvbHVtbiB9KSA9PiB7XG5cbiAgICAgICAgICAvLyBDYWxjdWxhdGUgcmFuZ2UgdG8gbWFrZSB0aGUgZXJyb3Igd2hvbGUgbGluZVxuICAgICAgICAgIC8vIHdpdGhvdXQgdGhlIGluZGVudGF0aW9uIGF0IGJlZ2luaW5nIG9mIGxpbmVcbiAgICAgICAgICBjb25zdCBpbmRlbnRMZXZlbCA9IGVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhsaW5lIC0gMSk7XG4gICAgICAgICAgY29uc3Qgc3RhcnRDb2wgPSBlZGl0b3IuZ2V0VGFiTGVuZ3RoKCkgKiBpbmRlbnRMZXZlbDtcbiAgICAgICAgICBjb25zdCBlbmRDb2wgPSBlZGl0b3IuZ2V0QnVmZmVyKCkubGluZUxlbmd0aEZvclJvdyhsaW5lIC0gMSk7XG4gICAgICAgICAgY29uc3QgcmFuZ2UgPSBbW2xpbmUgLSAxLCBzdGFydENvbF0sIFtsaW5lIC0gMSwgZW5kQ29sXV07XG5cbiAgICAgICAgICBjb25zdCB0eXBlID0gdGhpcy5kaXNwbGF5QXM7XG4gICAgICAgICAgY29uc3QgaHRtbCA9IGA8c3BhbiBjbGFzcz0nYmFkZ2UgYmFkZ2UtZmxleGlibGUnPiR7cnVsZX08L3NwYW4+ICR7bWVzc2FnZX1gO1xuXG4gICAgICAgICAgcmV0dXJuIHsgdHlwZSwgaHRtbCwgZmlsZVBhdGgsIHJhbmdlIH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZml4U3RyaW5nKCkge1xuICAgIGlmICghdGhpcy5pc01pc3NpbmdDb25maWcgJiYgIXRoaXMub25seUNvbmZpZykge1xuICAgICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgY29uc3QgcGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcblxuICAgICAgcmV0dXJuIGVkaXRvci5zZXRUZXh0KHRoaXMuanNjcy5maXhTdHJpbmcodGV4dCwgcGF0aCkub3V0cHV0KTtcbiAgICB9XG4gIH1cbn07XG4iXX0=