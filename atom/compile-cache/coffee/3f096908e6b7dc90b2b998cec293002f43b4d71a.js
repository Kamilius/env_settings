(function() {
  var BufferColorsScanner, ColorContext, ColorScanner, ColorsChunkSize, createVariableExpression, getRegistry;

  ColorScanner = require('../color-scanner');

  ColorContext = require('../color-context');

  getRegistry = require('../color-expressions').getRegistry;

  createVariableExpression = require('../utils').createVariableExpression;

  ColorsChunkSize = 100;

  BufferColorsScanner = (function() {
    function BufferColorsScanner(config) {
      var bufferPath, colorVariables, variables;
      this.buffer = config.buffer, variables = config.variables, colorVariables = config.colorVariables, bufferPath = config.bufferPath;
      this.context = new ColorContext({
        variables: variables,
        colorVariables: colorVariables,
        referencePath: bufferPath
      });
      this.scanner = new ColorScanner({
        context: this.context
      });
      this.results = [];
    }

    BufferColorsScanner.prototype.scan = function() {
      var lastIndex, result;
      lastIndex = 0;
      while (result = this.scanner.search(this.buffer, lastIndex)) {
        this.results.push(result);
        if (this.results.length >= ColorsChunkSize) {
          this.flushColors();
        }
        lastIndex = result.lastIndex;
      }
      return this.flushColors();
    };

    BufferColorsScanner.prototype.flushColors = function() {
      emit('scan-buffer:colors-found', this.results);
      return this.results = [];
    };

    return BufferColorsScanner;

  })();

  module.exports = function(config) {
    return new BufferColorsScanner(config).scan();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi90YXNrcy9zY2FuLWJ1ZmZlci1jb2xvcnMtaGFuZGxlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUdBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUMsY0FBZSxPQUFBLENBQVEsc0JBQVIsRUFBZixXQUZELENBQUE7O0FBQUEsRUFHQywyQkFBNEIsT0FBQSxDQUFRLFVBQVIsRUFBNUIsd0JBSEQsQ0FBQTs7QUFBQSxFQUlBLGVBQUEsR0FBa0IsR0FKbEIsQ0FBQTs7QUFBQSxFQU1NO0FBQ1MsSUFBQSw2QkFBQyxNQUFELEdBQUE7QUFDWCxVQUFBLHFDQUFBO0FBQUEsTUFBQyxJQUFDLENBQUEsZ0JBQUEsTUFBRixFQUFVLG1CQUFBLFNBQVYsRUFBcUIsd0JBQUEsY0FBckIsRUFBcUMsb0JBQUEsVUFBckMsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLFlBQUEsQ0FBYTtBQUFBLFFBQUMsV0FBQSxTQUFEO0FBQUEsUUFBWSxnQkFBQSxjQUFaO0FBQUEsUUFBNEIsYUFBQSxFQUFlLFVBQTNDO09BQWIsQ0FEZixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsWUFBQSxDQUFhO0FBQUEsUUFBRSxTQUFELElBQUMsQ0FBQSxPQUFGO09BQWIsQ0FGZixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBSFgsQ0FEVztJQUFBLENBQWI7O0FBQUEsa0NBTUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsaUJBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxDQUFaLENBQUE7QUFDQSxhQUFNLE1BQUEsR0FBUyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLE1BQWpCLEVBQXlCLFNBQXpCLENBQWYsR0FBQTtBQUNFLFFBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsTUFBZCxDQUFBLENBQUE7QUFFQSxRQUFBLElBQWtCLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxJQUFtQixlQUFyQztBQUFBLFVBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFBLENBQUE7U0FGQTtBQUFBLFFBR0MsWUFBYSxPQUFiLFNBSEQsQ0FERjtNQUFBLENBREE7YUFPQSxJQUFDLENBQUEsV0FBRCxDQUFBLEVBUkk7SUFBQSxDQU5OLENBQUE7O0FBQUEsa0NBZ0JBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxNQUFBLElBQUEsQ0FBSywwQkFBTCxFQUFpQyxJQUFDLENBQUEsT0FBbEMsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUZBO0lBQUEsQ0FoQmIsQ0FBQTs7K0JBQUE7O01BUEYsQ0FBQTs7QUFBQSxFQTJCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLE1BQUQsR0FBQTtXQUNYLElBQUEsbUJBQUEsQ0FBb0IsTUFBcEIsQ0FBMkIsQ0FBQyxJQUE1QixDQUFBLEVBRFc7RUFBQSxDQTNCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Kamilius/.atom/packages/pigments/lib/tasks/scan-buffer-colors-handler.coffee
