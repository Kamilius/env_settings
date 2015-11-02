(function() {
  var CompositeDisposable, EditorLinter, EditorRegistry, Emitter, _ref;

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  EditorLinter = require('./editor-linter');

  EditorRegistry = (function() {
    function EditorRegistry() {
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.emitter);
      this.editorLinters = new Map();
      this.editorLintersByPath = new Map();
    }

    EditorRegistry.prototype.create = function(textEditor) {
      var currentPath, editorLinter;
      editorLinter = new EditorLinter(textEditor);
      if (currentPath = textEditor.getPath()) {
        this.editorLintersByPath.set(currentPath, editorLinter);
      }
      textEditor.onDidChangePath((function(_this) {
        return function(path) {
          _this.editorLintersByPath["delete"](currentPath);
          return _this.editorLintersByPath.set(currentPath = path, editorLinter);
        };
      })(this));
      this.editorLinters.set(textEditor, editorLinter);
      editorLinter.onDidDestroy((function(_this) {
        return function() {
          return _this.editorLinters["delete"](textEditor);
        };
      })(this));
      this.emitter.emit('observe', editorLinter);
      return editorLinter;
    };

    EditorRegistry.prototype.forEach = function(callback) {
      return this.editorLinters.forEach(callback);
    };

    EditorRegistry.prototype.ofPath = function(path) {
      return this.editorLintersByPath.get(path);
    };

    EditorRegistry.prototype.ofTextEditor = function(editor) {
      return this.editorLinters.get(editor);
    };

    EditorRegistry.prototype.ofActiveTextEditor = function() {
      return this.ofTextEditor(atom.workspace.getActiveTextEditor());
    };

    EditorRegistry.prototype.observe = function(callback) {
      this.forEach(callback);
      return this.emitter.on('observe', callback);
    };

    EditorRegistry.prototype.dispose = function() {
      this.subscriptions.dispose();
      this.editorLinters.forEach(function(editorLinter) {
        return editorLinter.dispose();
      });
      return this.editorLinters.clear();
    };

    return EditorRegistry;

  })();

  module.exports = EditorRegistry;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLXJlZ2lzdHJ5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnRUFBQTs7QUFBQSxFQUFBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsZUFBQSxPQUFELEVBQVUsMkJBQUEsbUJBQVYsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBR007QUFDUyxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE9BQXBCLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxHQUFBLENBQUEsQ0FIckIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLG1CQUFELEdBQTJCLElBQUEsR0FBQSxDQUFBLENBSjNCLENBRFc7SUFBQSxDQUFiOztBQUFBLDZCQU9BLE1BQUEsR0FBUSxTQUFDLFVBQUQsR0FBQTtBQUNOLFVBQUEseUJBQUE7QUFBQSxNQUFBLFlBQUEsR0FBbUIsSUFBQSxZQUFBLENBQWEsVUFBYixDQUFuQixDQUFBO0FBQ0EsTUFBQSxJQUFHLFdBQUEsR0FBYyxVQUFVLENBQUMsT0FBWCxDQUFBLENBQWpCO0FBQ0UsUUFBQSxJQUFDLENBQUEsbUJBQW1CLENBQUMsR0FBckIsQ0FBeUIsV0FBekIsRUFBc0MsWUFBdEMsQ0FBQSxDQURGO09BREE7QUFBQSxNQUdBLFVBQVUsQ0FBQyxlQUFY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

//# sourceURL=/Users/Kamilius/.atom/packages/linter/lib/editor-registry.coffee
