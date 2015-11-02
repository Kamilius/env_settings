(function() {
  var Linter, Linter9eSass, findFile, fs, linterPath, path, warn, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  _ref = require("" + linterPath + "/lib/utils"), findFile = _ref.findFile, warn = _ref.warn;

  fs = require('fs');

  path = require('path');

  module.exports = Linter9eSass = (function(_super) {
    __extends(Linter9eSass, _super);

    Linter9eSass.syntax = ['source.sass'];

    Linter9eSass.prototype.cmd = ['cmd'];

    Linter9eSass.prototype.linterName = '9e-sass';

    Linter9eSass.prototype.errorStream = 'stdout';

    Linter9eSass.prototype.regex = '^(?<file>.*?\\..*?(?=:))' + ':(?<line>[0-9]+):(?<col>[0-9]+):' + '(?<message>.*?)$';

    Linter9eSass.prototype.regexFlags = 'gm';

    Linter9eSass.prototype.isNodeExecutable = true;

    function Linter9eSass(editor) {
      this.formatShellCmd = __bind(this.formatShellCmd, this);
      Linter9eSass.__super__.constructor.call(this, editor);
      this.cwd = null;
      this.formatShellCmd();
    }

    Linter9eSass.prototype.formatShellCmd = function() {
      this.executablePath = path.join(__dirname, '..', 'node_modules', '.bin', '9e-sass-lint');
      if (!fs.existsSync(this.executablePath)) {
        throw new Error('9e-sass-lint wasn\'t installed properly with linter-9e-sass, please re-install the plugin.');
      }
    };

    Linter9eSass.prototype.formatMessage = function(match) {
      if (!match.error && !match.warning) {
        warn("Regex does not match lint output", match);
      }
      return "" + match.message;
    };

    return Linter9eSass;

  })(Linter);

}).call(this);
