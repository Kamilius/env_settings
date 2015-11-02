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

      var cursorPosition = editor.getCursorScreenPosition();
      editor.setText(fixedText);
      editor.setCursorScreenPosition(cursorPosition);
    }
  }, {
    key: 'config',
    value: {
      preset: {
        title: 'Preset',
        description: 'Preset option is ignored if a config file is found for the linter.',
        type: 'string',
        'default': 'airbnb',
        'enum': ['airbnb', 'crockford', 'google', 'grunt', 'idiomatic', 'jquery', 'mdcs', 'node-style-guide', 'wikimedia', 'wordpress', 'yandex']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNjcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O2dDQUNBLHFCQUFxQjs7OztBQUg1QyxXQUFXLENBQUM7O0FBS1osSUFBTSxhQUFhLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7O0lBRWhDLFVBQVU7V0FBVixVQUFVOzBCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBdURkLG9CQUFHOzs7O0FBRWhCLGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQzVELGNBQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBTTtBQUNsQyxjQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLE1BQUssU0FBUyxFQUFFO0FBQ2pGLG1CQUFPLENBQUMsUUFBUSxDQUFDLFlBQU07QUFDckIsb0JBQUssU0FBUyxFQUFFLENBQUM7YUFDbEIsQ0FBQyxDQUFDO1dBQ0o7U0FDRixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1dBRWdCLHNCQUFHO0FBQ2xCLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDekI7OztXQUVtQix5QkFBRzs7O0FBQ3JCLGFBQU87QUFDTCxZQUFJLEVBQUUsTUFBTTtBQUNaLHFCQUFhLEVBQWIsYUFBYTtBQUNiLGFBQUssRUFBRSxNQUFNO0FBQ2IsaUJBQVMsRUFBRSxJQUFJO0FBQ2YsWUFBSSxFQUFFLGNBQUMsTUFBTSxFQUFLO0FBQ2hCLGNBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFN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Q0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDakQ7OztTQUVtQixlQUFHO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUNqRDs7O1NBckRrQixVQUFVOzs7cUJBQVYsVUFBVTtBQXlJOUIsQ0FBQyIsImZpbGUiOiIvVXNlcnMvS2FtaWxpdXMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3MvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgY29uZmlnRmlsZSBmcm9tICdqc2NzL2xpYi9jbGktY29uZmlnJztcblxuY29uc3QgZ3JhbW1hclNjb3BlcyA9IFsnc291cmNlLmpzJywgJ3NvdXJjZS5qcy5qc3gnXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGludGVySlNDUyB7XG5cbiAgc3RhdGljIGNvbmZpZyA9IHtcbiAgICBwcmVzZXQ6IHtcbiAgICAgIHRpdGxlOiAnUHJlc2V0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUHJlc2V0IG9wdGlvbiBpcyBpZ25vcmVkIGlmIGEgY29uZmlnIGZpbGUgaXMgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ2FpcmJuYicsXG4gICAgICBlbnVtOiBbJ2FpcmJuYicsICdjcm9ja2ZvcmQnLCAnZ29vZ2xlJywgJ2dydW50JywgJ2lkaW9tYXRpYycsICdqcXVlcnknLCAnbWRjcycsICdub2RlLXN0eWxlLWd1aWRlJywgJ3dpa2ltZWRpYScsICd3b3JkcHJlc3MnLCAneWFuZGV4J11cbiAgICB9LFxuICAgIGVzbmV4dDoge1xuICAgICAgZGVzY3JpcHRpb246ICdBdHRlbXB0cyB0byBwYXJzZSB5b3VyIGNvZGUgYXMgRVM2KywgSlNYLCBhbmQgRmxvdyB1c2luZyB0aGUgYmFiZWwtanNjcyBwYWNrYWdlIGFzIHRoZSBwYXJzZXIuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBvbmx5Q29uZmlnOiB7XG4gICAgICB0aXRsZTogJ09ubHkgQ29uZmlnJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSBsaW50ZXIgaWYgdGhlcmUgaXMgbm8gY29uZmlnIGZpbGUgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBmaXhPblNhdmU6IHtcbiAgICAgIHRpdGxlOiAnRml4IG9uIHNhdmUnLFxuICAgICAgZGVzY3JpcHRpb246ICdGaXggSmF2YVNjcmlwdCBvbiBzYXZlJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBkaXNwbGF5QXM6IHtcbiAgICAgIHRpdGxlOiAnRGlzcGxheSBlcnJvcnMgYXMnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnZXJyb3InLFxuICAgICAgZW51bTogWydlcnJvcicsICd3YXJuaW5nJywgJ2pzY3MgV2FybmluZycsICdqc2NzIEVycm9yJ11cbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0IHByZXNldCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5wcmVzZXQnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZXNuZXh0KCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLmVzbmV4dCcpO1xuICB9XG5cbiAgc3RhdGljIGdldCBvbmx5Q29uZmlnKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLm9ubHlDb25maWcnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZml4T25TYXZlKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLmZpeE9uU2F2ZScpO1xuICB9XG5cbiAgc3RhdGljIGdldCBkaXNwbGF5QXMoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MuZGlzcGxheUFzJyk7XG4gIH1cblxuICBzdGF0aWMgYWN0aXZhdGUoKSB7XG4gICAgLy8gSW5zdGFsbCBkZXBlbmRlbmNpZXMgdXNpbmcgYXRvbS1wYWNrYWdlLWRlcHNcbiAgICByZXF1aXJlKFwiYXRvbS1wYWNrYWdlLWRlcHNcIikuaW5zdGFsbChcImxpbnRlci1qc2NzXCIpO1xuXG4gICAgdGhpcy5vYnNlcnZlciA9IGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkub25XaWxsU2F2ZSgoKSA9PiB7XG4gICAgICAgIGlmIChncmFtbWFyU2NvcGVzLmluZGV4T2YoZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpICE9PSAtMSAmJiB0aGlzLmZpeE9uU2F2ZSkge1xuICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5maXhTdHJpbmcoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLm9ic2VydmVyLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHN0YXRpYyBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnSlNDUycsXG4gICAgICBncmFtbWFyU2NvcGVzLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6IChlZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgSlNDUyA9IHJlcXVpcmUoJ2pzY3MnKTtcblxuICAgICAgICAvLyBXZSBuZWVkIHJlLWluaXRpYWxpemUgSlNDUyBiZWZvcmUgZXZlcnkgbGludFxuICAgICAgICAvLyBvciBpdCB3aWxsIGxvb3NlcyB0aGUgZXJyb3JzLCBkaWRuJ3QgdHJhY2UgdGhlIGVycm9yXG4gICAgICAgIC8vIG11c3QgYmUgc29tZXRoaW5nIHdpdGggbmV3IDIuMC4wIEpTQ1NcbiAgICAgICAgdGhpcy5qc2NzID0gbmV3IEpTQ1MoKTtcbiAgICAgICAgdGhpcy5qc2NzLnJlZ2lzdGVyRGVmYXVsdFJ1bGVzKCk7XG5cbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBjb25zdCBjb25maWcgPSBjb25maWdGaWxlLmxvYWQoZmFsc2UsIHBhdGguZGlybmFtZShmaWxlUGF0aCkpO1xuXG4gICAgICAgIC8vIE9wdGlvbnMgcGFzc2VkIHRvIGBqc2NzYCBmcm9tIHBhY2thZ2UgY29uZmlndXJhdGlvblxuICAgICAgICBjb25zdCBvcHRpb25zID0geyBlc25leHQ6IHRoaXMuZXNuZXh0LCBwcmVzZXQ6IHRoaXMucHJlc2V0IH07XG5cbiAgICAgICAgdGhpcy5qc2NzLmNvbmZpZ3VyZShjb25maWcgfHwgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gV2UgZG9uJ3QgaGF2ZSBhIGNvbmZpZyBmaWxlIHByZXNlbnQgaW4gcHJvamVjdCBkaXJlY3RvcnlcbiAgICAgICAgLy8gbGV0J3MgcmV0dXJuIGFuIGVtcHR5IGFycmF5IG9mIGVycm9yc1xuICAgICAgICBpZiAoIWNvbmZpZyAmJiB0aGlzLm9ubHlDb25maWcpIHJldHVybiBbXTtcblxuICAgICAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgZXJyb3JzID0gdGhpcy5qc2NzXG4gICAgICAgICAgLmNoZWNrU3RyaW5nKHRleHQsIGZpbGVQYXRoKVxuICAgICAgICAgIC5nZXRFcnJvckxpc3QoKTtcblxuICAgICAgICByZXR1cm4gZXJyb3JzLm1hcCgoeyBydWxlLCBtZXNzYWdlLCBsaW5lLCBjb2x1bW4gfSkgPT4ge1xuXG4gICAgICAgICAgLy8gQ2FsY3VsYXRlIHJhbmdlIHRvIG1ha2UgdGhlIGVycm9yIHdob2xlIGxpbmVcbiAgICAgICAgICAvLyB3aXRob3V0IHRoZSBpbmRlbnRhdGlvbiBhdCBiZWdpbmluZyBvZiBsaW5lXG4gICAgICAgICAgY29uc3QgaW5kZW50TGV2ZWwgPSBlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3cobGluZSAtIDEpO1xuICAgICAgICAgIGNvbnN0IHN0YXJ0Q29sID0gZWRpdG9yLmdldFRhYkxlbmd0aCgpICogaW5kZW50TGV2ZWw7XG4gICAgICAgICAgY29uc3QgZW5kQ29sID0gZWRpdG9yLmdldEJ1ZmZlcigpLmxpbmVMZW5ndGhGb3JSb3cobGluZSAtIDEpO1xuICAgICAgICAgIGNvbnN0IHJhbmdlID0gW1tsaW5lIC0gMSwgc3RhcnRDb2xdLCBbbGluZSAtIDEsIGVuZENvbF1dO1xuXG4gICAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMuZGlzcGxheUFzO1xuICAgICAgICAgIGNvbnN0IGh0bWwgPSBgPHNwYW4gY2xhc3M9J2JhZGdlIGJhZGdlLWZsZXhpYmxlJz4ke3J1bGV9PC9zcGFuPiAke21lc3NhZ2V9YDtcblxuICAgICAgICAgIHJldHVybiB7IHR5cGUsIGh0bWwsIGZpbGVQYXRoLCByYW5nZSB9O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZpeFN0cmluZygpIHtcbiAgICBpZiAodGhpcy5pc01pc3NpbmdDb25maWcgJiYgdGhpcy5vbmx5Q29uZmlnKSByZXR1cm47XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgY29uc3QgcGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgY29uc3QgZml4ZWRUZXh0ID0gdGhpcy5qc2NzLmZpeFN0cmluZyh0ZXh0LCBwYXRoKS5vdXRwdXQ7XG4gICAgaWYgKHRleHQgPT09IGZpeGVkVGV4dCkgcmV0dXJuO1xuXG4gICAgY29uc3QgY3Vyc29yUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKTtcbiAgICBlZGl0b3Iuc2V0VGV4dChmaXhlZFRleHQpO1xuICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihjdXJzb3JQb3NpdGlvbik7XG4gIH1cbn07XG4iXX0=
//# sourceURL=/Users/Kamilius/.atom/packages/linter-jscs/index.js
