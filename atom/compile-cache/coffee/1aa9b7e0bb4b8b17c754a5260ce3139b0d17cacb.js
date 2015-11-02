(function() {
  var Linter, LinterJsxhint, findFile, linterPath,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  findFile = require("" + linterPath + "/lib/util");

  LinterJsxhint = (function(_super) {
    __extends(LinterJsxhint, _super);

    LinterJsxhint.syntax = ['source.js.jsx'];

    LinterJsxhint.prototype.linterName = 'jsxhint';

    LinterJsxhint.prototype.regex = '((?<fail>ERROR: .+)|' + '.+?: line (?<line>[0-9]+), col (?<col>[0-9]+), ' + '(?<message>.+) ' + '\\(((?<error>E)|(?<warning>W))(?<code>[0-9]+)\\)' + ')';

    LinterJsxhint.prototype.isNodeExecutable = true;

    function LinterJsxhint(editor) {
      this.formatShellCmd = __bind(this.formatShellCmd, this);
      LinterJsxhint.__super__.constructor.call(this, editor);
      this.executateConfigSubscription = atom.config.observe('linter-jsxhint.jsxhintExecutablePath', this.formatShellCmd);
      this.harmonySubscription = atom.config.observe('linter-jsxhint.harmony', this.formatShellCmd);
      this.formatShellCmd();
    }

    LinterJsxhint.prototype.formatShellCmd = function() {
      var config, harmony, jsxhintExecutablePath;
      jsxhintExecutablePath = atom.config.get('linter-jsxhint.jsxhintExecutablePath');
      harmony = atom.config.get('linter-jsxhint.harmony');
      this.cmd = ['jsxhint', '--verbose', '--extract=auto'];
      if (harmony) {
        this.cmd = this.cmd.concat(['--harmony']);
      }
      config = findFile(this.cwd, ['.jshintrc']);
      if (config) {
        this.cmd = this.cmd.concat(['-c', config]);
      }
      return this.executablePath = "" + jsxhintExecutablePath;
    };

    LinterJsxhint.prototype.formatMessage = function(match) {
      var type;
      type = match.error ? "E" : match.warning ? "W" : (warn("Regex does not match lint output", match), "");
      return "" + match.message + " (" + type + match.code + ")";
    };

    LinterJsxhint.prototype.destroy = function() {
      LinterJsxhint.__super__.destroy.apply(this, arguments);
      this.executateConfigSubscription.dispose();
      return this.harmonySubscription.dispose();
    };

    return LinterJsxhint;

  })(Linter);

  module.exports = LinterJsxhint;

}).call(this);
