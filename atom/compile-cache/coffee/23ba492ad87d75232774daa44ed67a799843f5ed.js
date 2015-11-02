(function() {
  var CompositeDisposable, Linter, LinterJscs, findFile, linterPath, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  findFile = require("" + linterPath + "/lib/util");

  LinterJscs = (function(_super) {
    __extends(LinterJscs, _super);

    LinterJscs.syntax = ['source.js', 'source.js.jsx'];

    LinterJscs.prototype.cmd = '';

    LinterJscs.prototype.linterName = 'jscs';

    LinterJscs.prototype.regex = 'line="(?<line>[0-9]+)" column="(?<col>[0-9]+)" severity="(?<level>.+)".+?message="(?<message>.+)" s';

    LinterJscs.prototype.preset = '';

    LinterJscs.prototype.config = '';

    LinterJscs.prototype.defaultLevel = atom.config.get('linter-jscs.messageType' || 'info');

    LinterJscs.prototype.isNodeExecutable = true;

    LinterJscs.prototype.options = ['executablePath', 'preset', 'harmony', 'verbose', 'onlyConfig'];

    function LinterJscs(editor) {
      this.lintFile = __bind(this.lintFile, this);
      this.buildCmd = __bind(this.buildCmd, this);
      this.updateOption = __bind(this.updateOption, this);
      var option, _i, _len, _ref, _ref1, _ref2, _ref3;
      LinterJscs.__super__.constructor.call(this, editor);
      this.disposables = new CompositeDisposable;
      this.config = findFile(this.cwd, ['.jscsrc', '.jscs.json', 'package.json']);
      if (((_ref = this.config) != null ? typeof _ref.split === "function" ? _ref.split(path.sep)[((_ref1 = this.config) != null ? typeof _ref1.split === "function" ? _ref1.split(path.sep).length : void 0 : void 0) - 1] : void 0 : void 0) === 'package.json') {
        try {
          if (typeof (((_ref2 = require(this.config)) != null ? _ref2.jscsConfig : void 0) != null) !== 'object') {
            throw new Error;
          }
        } catch (_error) {
          this.config = findFile(this.cwd, ['.jscsrc', '.jscs.json']);
        }
      }
      if (atom.inDevMode()) {
        console.log("Use JSCS config file [" + this.config + "]");
      }
      _ref3 = this.options;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        option = _ref3[_i];
        this.disposables.add(atom.config.observe("linter-jscs." + option, this.updateOption.bind(this, option)));
      }
    }

    LinterJscs.prototype.updateOption = function(option) {
      this[option] = atom.config.get("linter-jscs." + option);
      if (atom.inDevMode()) {
        console.log("Updating `linter-jscs` " + option + " to " + this[option]);
      }
      return this.buildCmd();
    };

    LinterJscs.prototype.buildCmd = function() {
      this.cmd = 'jscs -r checkstyle';
      if (this.verbose) {
        this.cmd = "" + this.cmd + " --verbose";
      }
      if (this.harmony) {
        this.cmd = "" + this.cmd + " --esprima=esprima-fb";
      }
      if (this.config) {
        this.cmd = "" + this.cmd + " -c " + this.config;
      }
      if (this.preset && !this.config) {
        return this.cmd = "" + this.cmd + " -p " + this.preset;
      }
    };

    LinterJscs.prototype.lintFile = function(path, next) {
      var condition;
      condition = (this.config && this.onlyConfig) || !this.onlyConfig;
      path = condition ? this.cwd + path.substring(path.lastIndexOf('/')) : {
        path: ''
      };
      return LinterJscs.__super__.lintFile.call(this, path, next);
    };

    LinterJscs.prototype.destroy = function() {
      return this.disposables.dispose();
    };

    return LinterJscs;

  })(Linter);

  module.exports = LinterJscs;

}).call(this);
