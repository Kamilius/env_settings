(function() {
  var CsscombRangeFinder, Range;

  Range = require('atom').Range;

  module.exports = CsscombRangeFinder = (function() {
    CsscombRangeFinder.rangesFor = function(editor) {
      return new CsscombRangeFinder(editor).ranges();
    };

    function CsscombRangeFinder(editor) {
      this.editor = editor;
    }

    CsscombRangeFinder.prototype.ranges = function() {
      var selectionRanges;
      selectionRanges = this.selectionRanges();
      if (selectionRanges.length === 0) {
        return [this.sortableRangeForEntireBuffer()];
      } else {
        return selectionRanges.map((function(_this) {
          return function(selectionRange) {
            return _this.sortableRangeFrom(selectionRange);
          };
        })(this));
      }
    };

    CsscombRangeFinder.prototype.selectionRanges = function() {
      return this.editor.getSelectedBufferRanges().filter(function(range) {
        return !range.isEmpty();
      });
    };

    CsscombRangeFinder.prototype.sortableRangeForEntireBuffer = function() {
      return this.editor.getBuffer().getRange();
    };

    CsscombRangeFinder.prototype.sortableRangeFrom = function(selectionRange) {
      var endCol, endRow, startCol, startRow;
      startRow = selectionRange.start.row;
      startCol = 0;
      endRow = selectionRange.end.column === 0 ? selectionRange.end.row - 1 : selectionRange.end.row;
      endCol = this.editor.lineTextForBufferRow(endRow).length;
      return new Range([startRow, startCol], [endRow, endCol]);
    };

    return CsscombRangeFinder;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2Nzc2NvbWIvbGliL2Nzc2NvbWItcmFuZ2UtZmluZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5QkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosSUFBQSxrQkFBQyxDQUFBLFNBQUQsR0FBWSxTQUFDLE1BQUQsR0FBQTthQUNOLElBQUEsa0JBQUEsQ0FBbUIsTUFBbkIsQ0FBMEIsQ0FBQyxNQUEzQixDQUFBLEVBRE07SUFBQSxDQUFaLENBQUE7O0FBSWEsSUFBQSw0QkFBRSxNQUFGLEdBQUE7QUFBVyxNQUFWLElBQUMsQ0FBQSxTQUFBLE1BQVMsQ0FBWDtJQUFBLENBSmI7O0FBQUEsaUNBT0EsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsZUFBQTtBQUFBLE1BQUEsZUFBQSxHQUFrQixJQUFDLENBQUEsZUFBRCxDQUFBLENBQWxCLENBQUE7QUFDQSxNQUFBLElBQUcsZUFBZSxDQUFDLE1BQWhCLEtBQTBCLENBQTdCO2VBQ0UsQ0FBQyxJQUFDLENBQUEsNEJBQUQsQ0FBQSxDQUFELEVBREY7T0FBQSxNQUFBO2VBR0UsZUFBZSxDQUFDLEdBQWhCLENBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxjQUFELEdBQUE7bUJBQ2xCLEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixjQUFuQixFQURrQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCLEVBSEY7T0FGTTtJQUFBLENBUFIsQ0FBQTs7QUFBQSxpQ0FnQkEsZUFBQSxHQUFpQixTQUFBLEdBQUE7YUFDZixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FBaUMsQ0FBQyxNQUFsQyxDQUF5QyxTQUFDLEtBQUQsR0FBQTtlQUN2QyxDQUFBLEtBQVMsQ0FBQyxPQUFOLENBQUEsRUFEbUM7TUFBQSxDQUF6QyxFQURlO0lBQUEsQ0FoQmpCLENBQUE7O0FBQUEsaUNBcUJBLDRCQUFBLEdBQThCLFNBQUEsR0FBQTthQUM1QixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLFFBQXBCLENBQUEsRUFENEI7SUFBQSxDQXJCOUIsQ0FBQTs7QUFBQSxpQ0F5QkEsaUJBQUEsR0FBbUIsU0FBQyxjQUFELEdBQUE7QUFDakIsVUFBQSxrQ0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBaEMsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLENBRFgsQ0FBQTtBQUFBLE1BRUEsTUFBQSxHQUFZLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBbkIsS0FBNkIsQ0FBaEMsR0FDUCxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQW5CLEdBQXlCLENBRGxCLEdBR1AsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUxyQixDQUFBO0FBQUEsTUFNQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixNQUE3QixDQUFvQyxDQUFDLE1BTjlDLENBQUE7YUFRSSxJQUFBLEtBQUEsQ0FBTSxDQUFDLFFBQUQsRUFBVyxRQUFYLENBQU4sRUFBNEIsQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUE1QixFQVRhO0lBQUEsQ0F6Qm5CLENBQUE7OzhCQUFBOztNQU5GLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Kamilius/.atom/packages/csscomb/lib/csscomb-range-finder.coffee
