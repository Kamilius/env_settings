(function() {
  var File, Fixer, Linter, path;

  path = require('path');

  Linter = require('9e-sass-lint/lib/linter');

  File = require('9e-sass-lint/lib/file');

  Fixer = require('9e-sass-lint/lib/fixer');

  module.exports = {
    disposables: [],
    activate: function(state) {
      var disposable;
      disposable = atom.commands.add('atom-workspace', 'linter-9e-sass:format', (function(_this) {
        return function() {
          return _this.formatCode();
        };
      })(this));
      return this.disposables.push(disposable);
    },
    deactivate: function() {
      var disposable, _i, _len, _ref;
      _ref = this.disposables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        disposable = _ref[_i];
        disposable.dispose();
      }
      return this.disposables = [];
    },
    formatCode: function() {
      var buffer, editor, file, linter, text;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      buffer = editor.getBuffer();
      text = buffer.getText();
      linter = new Linter;
      file = new File('file', text);
      return linter.lintFile(file).then((function(_this) {
        return function(report) {
          var fixer;
          fixer = new Fixer(linter);
          return fixer.fixReport(file, report);
        };
      })(this)).then((function(_this) {
        return function() {
          return buffer.setText(file.content);
        };
      })(this));
    }
  };

}).call(this);
