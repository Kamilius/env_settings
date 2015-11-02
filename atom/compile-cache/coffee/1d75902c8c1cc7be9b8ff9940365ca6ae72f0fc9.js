(function() {
  describe('BottomPanelMount', function() {
    var statusBar, statusBarService, workspaceElement, _ref;
    _ref = [], statusBar = _ref[0], statusBarService = _ref[1], workspaceElement = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar').then(function(pack) {
          statusBar = workspaceElement.querySelector('status-bar');
          return statusBarService = pack.mainModule.provideStatusBar();
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function(pack) {
          return atom.packages.getActivePackage('linter').mainModule.consumeStatusBar(statusBar);
        });
      });
      return waitsForPromise(function() {
        return atom.workspace.open();
      });
    });
    it('can mount to left status-bar', function() {
      var tile;
      tile = statusBar.getLeftTiles()[0];
      return expect(tile.item.localName).toBe('linter-bottom-container');
    });
    it('can mount to right status-bar', function() {
      var tile;
      atom.config.set('linter.statusIconPosition', 'Right');
      tile = statusBar.getRightTiles()[0];
      return expect(tile.item.localName).toBe('linter-bottom-container');
    });
    it('defaults to visible', function() {
      var tile;
      tile = statusBar.getLeftTiles()[0];
      return expect(tile.item.visibility).toBe(true);
    });
    return it('toggles on config change', function() {
      var tile;
      tile = statusBar.getLeftTiles()[0];
      atom.config.set('linter.displayLinterInfo', false);
      expect(tile.item.visibility).toBe(false);
      atom.config.set('linter.displayLinterInfo', true);
      return expect(tile.item.visibility).toBe(true);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3VpL2JvdHRvbS1wYW5lbC1tb3VudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEsbURBQUE7QUFBQSxJQUFBLE9BQWtELEVBQWxELEVBQUMsbUJBQUQsRUFBWSwwQkFBWixFQUE4QiwwQkFBOUIsQ0FBQTtBQUFBLElBQ0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO0FBQUEsTUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixZQUE5QixDQUEyQyxDQUFDLElBQTVDLENBQWlELFNBQUMsSUFBRCxHQUFBO0FBQy9DLFVBQUEsU0FBQSxHQUFZLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLFlBQS9CLENBQVosQ0FBQTtpQkFDQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFoQixDQUFBLEVBRjRCO1FBQUEsQ0FBakQsRUFEYztNQUFBLENBQWhCLENBREEsQ0FBQTtBQUFBLE1BS0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsUUFBOUIsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxTQUFDLElBQUQsR0FBQTtpQkFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLFVBQVUsQ0FBQyxnQkFBcEQsQ0FBcUUsU0FBckUsRUFEMkM7UUFBQSxDQUE3QyxFQURjO01BQUEsQ0FBaEIsQ0FMQSxDQUFBO2FBUUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxFQURjO01BQUEsQ0FBaEIsRUFUUztJQUFBLENBQVgsQ0FEQSxDQUFBO0FBQUEsSUFhQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLFNBQVMsQ0FBQyxZQUFWLENBQUEsQ0FBeUIsQ0FBQSxDQUFBLENBQWhDLENBQUE7YUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFqQixDQUEyQixDQUFDLElBQTVCLENBQWlDLHlCQUFqQyxFQUZpQztJQUFBLENBQW5DLENBYkEsQ0FBQTtBQUFBLElBaUJBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCLEVBQTZDLE9BQTdDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLFNBQVMsQ0FBQyxhQUFWLENBQUEsQ0FBMEIsQ0FBQSxDQUFBLENBRGpDLENBQUE7YUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFqQixDQUEyQixDQUFDLElBQTVCLENBQWlDLHlCQUFqQyxFQUhrQztJQUFBLENBQXBDLENBakJBLENBQUE7QUFBQSxJQXNCQSxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLFNBQVMsQ0FBQyxZQUFWLENBQUEsQ0FBeUIsQ0FBQSxDQUFBLENBQWhDLENBQUE7YUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFqQixDQUE0QixDQUFDLElBQTdCLENBQWtDLElBQWxDLEVBRndCO0lBQUEsQ0FBMUIsQ0F0QkEsQ0FBQTtXQTBCQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLFNBQVMsQ0FBQyxZQUFWLENBQUEsQ0FBeUIsQ0FBQSxDQUFBLENBQWhDLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsRUFBNEMsS0FBNUMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFqQixDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE0QyxJQUE1QyxDQUhBLENBQUE7YUFJQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFqQixDQUE0QixDQUFDLElBQTdCLENBQWtDLElBQWxDLEVBTDZCO0lBQUEsQ0FBL0IsRUEzQjJCO0VBQUEsQ0FBN0IsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Kamilius/.atom/packages/linter/spec/ui/bottom-panel-mount-spec.coffee
