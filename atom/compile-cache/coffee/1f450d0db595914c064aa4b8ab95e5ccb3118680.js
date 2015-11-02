(function() {
  var DotRenderer;

  module.exports = DotRenderer = (function() {
    function DotRenderer() {}

    DotRenderer.prototype.render = function(colorMarker) {
      var charWidth, column, displayBuffer, index, lineHeight, markers, pixelPosition, range, screenLine;
      range = colorMarker.getScreenRange();
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
      lineHeight = displayBuffer.getLineHeightInPixels();
      column = (screenLine.getMaxScreenColumn() + 1) * charWidth;
      pixelPosition = displayBuffer.pixelPositionForScreenPosition(range.end);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9yZW5kZXJlcnMvZG90LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTs2QkFDSjs7QUFBQSwwQkFBQSxNQUFBLEdBQVEsU0FBQyxXQUFELEdBQUE7QUFDTixVQUFBLDhGQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsV0FBVyxDQUFDLGNBQVosQ0FBQSxDQUFSLENBQUE7QUFBQSxNQUNBLGFBQUEsR0FBZ0IsV0FBVyxDQUFDLE1BQU0sQ0FBQyxhQURuQyxDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQVksYUFBYSxDQUFDLG1CQUFkLENBQUEsQ0FGWixDQUFBO0FBQUEsTUFJQSxPQUFBLEdBQVUsYUFBYSxDQUFDLFdBQWQsQ0FBMEI7QUFBQSxRQUNsQyxJQUFBLEVBQU0sZ0JBRDRCO0FBQUEsUUFFbEMsd0JBQUEsRUFBMEIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQVgsRUFBZ0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUExQixDQUZRO09BQTFCLENBSlYsQ0FBQTtBQUFBLE1BU0EsS0FBQSxHQUFRLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFdBQVcsQ0FBQyxNQUE1QixDQVRSLENBQUE7QUFBQSxNQVVBLFVBQUEsR0FBYSxhQUFhLENBQUMsV0FBWSxDQUFBLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBVixDQVZ2QyxDQUFBO0FBWUEsTUFBQSxJQUFpQixrQkFBakI7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQVpBO0FBQUEsTUFjQSxVQUFBLEdBQWEsYUFBYSxDQUFDLHFCQUFkLENBQUEsQ0FkYixDQUFBO0FBQUEsTUFlQSxNQUFBLEdBQVMsQ0FBQyxVQUFVLENBQUMsa0JBQVgsQ0FBQSxDQUFBLEdBQWtDLENBQW5DLENBQUEsR0FBd0MsU0FmakQsQ0FBQTtBQUFBLE1BZ0JBLGFBQUEsR0FBZ0IsYUFBYSxDQUFDLDhCQUFkLENBQTZDLEtBQUssQ0FBQyxHQUFuRCxDQWhCaEIsQ0FBQTthQWtCQTtBQUFBLFFBQUEsT0FBQSxFQUFPLEtBQVA7QUFBQSxRQUNBLEtBQUEsRUFDRTtBQUFBLFVBQUEsZUFBQSxFQUFpQixXQUFXLENBQUMsS0FBSyxDQUFDLEtBQWxCLENBQUEsQ0FBakI7QUFBQSxVQUNBLEdBQUEsRUFBSyxDQUFDLGFBQWEsQ0FBQyxHQUFkLEdBQW9CLFVBQUEsR0FBYSxDQUFsQyxDQUFBLEdBQXVDLElBRDVDO0FBQUEsVUFFQSxJQUFBLEVBQU0sQ0FBQyxNQUFBLEdBQVMsS0FBQSxHQUFRLEVBQWxCLENBQUEsR0FBd0IsSUFGOUI7U0FGRjtRQW5CTTtJQUFBLENBQVIsQ0FBQTs7dUJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Kamilius/.atom/packages/pigments/lib/renderers/dot.coffee
