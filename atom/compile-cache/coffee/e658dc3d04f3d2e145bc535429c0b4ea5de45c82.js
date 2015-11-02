(function() {
  var EditorLinter, LinterRegistry;

  LinterRegistry = require('../lib/linter-registry');

  EditorLinter = require('../lib/editor-linter');

  module.exports = {
    getLinter: function() {
      return {
        grammarScopes: ['*'],
        lintOnFly: false,
        modifiesBuffer: false,
        scope: 'project',
        lint: function() {}
      };
    },
    getMessage: function(type, filePath, range) {
      return {
        type: type,
        text: "Some Message",
        filePath: filePath,
        range: range
      };
    },
    getLinterRegistry: function() {
      var editorLinter, linter, linterRegistry;
      linterRegistry = new LinterRegistry;
      editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
      linter = {
        grammarScopes: ['*'],
        lintOnFly: false,
        modifiesBuffer: false,
        scope: 'project',
        lint: function() {
          return [
            {
              type: "Error",
              text: "Something"
            }
          ];
        }
      };
      linterRegistry.addLinter(linter);
      return {
        linterRegistry: linterRegistry,
        editorLinter: editorLinter,
        linter: linter
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbW1vbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUFqQixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQURmLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxTQUFBLEVBQVcsU0FBQSxHQUFBO0FBQ1QsYUFBTztBQUFBLFFBQUMsYUFBQSxFQUFlLENBQUMsR0FBRCxDQUFoQjtBQUFBLFFBQXVCLFNBQUEsRUFBVyxLQUFsQztBQUFBLFFBQXlDLGNBQUEsRUFBZ0IsS0FBekQ7QUFBQSxRQUFnRSxLQUFBLEVBQU8sU0FBdkU7QUFBQSxRQUFrRixJQUFBLEVBQU0sU0FBQSxHQUFBLENBQXhGO09BQVAsQ0FEUztJQUFBLENBQVg7QUFBQSxJQUVBLFVBQUEsRUFBWSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLEtBQWpCLEdBQUE7QUFDVixhQUFPO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLElBQUEsRUFBTSxjQUFiO0FBQUEsUUFBNkIsVUFBQSxRQUE3QjtBQUFBLFFBQXVDLE9BQUEsS0FBdkM7T0FBUCxDQURVO0lBQUEsQ0FGWjtBQUFBLElBSUEsaUJBQUEsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLFVBQUEsb0NBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsR0FBQSxDQUFBLGNBQWpCLENBQUE7QUFBQSxNQUNBLFlBQUEsR0FBbUIsSUFBQSxZQUFBLENBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQWIsQ0FEbkIsQ0FBQTtBQUFBLE1BRUEsTUFBQSxHQUFTO0FBQUEsUUFDUCxhQUFBLEVBQWUsQ0FBQyxHQUFELENBRFI7QUFBQSxRQUVQLFNBQUEsRUFBVyxLQUZKO0FBQUEsUUFHUCxjQUFBLEVBQWdCLEtBSFQ7QUFBQSxRQUlQLEtBQUEsRUFBTyxTQUpBO0FBQUEsUUFLUCxJQUFBLEVBQU0sU0FBQSxHQUFBO0FBQUcsaUJBQU87WUFBQztBQUFBLGNBQUMsSUFBQSxFQUFNLE9BQVA7QUFBQSxjQUFnQixJQUFBLEVBQU0sV0FBdEI7YUFBRDtXQUFQLENBQUg7UUFBQSxDQUxDO09BRlQsQ0FBQTtBQUFBLE1BU0EsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsTUFBekIsQ0FUQSxDQUFBO0FBVUEsYUFBTztBQUFBLFFBQUMsZ0JBQUEsY0FBRDtBQUFBLFFBQWlCLGNBQUEsWUFBakI7QUFBQSxRQUErQixRQUFBLE1BQS9CO09BQVAsQ0FYaUI7SUFBQSxDQUpuQjtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Kamilius/.atom/packages/linter/spec/common.coffee
