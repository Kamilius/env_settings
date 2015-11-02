(function() {
  var ColorBuffer, ColorBufferElement, ColorMarkerElement, ColorProject, ColorProjectElement, ColorResultsElement, ColorSearch, Palette, PaletteElement;

  ColorBuffer = require('./color-buffer');

  ColorSearch = require('./color-search');

  ColorProject = require('./color-project');

  Palette = require('./palette');

  ColorBufferElement = require('./color-buffer-element');

  ColorMarkerElement = require('./color-marker-element');

  ColorResultsElement = require('./color-results-element');

  ColorProjectElement = require('./color-project-element');

  PaletteElement = require('./palette-element');

  ColorBufferElement.registerViewProvider(ColorBuffer);

  ColorResultsElement.registerViewProvider(ColorSearch);

  ColorProjectElement.registerViewProvider(ColorProject);

  PaletteElement.registerViewProvider(Palette);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9yZWdpc3Rlci1lbGVtZW50cy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUpBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FEZCxDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUZmLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FIVixDQUFBOztBQUFBLEVBSUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSLENBSnJCLENBQUE7O0FBQUEsRUFLQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FMckIsQ0FBQTs7QUFBQSxFQU1BLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx5QkFBUixDQU50QixDQUFBOztBQUFBLEVBT0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSLENBUHRCLENBQUE7O0FBQUEsRUFRQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQVJqQixDQUFBOztBQUFBLEVBVUEsa0JBQWtCLENBQUMsb0JBQW5CLENBQXdDLFdBQXhDLENBVkEsQ0FBQTs7QUFBQSxFQVdBLG1CQUFtQixDQUFDLG9CQUFwQixDQUF5QyxXQUF6QyxDQVhBLENBQUE7O0FBQUEsRUFZQSxtQkFBbUIsQ0FBQyxvQkFBcEIsQ0FBeUMsWUFBekMsQ0FaQSxDQUFBOztBQUFBLEVBYUEsY0FBYyxDQUFDLG9CQUFmLENBQW9DLE9BQXBDLENBYkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Kamilius/.atom/packages/pigments/lib/register-elements.coffee
