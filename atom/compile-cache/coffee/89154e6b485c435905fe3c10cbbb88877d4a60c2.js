(function() {
  var $, Config, Fs, Mkdirp;

  $ = require('atom-space-pen-views').$;

  Fs = require('fs');

  Mkdirp = require('mkdirp');

  Config = require('./config');

  module.exports = {
    activate: function(buffers) {
      var saveFilePath;
      saveFilePath = Config.saveFile();
      Fs.exists(saveFilePath, (function(_this) {
        return function(exists) {
          if (exists) {
            return Fs.readFile(saveFilePath, {
              encoding: 'utf8'
            }, function(err, str) {
              buffers = JSON.parse(str);
              if (Config.restoreOpenFileContents()) {
                return _this.restore(buffers);
              }
            });
          }
        };
      })(this));
      return this.addListeners();
    },
    save: function() {
      var buffers, file, folder;
      buffers = [];
      atom.workspace.getTextEditors().map((function(_this) {
        return function(editor) {
          var buffer;
          buffer = {};
          if (editor.getBuffer().isModified()) {
            buffer.text = editor.getBuffer().cachedText;
            buffer.diskText = Config.hashMyStr(editor.getBuffer().cachedDiskContents);
          }
          buffer.path = editor.getPath();
          return buffers.push(buffer);
        };
      })(this));
      file = Config.saveFile();
      folder = file.substring(0, file.lastIndexOf(Config.pathSeparator()));
      return Mkdirp(folder, (function(_this) {
        return function(err) {
          return Fs.writeFile(file, JSON.stringify(buffers));
        };
      })(this));
    },
    restore: function(buffers) {
      var buffer, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = buffers.length; _i < _len; _i++) {
        buffer = buffers[_i];
        _results.push(this.restoreText(buffer));
      }
      return _results;
    },
    restoreText: function(buffer) {
      var buf, editors;
      if (buffer.path === void 0) {
        editors = atom.workspace.getTextEditors().filter((function(_this) {
          return function(editor) {
            return editor.buffer.file === null && editor.buffer.cachedText === '';
          };
        })(this));
        if (editors.length > 0) {
          buf = editors[0].getBuffer();
        }
      } else {
        editors = atom.workspace.getTextEditors().filter((function(_this) {
          return function(editor) {
            var _ref;
            return ((_ref = editor.buffer.file) != null ? _ref.path : void 0) === buffer.path;
          };
        })(this));
        if (editors.length > 0) {
          buf = editors[0].getBuffer();
        }
      }
      if (Config.restoreOpenFileContents() && (buffer.text != null) && (buf != null) && buf.getText() !== buffer.text && Config.hashMyStr(buf.getText()) === buffer.diskText) {
        return buf.setText(buffer.text);
      }
    },
    addListeners: function() {
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          editor.onDidStopChanging(function() {
            return setTimeout((function() {
              return _this.save();
            }), Config.extraDelay());
          });
          return editor.onDidSave(function() {
            return _this.save();
          });
        };
      })(this));
      return window.onbeforeunload = (function(_this) {
        return function() {
          return _this.save();
        };
      })(this);
    }
  };

}).call(this);
