(function() {
  var CanvasDrawer, Mixin, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  Mixin = require('mixto');

  module.exports = CanvasDrawer = (function(_super) {
    __extends(CanvasDrawer, _super);

    function CanvasDrawer() {
      return CanvasDrawer.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    CanvasDrawer.prototype.initializeCanvas = function() {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      this.canvas.webkitImageSmoothingEnabled = false;
      if (this.pendingChanges == null) {
        this.pendingChanges = [];
      }
      this.offscreenCanvas = document.createElement('canvas');
      return this.offscreenContext = this.offscreenCanvas.getContext('2d');
    };

    CanvasDrawer.prototype.updateCanvas = function() {
      var firstRow, intact, intactRanges, lastRow, _i, _len;
      firstRow = this.minimap.getFirstVisibleScreenRow();
      lastRow = this.minimap.getLastVisibleScreenRow();
      intactRanges = this.computeIntactRanges(firstRow, lastRow);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (intactRanges.length === 0) {
        this.drawLines(this.context, firstRow, lastRow, 0);
      } else {
        for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
          intact = intactRanges[_i];
          this.copyBitmapPart(this.context, this.offscreenCanvas, intact.domStart, intact.start - firstRow, intact.end - intact.start);
        }
        this.fillGapsBetweenIntactRanges(this.context, intactRanges, firstRow, lastRow);
      }
      this.offscreenCanvas.width = this.canvas.width;
      this.offscreenCanvas.height = this.canvas.height;
      this.offscreenContext.drawImage(this.canvas, 0, 0);
      this.offscreenFirstRow = firstRow;
      return this.offscreenLastRow = lastRow;
    };

    CanvasDrawer.prototype.getTextOpacity = function() {
      return this.textOpacity;
    };

    CanvasDrawer.prototype.getDefaultColor = function() {
      var color;
      color = this.retrieveStyleFromDom(['.editor'], 'color', false, true);
      return this.transparentize(color, this.getTextOpacity());
    };

    CanvasDrawer.prototype.getTokenColor = function(token) {
      return this.retrieveTokenColorFromDom(token);
    };

    CanvasDrawer.prototype.getDecorationColor = function(decoration) {
      var properties;
      properties = decoration.getProperties();
      if (properties.color != null) {
        return properties.color;
      }
      return this.retrieveDecorationColorFromDom(decoration);
    };

    CanvasDrawer.prototype.retrieveTokenColorFromDom = function(token) {
      var color, scopes;
      scopes = token.scopeDescriptor || token.scopes;
      color = this.retrieveStyleFromDom(scopes, 'color');
      return this.transparentize(color, this.getTextOpacity());
    };

    CanvasDrawer.prototype.retrieveDecorationColorFromDom = function(decoration) {
      return this.retrieveStyleFromDom(decoration.getProperties().scope.split(/\s+/), 'background-color', false);
    };

    CanvasDrawer.prototype.transparentize = function(color, opacity) {
      if (opacity == null) {
        opacity = 1;
      }
      return color.replace('rgb(', 'rgba(').replace(')', ", " + opacity + ")");
    };

    CanvasDrawer.prototype.drawLines = function(context, firstRow, lastRow, offsetRow) {
      var canvasWidth, charHeight, charWidth, color, decoration, decorations, displayCodeHighlights, highlightDecorations, invisibleRegExp, line, lineDecorations, lineHeight, lines, row, screenRow, token, value, w, x, y, y0, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4;
      if (firstRow > lastRow) {
        return;
      }
      lines = this.getTextEditor().tokenizedLinesForScreenRows(firstRow, lastRow);
      lineHeight = this.minimap.getLineHeight() * devicePixelRatio;
      charHeight = this.minimap.getCharHeight() * devicePixelRatio;
      charWidth = this.minimap.getCharWidth() * devicePixelRatio;
      canvasWidth = this.canvas.width;
      displayCodeHighlights = this.displayCodeHighlights;
      decorations = this.minimap.decorationsByTypeThenRows(firstRow, lastRow);
      line = lines[0];
      invisibleRegExp = this.getInvisibleRegExp(line);
      for (row = _i = 0, _len = lines.length; _i < _len; row = ++_i) {
        line = lines[row];
        x = 0;
        y = offsetRow + row;
        screenRow = firstRow + row;
        y0 = y * lineHeight;
        lineDecorations = (_ref = decorations['line']) != null ? _ref[screenRow] : void 0;
        if (lineDecorations != null ? lineDecorations.length : void 0) {
          this.drawLineDecorations(context, lineDecorations, y0, canvasWidth, lineHeight);
        }
        highlightDecorations = (_ref1 = decorations['highlight-under']) != null ? _ref1[firstRow + row] : void 0;
        if (highlightDecorations != null ? highlightDecorations.length : void 0) {
          for (_j = 0, _len1 = highlightDecorations.length; _j < _len1; _j++) {
            decoration = highlightDecorations[_j];
            this.drawHighlightDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
          }
        }
        if ((line != null ? line.tokens : void 0) != null) {
          _ref2 = line.tokens;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            token = _ref2[_k];
            w = token.screenDelta;
            if (!token.isOnlyWhitespace()) {
              color = displayCodeHighlights ? this.getTokenColor(token) : this.getDefaultColor();
              value = token.value;
              if (invisibleRegExp != null) {
                value = value.replace(invisibleRegExp, ' ');
              }
              x = this.drawToken(context, value, color, x, y0, charWidth, charHeight);
            } else {
              x += w * charWidth;
            }
            if (x > canvasWidth) {
              break;
            }
          }
        }
        highlightDecorations = (_ref3 = decorations['highlight-over']) != null ? _ref3[firstRow + row] : void 0;
        if (highlightDecorations != null ? highlightDecorations.length : void 0) {
          for (_l = 0, _len3 = highlightDecorations.length; _l < _len3; _l++) {
            decoration = highlightDecorations[_l];
            this.drawHighlightDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
          }
        }
        highlightDecorations = (_ref4 = decorations['highlight-outline']) != null ? _ref4[firstRow + row] : void 0;
        if (highlightDecorations != null ? highlightDecorations.length : void 0) {
          for (_m = 0, _len4 = highlightDecorations.length; _m < _len4; _m++) {
            decoration = highlightDecorations[_m];
            this.drawHighlightOutlineDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
          }
        }
      }
      return context.fill();
    };

    CanvasDrawer.prototype.getInvisibleRegExp = function(line) {
      var invisibles;
      if ((line != null) && (line.invisibles != null)) {
        invisibles = [];
        if (line.invisibles.cr != null) {
          invisibles.push(line.invisibles.cr);
        }
        if (line.invisibles.eol != null) {
          invisibles.push(line.invisibles.eol);
        }
        if (line.invisibles.space != null) {
          invisibles.push(line.invisibles.space);
        }
        if (line.invisibles.tab != null) {
          invisibles.push(line.invisibles.tab);
        }
        return RegExp("" + (invisibles.filter(function(s) {
          return typeof s === 'string';
        }).map(_.escapeRegExp).join('|')), "g");
      }
    };

    CanvasDrawer.prototype.drawToken = function(context, text, color, x, y, charWidth, charHeight) {
      var char, chars, _i, _len;
      context.fillStyle = color;
      chars = 0;
      for (_i = 0, _len = text.length; _i < _len; _i++) {
        char = text[_i];
        if (/\s/.test(char)) {
          if (chars > 0) {
            context.fillRect(x - (chars * charWidth), y, chars * charWidth, charHeight);
          }
          chars = 0;
        } else {
          chars++;
        }
        x += charWidth;
      }
      if (chars > 0) {
        context.fillRect(x - (chars * charWidth), y, chars * charWidth, charHeight);
      }
      return x;
    };

    CanvasDrawer.prototype.drawLineDecorations = function(context, decorations, y, canvasWidth, lineHeight) {
      var decoration, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = decorations.length; _i < _len; _i++) {
        decoration = decorations[_i];
        context.fillStyle = this.getDecorationColor(decoration);
        _results.push(context.fillRect(0, y, canvasWidth, lineHeight));
      }
      return _results;
    };

    CanvasDrawer.prototype.drawHighlightDecoration = function(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth) {
      var colSpan, range, rowSpan, x;
      context.fillStyle = this.getDecorationColor(decoration);
      range = decoration.getMarker().getScreenRange();
      rowSpan = range.end.row - range.start.row;
      if (rowSpan === 0) {
        colSpan = range.end.column - range.start.column;
        return context.fillRect(range.start.column * charWidth, y * lineHeight, colSpan * charWidth, lineHeight);
      } else {
        if (screenRow === range.start.row) {
          x = range.start.column * charWidth;
          return context.fillRect(x, y * lineHeight, canvasWidth - x, lineHeight);
        } else if (screenRow === range.end.row) {
          return context.fillRect(0, y * lineHeight, range.end.column * charWidth, lineHeight);
        } else {
          return context.fillRect(0, y * lineHeight, canvasWidth, lineHeight);
        }
      }
    };

    CanvasDrawer.prototype.drawHighlightOutlineDecoration = function(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth) {
      var bottomWidth, colSpan, range, rowSpan, width, xBottomStart, xEnd, xStart, yEnd, yStart;
      context.fillStyle = this.getDecorationColor(decoration);
      range = decoration.getMarker().getScreenRange();
      rowSpan = range.end.row - range.start.row;
      if (rowSpan === 0) {
        colSpan = range.end.column - range.start.column;
        width = colSpan * charWidth;
        xStart = range.start.column * charWidth;
        xEnd = xStart + width;
        yStart = y * lineHeight;
        yEnd = yStart + lineHeight;
        context.fillRect(xStart, yStart, width, 1);
        context.fillRect(xStart, yEnd, width, 1);
        context.fillRect(xStart, yStart, 1, lineHeight);
        return context.fillRect(xEnd, yStart, 1, lineHeight);
      } else if (rowSpan === 1) {
        xStart = range.start.column * charWidth;
        xEnd = range.end.column * charWidth;
        if (screenRow === range.start.row) {
          width = canvasWidth - xStart;
          yStart = y * lineHeight;
          yEnd = yStart + lineHeight;
          xBottomStart = Math.max(xStart, xEnd);
          bottomWidth = canvasWidth - xBottomStart;
          context.fillRect(xStart, yStart, width, 1);
          context.fillRect(xBottomStart, yEnd, bottomWidth, 1);
          context.fillRect(xStart, yStart, 1, lineHeight);
          return context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
        } else {
          width = canvasWidth - xStart;
          yStart = y * lineHeight;
          yEnd = yStart + lineHeight;
          bottomWidth = canvasWidth - xEnd;
          context.fillRect(0, yStart, xStart, 1);
          context.fillRect(0, yEnd, xEnd, 1);
          context.fillRect(0, yStart, 1, lineHeight);
          return context.fillRect(xEnd, yStart, 1, lineHeight);
        }
      } else {
        xStart = range.start.column * charWidth;
        xEnd = range.end.column * charWidth;
        if (screenRow === range.start.row) {
          width = canvasWidth - xStart;
          yStart = y * lineHeight;
          yEnd = yStart + lineHeight;
          context.fillRect(xStart, yStart, width, 1);
          context.fillRect(xStart, yStart, 1, lineHeight);
          return context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
        } else if (screenRow === range.end.row) {
          width = canvasWidth - xStart;
          yStart = y * lineHeight;
          yEnd = yStart + lineHeight;
          context.fillRect(0, yEnd, xEnd, 1);
          context.fillRect(0, yStart, 1, lineHeight);
          return context.fillRect(xEnd, yStart, 1, lineHeight);
        } else {
          yStart = y * lineHeight;
          yEnd = yStart + lineHeight;
          context.fillRect(0, yStart, 1, lineHeight);
          context.fillRect(canvasWidth - 1, yStart, 1, lineHeight);
          if (screenRow === range.start.row + 1) {
            context.fillRect(0, yStart, xStart, 1);
          }
          if (screenRow === range.end.row - 1) {
            return context.fillRect(xEnd, yEnd, canvasWidth - xEnd, 1);
          }
        }
      }
    };

    CanvasDrawer.prototype.copyBitmapPart = function(context, bitmapCanvas, srcRow, destRow, rowCount) {
      var lineHeight;
      lineHeight = this.minimap.getLineHeight() * devicePixelRatio;
      return context.drawImage(bitmapCanvas, 0, srcRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight, 0, destRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight);
    };


    /* Internal */

    CanvasDrawer.prototype.fillGapsBetweenIntactRanges = function(context, intactRanges, firstRow, lastRow) {
      var currentRow, intact, _i, _len;
      currentRow = firstRow;
      for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
        intact = intactRanges[_i];
        this.drawLines(context, currentRow, intact.start - 1, currentRow - firstRow);
        currentRow = intact.end;
      }
      if (currentRow <= lastRow) {
        return this.drawLines(context, currentRow, lastRow, currentRow - firstRow);
      }
    };

    CanvasDrawer.prototype.computeIntactRanges = function(firstRow, lastRow) {
      var change, intactRange, intactRanges, newIntactRanges, range, _i, _j, _len, _len1, _ref;
      if ((this.offscreenFirstRow == null) && (this.offscreenLastRow == null)) {
        return [];
      }
      intactRanges = [
        {
          start: this.offscreenFirstRow,
          end: this.offscreenLastRow,
          domStart: 0
        }
      ];
      _ref = this.pendingChanges;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        change = _ref[_i];
        newIntactRanges = [];
        for (_j = 0, _len1 = intactRanges.length; _j < _len1; _j++) {
          range = intactRanges[_j];
          if (change.end < range.start && change.screenDelta !== 0) {
            newIntactRanges.push({
              start: range.start + change.screenDelta,
              end: range.end + change.screenDelta,
              domStart: range.domStart
            });
          } else if (change.end < range.start || change.start > range.end) {
            newIntactRanges.push(range);
          } else {
            if (change.start > range.start) {
              newIntactRanges.push({
                start: range.start,
                end: change.start - 1,
                domStart: range.domStart
              });
            }
            if (change.end < range.end) {
              if (change.bufferDelta !== 0) {
                newIntactRanges.push({
                  start: change.end + change.screenDelta + 1,
                  end: range.end + change.screenDelta,
                  domStart: range.domStart + change.end + 1 - range.start
                });
              }
            }
          }
          intactRange = newIntactRanges[newIntactRanges.length - 1];
        }
        intactRanges = newIntactRanges;
      }
      this.truncateIntactRanges(intactRanges, firstRow, lastRow);
      this.pendingChanges = [];
      return intactRanges;
    };

    CanvasDrawer.prototype.truncateIntactRanges = function(intactRanges, firstRow, lastRow) {
      var i, range;
      i = 0;
      while (i < intactRanges.length) {
        range = intactRanges[i];
        if (range.start < firstRow) {
          range.domStart += firstRow - range.start;
          range.start = firstRow;
        }
        if (range.end > lastRow) {
          range.end = lastRow;
        }
        if (range.start >= range.end) {
          intactRanges.splice(i--, 1);
        }
        i++;
      }
      return intactRanges.sort(function(a, b) {
        return a.domStart - b.domStart;
      });
    };

    return CanvasDrawer;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21peGlucy9jYW52YXMtZHJhd2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FEUixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG1DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQTtBQUFBLGdCQUFBOztBQUFBLDJCQUdBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtBQUNoQixNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQixDQURYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsMkJBQVIsR0FBc0MsS0FGdEMsQ0FBQTs7UUFHQSxJQUFDLENBQUEsaUJBQWtCO09BSG5CO0FBQUEsTUFLQSxJQUFDLENBQUEsZUFBRCxHQUFtQixRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QixDQUxuQixDQUFBO2FBTUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxlQUFlLENBQUMsVUFBakIsQ0FBNEIsSUFBNUIsRUFQSjtJQUFBLENBSGxCLENBQUE7O0FBQUEsMkJBY0EsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFVBQUEsaURBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsT0FBTyxDQUFDLHdCQUFULENBQUEsQ0FBWCxDQUFB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

//# sourceURL=/Users/Kamilius/.atom/packages/minimap/lib/mixins/canvas-drawer.coffee
