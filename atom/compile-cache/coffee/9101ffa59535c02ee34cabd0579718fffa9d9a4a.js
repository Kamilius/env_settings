(function() {
  var DotRenderer;

  module.exports = DotRenderer = (function() {
    function DotRenderer() {}

    DotRenderer.prototype.render = function(colorMarker) {
      var charWidth, column, displayBuffer, index, lineHeight, markers, pixelPosition, range, screenLine, textEditor, textEditorElement;
      range = colorMarker.getScreenRange();
      textEditor = colorMarker.colorBuffer.editor;
      textEditorElement = atom.views.getView(textEditor);
      displayBuffer = colorMarker.marker.displayBuffer;
      charWidth = displayBuffer.getDefaultCharWidth();
      markers = displayBuffer.findMarkers({
        type: 'pigments-color',
        intersectsScreenRowRange: [range.end.row, range.end.row]
      });
      index = markers.indexOf(colorMarker.marker);
      screenLine = displayBuffer.screenLines[range.end.row];
      if (screenLine == null) {
        return {};
      }
      lineHeight = textEditor.getLineHeightInPixels();
      column = (screenLine.getMaxScreenColumn() + 1) * charWidth;
      pixelPosition = textEditorElement.pixelPositionForScreenPosition(range.end);
      return {
        "class": 'dot',
        style: {
          backgroundColor: colorMarker.color.toCSS(),
          top: (pixelPosition.top + lineHeight / 2) + 'px',
          left: (column + index * 18) + 'px'
        }
      };
    };

    return DotRenderer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9yZW5kZXJlcnMvZG90LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTs2QkFDSjs7QUFBQSwwQkFBQSxNQUFBLEdBQVEsU0FBQyxXQUFELEdBQUE7QUFDTixVQUFBLDZIQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsV0FBVyxDQUFDLGNBQVosQ0FBQSxDQUFSLENBQUE7QUFBQSxNQUVBLFVBQUEsR0FBYSxXQUFXLENBQUMsV0FBVyxDQUFDLE1BRnJDLENBQUE7QUFBQSxNQUdBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixVQUFuQixDQUhwQixDQUFBO0FBQUEsTUFJQSxhQUFBLEdBQWdCLFdBQVcsQ0FBQyxNQUFNLENBQUMsYUFKbkMsQ0FBQTtBQUFBLE1BS0EsU0FBQSxHQUFZLGFBQWEsQ0FBQyxtQkFBZCxDQUFBLENBTFosQ0FBQTtBQUFBLE1BT0EsT0FBQSxHQUFVLGFBQWEsQ0FBQyxXQUFkLENBQTBCO0FBQUEsUUFDbEMsSUFBQSxFQUFNLGdCQUQ0QjtBQUFBLFFBRWxDLHdCQUFBLEVBQTBCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFYLEVBQWdCLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBMUIsQ0FGUTtPQUExQixDQVBWLENBQUE7QUFBQSxNQVlBLEtBQUEsR0FBUSxPQUFPLENBQUMsT0FBUixDQUFnQixXQUFXLENBQUMsTUFBNUIsQ0FaUixDQUFBO0FBQUEsTUFhQSxVQUFBLEdBQWEsYUFBYSxDQUFDLFdBQVksQ0FBQSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQVYsQ0FidkMsQ0FBQTtBQWVBLE1BQUEsSUFBaUIsa0JBQWpCO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FmQTtBQUFBLE1BaUJBLFVBQUEsR0FBYSxVQUFVLENBQUMscUJBQVgsQ0FBQSxDQWpCYixDQUFBO0FBQUEsTUFrQkEsTUFBQSxHQUFTLENBQUMsVUFBVSxDQUFDLGtCQUFYLENBQUEsQ0FBQSxHQUFrQyxDQUFuQyxDQUFBLEdBQXdDLFNBbEJqRCxDQUFBO0FBQUEsTUFtQkEsYUFBQSxHQUFnQixpQkFBaUIsQ0FBQyw4QkFBbEIsQ0FBaUQsS0FBSyxDQUFDLEdBQXZELENBbkJoQixDQUFBO2FBcUJBO0FBQUEsUUFBQSxPQUFBLEVBQU8sS0FBUDtBQUFBLFFBQ0EsS0FBQSxFQUNFO0FBQUEsVUFBQSxlQUFBLEVBQWlCLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBbEIsQ0FBQSxDQUFqQjtBQUFBLFVBQ0EsR0FBQSxFQUFLLENBQUMsYUFBYSxDQUFDLEdBQWQsR0FBb0IsVUFBQSxHQUFhLENBQWxDLENBQUEsR0FBdUMsSUFENUM7QUFBQSxVQUVBLElBQUEsRUFBTSxDQUFDLE1BQUEsR0FBUyxLQUFBLEdBQVEsRUFBbEIsQ0FBQSxHQUF3QixJQUY5QjtTQUZGO1FBdEJNO0lBQUEsQ0FBUixDQUFBOzt1QkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Kamilius/.atom/packages/pigments/lib/renderers/dot.coffee
