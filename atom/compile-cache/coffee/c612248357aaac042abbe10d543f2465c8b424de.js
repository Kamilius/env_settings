(function() {
  var BetaAdater;

  module.exports = BetaAdater = (function() {
    function BetaAdater(textEditor) {
      this.textEditor = textEditor;
      this.textEditorElement = atom.views.getView(this.textEditor);
    }

    BetaAdater.prototype.onDidChangeScrollTop = function(callback) {
      return this.textEditorElement.onDidChangeScrollTop(callback);
    };

    BetaAdater.prototype.onDidChangeScrollLeft = function(callback) {
      return this.textEditorElement.onDidChangeScrollLeft(callback);
    };

    BetaAdater.prototype.getHeight = function() {
      return this.textEditorElement.getHeight();
    };

    BetaAdater.prototype.getScrollTop = function() {
      return this.textEditorElement.getScrollTop();
    };

    BetaAdater.prototype.setScrollTop = function(scrollTop) {
      return this.textEditorElement.setScrollTop(scrollTop);
    };

    BetaAdater.prototype.getScrollLeft = function() {
      return this.textEditorElement.getScrollLeft();
    };

    BetaAdater.prototype.getHeightWithoutScrollPastEnd = function() {
      return this.textEditor.displayBuffer.getLineHeightInPixels();
    };

    BetaAdater.prototype.getMaxScrollTop = function() {
      var lineHeight, maxScrollTop;
      maxScrollTop = this.textEditorElement.getScrollHeight() - this.getHeight();
      lineHeight = this.textEditor.getLineHeightInPixels();
      if (this.scrollPastEnd) {
        maxScrollTop -= this.getHeight() - 3 * lineHeight;
      }
      return maxScrollTop;
    };

    return BetaAdater;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL2FkYXB0ZXJzL2JldGEtYWRhcHRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsVUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLG9CQUFFLFVBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUMsQ0FBQSxVQUFwQixDQUFyQixDQURXO0lBQUEsQ0FBYjs7QUFBQSx5QkFHQSxvQkFBQSxHQUFzQixTQUFDLFFBQUQsR0FBQTthQUNwQixJQUFDLENBQUEsaUJBQWlCLENBQUMsb0JBQW5CLENBQXdDLFFBQXhDLEVBRG9CO0lBQUEsQ0FIdEIsQ0FBQTs7QUFBQSx5QkFNQSxxQkFBQSxHQUF1QixTQUFDLFFBQUQsR0FBQTthQUNyQixJQUFDLENBQUEsaUJBQWlCLENBQUMscUJBQW5CLENBQXlDLFFBQXpDLEVBRHFCO0lBQUEsQ0FOdkIsQ0FBQTs7QUFBQSx5QkFTQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFNBQW5CLENBQUEsRUFEUztJQUFBLENBVFgsQ0FBQTs7QUFBQSx5QkFZQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQ1osSUFBQyxDQUFBLGlCQUFpQixDQUFDLFlBQW5CLENBQUEsRUFEWTtJQUFBLENBWmQsQ0FBQTs7QUFBQSx5QkFlQSxZQUFBLEdBQWMsU0FBQyxTQUFELEdBQUE7YUFDWixJQUFDLENBQUEsaUJBQWlCLENBQUMsWUFBbkIsQ0FBZ0MsU0FBaEMsRUFEWTtJQUFBLENBZmQsQ0FBQTs7QUFBQSx5QkFrQkEsYUFBQSxHQUFlLFNBQUEsR0FBQTthQUNiLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxhQUFuQixDQUFBLEVBRGE7SUFBQSxDQWxCZixDQUFBOztBQUFBLHlCQXFCQSw2QkFBQSxHQUErQixTQUFBLEdBQUE7YUFDN0IsSUFBQyxDQUFBLFVBQVUsQ0FBQyxhQUFhLENBQUMscUJBQTFCLENBQUEsRUFENkI7SUFBQSxDQXJCL0IsQ0FBQTs7QUFBQSx5QkF3QkEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixVQUFBLHdCQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLGlCQUFpQixDQUFDLGVBQW5CLENBQUEsQ0FBQSxHQUF1QyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQXRELENBQUE7QUFBQSxNQUNBLFVBQUEsR0FBYSxJQUFDLENBQUEsVUFBVSxDQUFDLHFCQUFaLENBQUEsQ0FEYixDQUFBO0FBR0EsTUFBQSxJQUFpRCxJQUFDLENBQUEsYUFBbEQ7QUFBQSxRQUFBLFlBQUEsSUFBZ0IsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFBLEdBQWUsQ0FBQSxHQUFJLFVBQW5DLENBQUE7T0FIQTthQUlBLGFBTGU7SUFBQSxDQXhCakIsQ0FBQTs7c0JBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Kamilius/.atom/packages/minimap/lib/adapters/beta-adapter.coffee
