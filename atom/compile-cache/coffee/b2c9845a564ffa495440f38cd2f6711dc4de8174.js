(function() {
  var Linter, LinterHaml, linterPath,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  LinterHaml = (function(_super) {
    __extends(LinterHaml, _super);

    LinterHaml.syntax = ['text.haml'];

    LinterHaml.prototype.cmd = 'haml-lint';

    LinterHaml.prototype.linterName = 'haml-lint';

    LinterHaml.prototype.regex = '.+?:(?<line>\\d+) ' + '\\[((?<warning>W)|(?<error>E))\\] ' + '(?<message>.+)';

    function LinterHaml(editor) {
      LinterHaml.__super__.constructor.call(this, editor);
      this.executablePathListener = atom.config.observe('linter-haml-lint.hamlLintExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-haml-lint.hamlLintExecutablePath');
        };
      })(this));
    }

    LinterHaml.prototype.destroy = function() {
      return this.executablePathListener.dispose();
    };

    return LinterHaml;

  })(Linter);

  module.exports = LinterHaml;

}).call(this);
