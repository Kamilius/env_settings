(function() {
  var CompositeDisposable, Transpiler, defaultConfig;

  CompositeDisposable = require('atom').CompositeDisposable;

  defaultConfig = require('./config');

  Transpiler = require('./transpiler').Transpiler;

  module.exports = {
    config: defaultConfig,
    activate: function(state) {
      if (this.transpiler == null) {
        this.transpiler = new Transpiler;
      }
      this.disposable = new CompositeDisposable;
      return this.disposable.add(atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          return _this.disposable.add(textEditor.onDidSave(function(event) {
            var grammar;
            grammar = textEditor.getGrammar();
            if (grammar.packageName !== 'language-babel') {
              return;
            }
            return _this.transpiler.transpile(event.path, textEditor);
          }));
        };
      })(this)));
    },
    deactivate: function() {
      if (this.disposable != null) {
        return this.disposable.dispose();
      }
    }
  };

}).call(this);
