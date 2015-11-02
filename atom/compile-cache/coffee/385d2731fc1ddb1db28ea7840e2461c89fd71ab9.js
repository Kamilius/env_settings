(function() {
  var LegacyAdater;

  module.exports = LegacyAdater = (function() {
    function LegacyAdater(textEditor) {
      this.textEditor = textEditor;
    }

    LegacyAdater.prototype.onDidChangeScrollTop = function(callback) {
      return this.textEditor.onDidChangeScrollTop(callback);
    };

    LegacyAdater.prototype.onDidChangeScrollLeft = function(callback) {
      return this.textEditor.onDidChangeScrollLeft(callback);
    };

    LegacyAdater.prototype.getHeight = function() {
      return this.textEditor.getHeight();
    };

    LegacyAdater.prototype.getScrollTop = function() {
      return this.textEditor.getScrollTop();
    };

    LegacyAdater.prototype.setScrollTop = function(scrollTop) {
      return this.textEditor.setScrollTop(scrollTop);
    };

    LegacyAdater.prototype.getScrollLeft = function() {
      return this.textEditor.getScrollLeft();
    };

    LegacyAdater.prototype.getHeightWithoutScrollPastEnd = function() {
      return this.textEditor.displayBuffer.getLineHeightInPixels();
    };

    LegacyAdater.prototype.getMaxScrollTop = function() {
      var lineHeight, maxScrollTop;
      maxScrollTop = this.textEditor.displayBuffer.getMaxScrollTop();
      lineHeight = this.textEditor.getLineHeightInPixels();
      if (this.scrollPastEnd) {
        maxScrollTop -= this.getHeight() - 3 * lineHeight;
      }
      return maxScrollTop;
    };

    return LegacyAdater;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2FkYXB0ZXJzL2xlZ2FjeS1hZGFwdGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsc0JBQUUsVUFBRixHQUFBO0FBQWUsTUFBZCxJQUFDLENBQUEsYUFBQSxVQUFhLENBQWY7SUFBQSxDQUFiOztBQUFBLDJCQUVBLG9CQUFBLEdBQXNCLFNBQUMsUUFBRCxHQUFBO2FBQ3BCLElBQUMsQ0FBQSxVQUFVLENBQUMsb0JBQVosQ0FBaUMsUUFBakMsRUFEb0I7SUFBQSxDQUZ0QixDQUFBOztBQUFBLDJCQUtBLHFCQUFBLEdBQXVCLFNBQUMsUUFBRCxHQUFBO2FBQ3JCLElBQUMsQ0FBQSxVQUFVLENBQUMscUJBQVosQ0FBa0MsUUFBbEMsRUFEcUI7SUFBQSxDQUx2QixDQUFBOztBQUFBLDJCQVFBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBQSxFQURTO0lBQUEsQ0FSWCxDQUFBOztBQUFBLDJCQVdBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFDWixJQUFDLENBQUEsVUFBVSxDQUFDLFlBQVosQ0FBQSxFQURZO0lBQUEsQ0FYZCxDQUFBOztBQUFBLDJCQWNBLFlBQUEsR0FBYyxTQUFDLFNBQUQsR0FBQTthQUNaLElBQUMsQ0FBQSxVQUFVLENBQUMsWUFBWixDQUF5QixTQUF6QixFQURZO0lBQUEsQ0FkZCxDQUFBOztBQUFBLDJCQWlCQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQ2IsSUFBQyxDQUFBLFVBQVUsQ0FBQyxhQUFaLENBQUEsRUFEYTtJQUFBLENBakJmLENBQUE7O0FBQUEsMkJBb0JBLDZCQUFBLEdBQStCLFNBQUEsR0FBQTthQUM3QixJQUFDLENBQUEsVUFBVSxDQUFDLGFBQWEsQ0FBQyxxQkFBMUIsQ0FBQSxFQUQ2QjtJQUFBLENBcEIvQixDQUFBOztBQUFBLDJCQXVCQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsd0JBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxJQUFDLENBQUEsVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUExQixDQUFBLENBQWYsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFhLElBQUMsQ0FBQSxVQUFVLENBQUMscUJBQVosQ0FBQSxDQURiLENBQUE7QUFHQSxNQUFBLElBQWlELElBQUMsQ0FBQSxhQUFsRDtBQUFBLFFBQUEsWUFBQSxJQUFnQixJQUFDLENBQUEsU0FBRCxDQUFBLENBQUEsR0FBZSxDQUFBLEdBQUksVUFBbkMsQ0FBQTtPQUhBO2FBSUEsYUFMZTtJQUFBLENBdkJqQixDQUFBOzt3QkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Kamilius/.atom/packages/minimap/lib/adapters/legacy-adapter.coffee
