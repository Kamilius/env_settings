(function() {
  var Linter, LinterScssLint, Range, findFile, linterPath,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  findFile = require("" + linterPath + "/lib/utils").findFile;

  Range = require('atom').Range;

  LinterScssLint = (function(_super) {
    __extends(LinterScssLint, _super);

    function LinterScssLint() {
      return LinterScssLint.__super__.constructor.apply(this, arguments);
    }

    LinterScssLint.syntax = 'source.css.scss';

    LinterScssLint.prototype.linterName = 'scss-lint';

    LinterScssLint.prototype.cmd = 'scss-lint --format JSON';

    LinterScssLint.prototype.options = ['additionalArguments', 'executablePath'];

    LinterScssLint.prototype.beforeSpawnProcess = function(command, args, options) {
      var config;
      return {
        command: command,
        args: args.slice(0, -1).concat((config = findFile(this.cwd, '.scss-lint.yml')) ? ['-c', config] : [], this.additionalArguments ? this.additionalArguments.split(' ') : [], args.slice(-1)),
        options: options
      };
    };

    LinterScssLint.prototype.processMessage = function(message, cb) {
      var files, lint;
      try {
        files = JSON.parse(message) || {};
      } catch (_error) {
        return cb([
          this.createMessage({
            reason: message
          })
        ]);
      }
      return cb((function() {
        var _i, _len, _ref, _results;
        _ref = files[Object.keys(files)[0]] || [];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          lint = _ref[_i];
          _results.push(this.createMessage(lint));
        }
        return _results;
      }).call(this));
    };

    LinterScssLint.prototype.createMessage = function(lint) {
      var col, line;
      return {
        line: line = (lint.line || 1) - 1,
        col: col = (lint.column || 1) - 1,
        level: lint.severity || 'error',
        message: (lint.reason || 'Unknown Error') + (lint.linter ? " (" + lint.linter + ")" : ''),
        linter: this.linterName,
        range: new Range([line, col], [line, col + (lint.length || 0)])
      };
    };

    return LinterScssLint;

  })(Linter);

  module.exports = LinterScssLint;

}).call(this);
