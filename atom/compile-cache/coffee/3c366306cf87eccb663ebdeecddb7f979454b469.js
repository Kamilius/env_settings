(function() {
  var Decoration, DecorationManagement, Emitter, Mixin, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  path = require('path');

  Emitter = require('event-kit').Emitter;

  Decoration = null;

  module.exports = DecorationManagement = (function(_super) {
    __extends(DecorationManagement, _super);

    function DecorationManagement() {
      return DecorationManagement.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    DecorationManagement.prototype.initializeDecorations = function() {
      if (this.emitter == null) {
        this.emitter = new Emitter;
      }
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      this.decorationDestroyedSubscriptions = {};
      return Decoration != null ? Decoration : Decoration = require('../decoration');
    };

    DecorationManagement.prototype.onDidAddDecoration = function(callback) {
      return this.emitter.on('did-add-decoration', callback);
    };

    DecorationManagement.prototype.onDidRemoveDecoration = function(callback) {
      return this.emitter.on('did-remove-decoration', callback);
    };

    DecorationManagement.prototype.onDidChangeDecoration = function(callback) {
      return this.emitter.on('did-change-decoration', callback);
    };

    DecorationManagement.prototype.onDidUpdateDecoration = function(callback) {
      return this.emitter.on('did-update-decoration', callback);
    };

    DecorationManagement.prototype.decorationForId = function(id) {
      return this.decorationsById[id];
    };

    DecorationManagement.prototype.decorationsForScreenRowRange = function(startScreenRow, endScreenRow) {
      var decorations, decorationsByMarkerId, marker, _i, _len, _ref;
      decorationsByMarkerId = {};
      _ref = this.findMarkers({
        intersectsScreenRowRange: [startScreenRow, endScreenRow]
      });
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (decorations = this.decorationsByMarkerId[marker.id]) {
          decorationsByMarkerId[marker.id] = decorations;
        }
      }
      return decorationsByMarkerId;
    };

    DecorationManagement.prototype.decorationsByTypeThenRows = function(startScreenRow, endScreenRow) {
      var cache, decoration, id, range, row, rows, type, _base, _i, _j, _len, _ref, _ref1, _ref2, _results;
      if (this.decorationsByTypeThenRowsCache != null) {
        return this.decorationsByTypeThenRowsCache;
      }
      cache = {};
      _ref = this.decorationsById;
      for (id in _ref) {
        decoration = _ref[id];
        range = decoration.marker.getScreenRange();
        rows = (function() {
          _results = [];
          for (var _i = _ref1 = range.start.row, _ref2 = range.end.row; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; _ref1 <= _ref2 ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this);
        type = decoration.getProperties().type;
        if (cache[type] == null) {
          cache[type] = {};
        }
        for (_j = 0, _len = rows.length; _j < _len; _j++) {
          row = rows[_j];
          if ((_base = cache[type])[row] == null) {
            _base[row] = [];
          }
          cache[type][row].push(decoration);
        }
      }
      return this.decorationsByTypeThenRowsCache = cache;
    };

    DecorationManagement.prototype.invalidateDecorationForScreenRowsCache = function() {
      return this.decorationsByTypeThenRowsCache = null;
    };

    DecorationManagement.prototype.decorateMarker = function(marker, decorationParams) {
      var cls, decoration, _base, _base1, _base2, _base3, _base4, _name, _name1, _name2, _name3, _name4;
      if (this.destroyed) {
        return;
      }
      if (marker == null) {
        return;
      }
      marker = this.getMarker(marker.id);
      if (marker == null) {
        return;
      }
      if (decorationParams.type === 'highlight') {
        decorationParams.type = 'highlight-over';
      }
      if ((decorationParams.scope == null) && (decorationParams["class"] != null)) {
        cls = decorationParams["class"].split(' ').join('.');
        decorationParams.scope = ".minimap ." + cls;
      }
      if ((_base = this.decorationMarkerDestroyedSubscriptions)[_name = marker.id] == null) {
        _base[_name] = marker.onDidDestroy((function(_this) {
          return function() {
            return _this.removeAllDecorationsForMarker(marker);
          };
        })(this));
      }
      if ((_base1 = this.decorationMarkerChangedSubscriptions)[_name1 = marker.id] == null) {
        _base1[_name1] = marker.onDidChange((function(_this) {
          return function(event) {
            var decoration, decorations, end, newEnd, newStart, oldEnd, oldStart, rangesDiffs, start, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
            decorations = _this.decorationsByMarkerId[marker.id];
            _this.invalidateDecorationForScreenRowsCache();
            if (decorations != null) {
              for (_i = 0, _len = decorations.length; _i < _len; _i++) {
                decoration = decorations[_i];
                _this.emitter.emit('did-change-decoration', {
                  marker: marker,
                  decoration: decoration,
                  event: event
                });
              }
            }
            oldStart = event.oldTailScreenPosition;
            oldEnd = event.oldHeadScreenPosition;
            newStart = event.newTailScreenPosition;
            newEnd = event.newHeadScreenPosition;
            if (oldStart.row > oldEnd.row) {
              _ref = [oldEnd, oldStart], oldStart = _ref[0], oldEnd = _ref[1];
            }
            if (newStart.row > newEnd.row) {
              _ref1 = [newEnd, newStart], newStart = _ref1[0], newEnd = _ref1[1];
            }
            rangesDiffs = _this.computeRangesDiffs(oldStart, oldEnd, newStart, newEnd);
            _results = [];
            for (_j = 0, _len1 = rangesDiffs.length; _j < _len1; _j++) {
              _ref2 = rangesDiffs[_j], start = _ref2[0], end = _ref2[1];
              _results.push(_this.emitRangeChanges({
                start: start,
                end: end
              }, 0));
            }
            return _results;
          };
        })(this));
      }
      decoration = new Decoration(marker, this, decorationParams);
      if ((_base2 = this.decorationsByMarkerId)[_name2 = marker.id] == null) {
        _base2[_name2] = [];
      }
      this.decorationsByMarkerId[marker.id].push(decoration);
      this.decorationsById[decoration.id] = decoration;
      if ((_base3 = this.decorationUpdatedSubscriptions)[_name3 = decoration.id] == null) {
        _base3[_name3] = decoration.onDidChangeProperties((function(_this) {
          return function(event) {
            return _this.emitDecorationChanges(decoration);
          };
        })(this));
      }
      if ((_base4 = this.decorationDestroyedSubscriptions)[_name4 = decoration.id] == null) {
        _base4[_name4] = decoration.onDidDestroy((function(_this) {
          return function(event) {
            return _this.removeDecoration(decoration);
          };
        })(this));
      }
      this.emitDecorationChanges(decoration);
      this.emitter.emit('did-add-decoration', {
        marker: marker,
        decoration: decoration
      });
      return decoration;
    };

    DecorationManagement.prototype.computeRangesDiffs = function(oldStart, oldEnd, newStart, newEnd) {
      var diffs;
      diffs = [];
      if (oldStart.isLessThan(newStart)) {
        diffs.push([oldStart, newStart]);
      } else if (newStart.isLessThan(oldStart)) {
        diffs.push([newStart, oldStart]);
      }
      if (oldEnd.isLessThan(newEnd)) {
        diffs.push([oldEnd, newEnd]);
      } else if (newEnd.isLessThan(oldEnd)) {
        diffs.push([newEnd, oldEnd]);
      }
      return diffs;
    };

    DecorationManagement.prototype.emitDecorationChanges = function(decoration) {
      var range;
      if (decoration.marker.displayBuffer.isDestroyed()) {
        return;
      }
      this.invalidateDecorationForScreenRowsCache();
      range = decoration.marker.getScreenRange();
      if (range == null) {
        return;
      }
      return this.emitRangeChanges(range, 0);
    };

    DecorationManagement.prototype.emitRangeChanges = function(range, screenDelta) {
      var changeEvent, endScreenRow, firstRenderedScreenRow, lastRenderedScreenRow, startScreenRow;
      startScreenRow = range.start.row;
      endScreenRow = range.end.row;
      lastRenderedScreenRow = this.getLastVisibleScreenRow();
      firstRenderedScreenRow = this.getFirstVisibleScreenRow();
      if (screenDelta == null) {
        screenDelta = (lastRenderedScreenRow - firstRenderedScreenRow) - (endScreenRow - startScreenRow);
      }
      changeEvent = {
        start: startScreenRow,
        end: endScreenRow,
        screenDelta: screenDelta
      };
      return this.emitChanges(changeEvent);
    };

    DecorationManagement.prototype.removeDecoration = function(decoration) {
      var decorations, index, marker, _ref, _ref1;
      if (decoration == null) {
        return;
      }
      marker = decoration.marker;
      delete this.decorationsById[decoration.id];
      if ((_ref = this.decorationUpdatedSubscriptions[decoration.id]) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.decorationDestroyedSubscriptions[decoration.id]) != null) {
        _ref1.dispose();
      }
      delete this.decorationUpdatedSubscriptions[decoration.id];
      delete this.decorationDestroyedSubscriptions[decoration.id];
      if (!(decorations = this.decorationsByMarkerId[marker.id])) {
        return;
      }
      this.emitDecorationChanges(decoration);
      index = decorations.indexOf(decoration);
      if (index > -1) {
        decorations.splice(index, 1);
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
        if (decorations.length === 0) {
          return this.removedAllMarkerDecorations(marker);
        }
      }
    };

    DecorationManagement.prototype.removeAllDecorationsForMarker = function(marker) {
      var decoration, decorations, _i, _len, _ref;
      if (marker == null) {
        return;
      }
      decorations = (_ref = this.decorationsByMarkerId[marker.id]) != null ? _ref.slice() : void 0;
      if (!decorations) {
        return;
      }
      for (_i = 0, _len = decorations.length; _i < _len; _i++) {
        decoration = decorations[_i];
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
        this.emitDecorationChanges(decoration);
      }
      return this.removedAllMarkerDecorations(marker);
    };

    DecorationManagement.prototype.removedAllMarkerDecorations = function(marker) {
      if (marker == null) {
        return;
      }
      this.decorationMarkerChangedSubscriptions[marker.id].dispose();
      this.decorationMarkerDestroyedSubscriptions[marker.id].dispose();
      delete this.decorationsByMarkerId[marker.id];
      delete this.decorationMarkerChangedSubscriptions[marker.id];
      return delete this.decorationMarkerDestroyedSubscriptions[marker.id];
    };

    DecorationManagement.prototype.removeAllDecorations = function() {
      var decoration, id, sub, _ref, _ref1, _ref2, _ref3, _ref4;
      _ref = this.decorationMarkerChangedSubscriptions;
      for (id in _ref) {
        sub = _ref[id];
        sub.dispose();
      }
      _ref1 = this.decorationMarkerDestroyedSubscriptions;
      for (id in _ref1) {
        sub = _ref1[id];
        sub.dispose();
      }
      _ref2 = this.decorationUpdatedSubscriptions;
      for (id in _ref2) {
        sub = _ref2[id];
        sub.dispose();
      }
      _ref3 = this.decorationDestroyedSubscriptions;
      for (id in _ref3) {
        sub = _ref3[id];
        sub.dispose();
      }
      _ref4 = this.decorationsById;
      for (id in _ref4) {
        decoration = _ref4[id];
        decoration.destroy();
      }
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      return this.decorationDestroyedSubscriptions = {};
    };

    DecorationManagement.prototype.decorationDidChangeType = function(decoration) {};

    DecorationManagement.prototype.decorationUpdated = function(decoration) {
      return this.emitter.emit('did-update-decoration', decoration);
    };

    return DecorationManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21peGlucy9kZWNvcmF0aW9uLW1hbmFnZW1lbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVDLFVBQVcsT0FBQSxDQUFRLFdBQVIsRUFBWCxPQUZELENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsSUFIYixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQTtBQUFBLGdCQUFBOztBQUFBLG1DQUdBLHFCQUFBLEdBQXVCLFNBQUEsR0FBQTs7UUFDckIsSUFBQyxDQUFBLFVBQVcsR0FBQSxDQUFBO09BQVo7QUFBQSxNQUNBLElBQUMsQ0FBQSxlQUFELEdBQW1CLEVBRG5CLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixFQUZ6QixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsb0NBQUQsR0FBd0MsRUFIeEMsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLHNDQUFELEdBQTBDLEVBSjFDLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSw4QkFBRCxHQUFrQyxFQUxsQyxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsZ0NBQUQsR0FBb0MsRUFOcEMsQ0FBQTtrQ0FRQSxhQUFBLGFBQWMsT0FBQSxDQUFRLGVBQVIsRUFUTztJQUFBLENBSHZCLENBQUE7O0FBQUEsbUNBcUJBLGtCQUFBLEdBQW9CLFNBQUMsUUFBRCxHQUFBO2FBQ2xCLElBQUMsQ0FBQSxPQUFP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

//# sourceURL=/Users/Kamilius/.atom/packages/minimap/lib/mixins/decoration-management.coffee
