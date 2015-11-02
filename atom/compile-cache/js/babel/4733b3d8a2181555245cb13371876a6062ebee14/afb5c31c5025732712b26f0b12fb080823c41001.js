Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jscsLibCliConfig = require('jscs/lib/cli-config');

var _jscsLibCliConfig2 = _interopRequireDefault(_jscsLibCliConfig);

'use babel';

var grammarScopes = ['source.js', 'source.js.jsx'];

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
          if (grammarScopes.indexOf(editor.getGrammar().scopeName) !== -1 && _this.fixOnSave) {
            process.nextTick(function () {
              _this.fixString();
            });
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
        name: 'JSCS',
        grammarScopes: grammarScopes,
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
          var config = _jscsLibCliConfig2['default'].load(false, _path2['default'].dirname(filePath));

          // Options passed to `jscs` from package configuration
          var options = { esnext: _this2.esnext, preset: _this2.preset };

          _this2.jscs.configure(config || options);

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
      if (this.isMissingConfig && this.onlyConfig) return;

      var editor = atom.workspace.getActiveTextEditor();
      var path = editor.getPath();
      var text = editor.getText();
      var fixedText = this.jscs.fixString(text, path).output;
      if (text === fixedText) return;

      return editor.setText(fixedText);
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
        'enum': ['error', 'warning', 'jscs Warning', 'jscs Error']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNjcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O2dDQUNBLHFCQUFxQjs7OztBQUg1QyxXQUFXLENBQUM7O0FBS1osSUFBTSxhQUFhLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7O0lBRWhDLFVBQVU7V0FBVixVQUFVOzBCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBdURkLG9CQUFHOzs7O0FBRWhCLGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQzVELGNBQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBTTtBQUNsQyxjQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLE1BQUssU0FBUyxFQUFFO0FBQ2pGLG1CQUFPLENBQUMsUUFBUSxDQUFDLFlBQU07QUFDckIsb0JBQUssU0FBUyxFQUFFLENBQUM7YUFDbEIsQ0FBQyxDQUFDO1dBQ0o7U0FDRixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1dBRWdCLHNCQUFHO0FBQ2xCLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDekI7OztXQUVtQix5QkFBRzs7O0FBQ3JCLGFBQU87QUFDTCxZQUFJLEVBQUUsTUFBTTtBQUNaLHFCQUFhLEVBQWIsYUFBYTtBQUNiLGFBQUssRUFBRSxNQUFNO0FBQ2IsaUJBQVMsRUFBRSxJQUFJO0FBQ2YsWUFBSSxFQUFFLGNBQUMsTUFBTSxFQUFLO0FBQ2hCLGNBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFN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LENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUNqRDs7O1NBckRrQixVQUFVOzs7cUJBQVYsVUFBVTtBQXVJOUIsQ0FBQyIsImZpbGUiOiIvVXNlcnMvS2FtaWxpdXMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3MvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgY29uZmlnRmlsZSBmcm9tICdqc2NzL2xpYi9jbGktY29uZmlnJztcblxuY29uc3QgZ3JhbW1hclNjb3BlcyA9IFsnc291cmNlLmpzJywgJ3NvdXJjZS5qcy5qc3gnXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGludGVySlNDUyB7XG5cbiAgc3RhdGljIGNvbmZpZyA9IHtcbiAgICBwcmVzZXQ6IHtcbiAgICAgIHRpdGxlOiAnUHJlc2V0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUHJlc2V0IG9wdGlvbiBpcyBpZ25vcmVkIGlmIGEgY29uZmlnIGZpbGUgaXMgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ2FpcmJuYicsXG4gICAgICBlbnVtOiBbJ2FpcmJuYicsICdjcm9ja2ZvcmQnLCAnZ29vZ2xlJywgJ2dydW50JywgJ2pxdWVyeScsICdtZGNzJywgJ25vZGUtc3R5bGUtZ3VpZGUnLCAnd2lraW1lZGlhJywgJ3dvcmRwcmVzcycsICd5YW5kZXgnXVxuICAgIH0sXG4gICAgZXNuZXh0OiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ0F0dGVtcHRzIHRvIHBhcnNlIHlvdXIgY29kZSBhcyBFUzYrLCBKU1gsIGFuZCBGbG93IHVzaW5nIHRoZSBiYWJlbC1qc2NzIHBhY2thZ2UgYXMgdGhlIHBhcnNlci4nLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIG9ubHlDb25maWc6IHtcbiAgICAgIHRpdGxlOiAnT25seSBDb25maWcnLFxuICAgICAgZGVzY3JpcHRpb246ICdEaXNhYmxlIGxpbnRlciBpZiB0aGVyZSBpcyBubyBjb25maWcgZmlsZSBmb3VuZCBmb3IgdGhlIGxpbnRlci4nLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIGZpeE9uU2F2ZToge1xuICAgICAgdGl0bGU6ICdGaXggb24gc2F2ZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZpeCBKYXZhU2NyaXB0IG9uIHNhdmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIGRpc3BsYXlBczoge1xuICAgICAgdGl0bGU6ICdEaXNwbGF5IGVycm9ycyBhcycsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdlcnJvcicsXG4gICAgICBlbnVtOiBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnanNjcyBXYXJuaW5nJywgJ2pzY3MgRXJyb3InXVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXQgcHJlc2V0KCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLnByZXNldCcpO1xuICB9XG5cbiAgc3RhdGljIGdldCBlc25leHQoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MuZXNuZXh0Jyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IG9ubHlDb25maWcoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3Mub25seUNvbmZpZycpO1xuICB9XG5cbiAgc3RhdGljIGdldCBmaXhPblNhdmUoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MuZml4T25TYXZlJyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGRpc3BsYXlBcygpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5kaXNwbGF5QXMnKTtcbiAgfVxuXG4gIHN0YXRpYyBhY3RpdmF0ZSgpIHtcbiAgICAvLyBJbnN0YWxsIGRlcGVuZGVuY2llcyB1c2luZyBhdG9tLXBhY2thZ2UtZGVwc1xuICAgIHJlcXVpcmUoXCJhdG9tLXBhY2thZ2UtZGVwc1wiKS5pbnN0YWxsKFwibGludGVyLWpzY3NcIik7XG5cbiAgICB0aGlzLm9ic2VydmVyID0gYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5vbldpbGxTYXZlKCgpID0+IHtcbiAgICAgICAgaWYgKGdyYW1tYXJTY29wZXMuaW5kZXhPZihlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSkgIT09IC0xICYmIHRoaXMuZml4T25TYXZlKSB7XG4gICAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpeFN0cmluZygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMub2JzZXJ2ZXIuZGlzcG9zZSgpO1xuICB9XG5cbiAgc3RhdGljIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdKU0NTJyxcbiAgICAgIGdyYW1tYXJTY29wZXMsXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogKGVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBKU0NTID0gcmVxdWlyZSgnanNjcycpO1xuXG4gICAgICAgIC8vIFdlIG5lZWQgcmUtaW5pdGlhbGl6ZSBKU0NTIGJlZm9yZSBldmVyeSBsaW50XG4gICAgICAgIC8vIG9yIGl0IHdpbGwgbG9vc2VzIHRoZSBlcnJvcnMsIGRpZG4ndCB0cmFjZSB0aGUgZXJyb3JcbiAgICAgICAgLy8gbXVzdCBiZSBzb21ldGhpbmcgd2l0aCBuZXcgMi4wLjAgSlNDU1xuICAgICAgICB0aGlzLmpzY3MgPSBuZXcgSlNDUygpO1xuICAgICAgICB0aGlzLmpzY3MucmVnaXN0ZXJEZWZhdWx0UnVsZXMoKTtcblxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGNvbmZpZ0ZpbGUubG9hZChmYWxzZSwgcGF0aC5kaXJuYW1lKGZpbGVQYXRoKSk7XG5cbiAgICAgICAgLy8gT3B0aW9ucyBwYXNzZWQgdG8gYGpzY3NgIGZyb20gcGFja2FnZSBjb25maWd1cmF0aW9uXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGVzbmV4dDogdGhpcy5lc25leHQsIHByZXNldDogdGhpcy5wcmVzZXQgfTtcblxuICAgICAgICB0aGlzLmpzY3MuY29uZmlndXJlKGNvbmZpZyB8fCBvcHRpb25zKTtcblxuICAgICAgICAvLyBXZSBkb24ndCBoYXZlIGEgY29uZmlnIGZpbGUgcHJlc2VudCBpbiBwcm9qZWN0IGRpcmVjdG9yeVxuICAgICAgICAvLyBsZXQncyByZXR1cm4gYW4gZW1wdHkgYXJyYXkgb2YgZXJyb3JzXG4gICAgICAgIGlmICghY29uZmlnICYmIHRoaXMub25seUNvbmZpZykgcmV0dXJuIFtdO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBlcnJvcnMgPSB0aGlzLmpzY3NcbiAgICAgICAgICAuY2hlY2tTdHJpbmcodGV4dCwgZmlsZVBhdGgpXG4gICAgICAgICAgLmdldEVycm9yTGlzdCgpO1xuXG4gICAgICAgIHJldHVybiBlcnJvcnMubWFwKCh7IHJ1bGUsIG1lc3NhZ2UsIGxpbmUsIGNvbHVtbiB9KSA9PiB7XG5cbiAgICAgICAgICAvLyBDYWxjdWxhdGUgcmFuZ2UgdG8gbWFrZSB0aGUgZXJyb3Igd2hvbGUgbGluZVxuICAgICAgICAgIC8vIHdpdGhvdXQgdGhlIGluZGVudGF0aW9uIGF0IGJlZ2luaW5nIG9mIGxpbmVcbiAgICAgICAgICBjb25zdCBpbmRlbnRMZXZlbCA9IGVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhsaW5lIC0gMSk7XG4gICAgICAgICAgY29uc3Qgc3RhcnRDb2wgPSBlZGl0b3IuZ2V0VGFiTGVuZ3RoKCkgKiBpbmRlbnRMZXZlbDtcbiAgICAgICAgICBjb25zdCBlbmRDb2wgPSBlZGl0b3IuZ2V0QnVmZmVyKCkubGluZUxlbmd0aEZvclJvdyhsaW5lIC0gMSk7XG4gICAgICAgICAgY29uc3QgcmFuZ2UgPSBbW2xpbmUgLSAxLCBzdGFydENvbF0sIFtsaW5lIC0gMSwgZW5kQ29sXV07XG5cbiAgICAgICAgICBjb25zdCB0eXBlID0gdGhpcy5kaXNwbGF5QXM7XG4gICAgICAgICAgY29uc3QgaHRtbCA9IGA8c3BhbiBjbGFzcz0nYmFkZ2UgYmFkZ2UtZmxleGlibGUnPiR7cnVsZX08L3NwYW4+ICR7bWVzc2FnZX1gO1xuXG4gICAgICAgICAgcmV0dXJuIHsgdHlwZSwgaHRtbCwgZmlsZVBhdGgsIHJhbmdlIH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZml4U3RyaW5nKCkge1xuICAgIGlmICh0aGlzLmlzTWlzc2luZ0NvbmZpZyAmJiB0aGlzLm9ubHlDb25maWcpIHJldHVybjtcblxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBjb25zdCBwYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgICBjb25zdCBmaXhlZFRleHQgPSB0aGlzLmpzY3MuZml4U3RyaW5nKHRleHQsIHBhdGgpLm91dHB1dDtcbiAgICBpZiAodGV4dCA9PT0gZml4ZWRUZXh0KSByZXR1cm47XG5cbiAgICByZXR1cm4gZWRpdG9yLnNldFRleHQoZml4ZWRUZXh0KTtcbiAgfVxufTtcbiJdfQ==
//# sourceURL=/Users/Kamilius/.atom/packages/linter-jscs/index.js
