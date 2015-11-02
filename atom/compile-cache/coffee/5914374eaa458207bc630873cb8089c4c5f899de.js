(function() {
  var CompositeDisposable, CoverageView, ParseLCOV, View, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs-plus');

  path = require('path');

  ParseLCOV = require('./parselcov');

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  module.exports = CoverageView = (function(_super) {
    __extends(CoverageView, _super);

    function CoverageView() {
      return CoverageView.__super__.constructor.apply(this, arguments);
    }

    CoverageView.content = function() {
      return this.div((function(_this) {
        return function() {
          _this.div({
            "class": 'coverage-view',
            style: 'display: none',
            outlet: 'startView'
          });
          return _this.div({
            "class": 'coverage-view',
            style: 'display: none',
            outlet: 'endView'
          });
        };
      })(this));
    };

    CoverageView.prototype.initialize = function(_editor) {
      var basePath, currFile, filePath, pathToLCOV;
      this._editor = _editor;
      this.subscriptions = new CompositeDisposable;
      this.editor = this._editor;
      basePath = atom.config.get('coverage-gutter.basePath');
      filePath = this.editor.getPath();
      if (typeof filePath === 'undefined') {
        return;
      }
      currFile = "./" + path.relative(basePath, filePath).replace(/\\/g, '/');
      pathToLCOV = atom.config.get('coverage-gutter.pathToLCOV');
      if (!fs.existsSync(pathToLCOV)) {
        console.log('Could not find file by pathToLCOV property.');
        alert('Could not find file by pathToLCOV property.');
        return;
      }
      this.markers = [];
      this.watcher = fs.watch(pathToLCOV, (function(_this) {
        return function() {
          return _this.showCoverage(_this.editor, pathToLCOV, currFile);
        };
      })(this));
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          _this.watcher.close();
          return _this.currCoverage = void 0;
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChange((function(_this) {
        return function() {
          return _this.showCoverage(_this.editor, pathToLCOV, currFile);
        };
      })(this)));
      return this.showCoverage(this.editor, pathToLCOV, currFile);
    };

    CoverageView.prototype.showCoverage = function(editor, pathToLCOV, currFile) {
      if (editor.isDestroyed()) {
        return;
      }
      this.currCoverage = this.getCoverage(pathToLCOV, currFile);
      if (this.currCoverage != null) {
        return this.markGutter(editor, this.currCoverage);
      }
    };

    CoverageView.prototype.getCoverage = function(pathToLCOV, currFile) {
      var arr, content, coverages, parser;
      content = fs.readFileSync(pathToLCOV, {
        encoding: 'utf8'
      });
      arr = content.split('\n');
      parser = new ParseLCOV(arr);
      coverages = parser.parse();
      return coverages[currFile];
    };

    CoverageView.prototype.markGutter = function(editor, currCoverage) {
      var cssClass, line, marker, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        marker.destroy();
      }
      this.markers = [];
      _ref1 = currCoverage.coveredLines;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        line = _ref1[_j];
        marker = editor.markBufferRange([[line.line - 1, 0], [line.line - 1, Infinity]], {
          invalidate: 'never'
        });
        cssClass = 'not-covered';
        if (line.count > 0) {
          cssClass = 'covered';
          if (currCoverage.uncoveredBranches != null) {
            cssClass = currCoverage.uncoveredBranches.indexOf(line.line) > -1 ? 'partly-covered' : 'covered';
          }
        }
        editor.decorateMarker(marker, {
          type: 'line-number',
          "class": cssClass
        });
        _results.push(this.markers.push(marker));
      }
      return _results;
    };

    CoverageView.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    return CoverageView;

  })(View);

}).call(this);
