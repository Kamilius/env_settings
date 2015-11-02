(function() {
  describe('Commands', function() {
    var getMessage, linter;
    linter = null;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    getMessage = function(type, filePath) {
      return {
        type: type,
        text: 'Some Message',
        filePath: filePath
      };
    };
    describe('linter:togglePanel', function() {
      return it('toggles the panel visibility', function() {
        var visibility;
        linter.views.panel.scope = 'Project';
        linter.views.panel.setMessages({
          added: [getMessage('Error')],
          removed: []
        });
        visibility = linter.views.panel.getVisibility();
        expect(visibility).toBe(true);
        linter.commands.togglePanel();
        expect(linter.views.panel.getVisibility()).toBe(!visibility);
        linter.commands.togglePanel();
        return expect(linter.views.panel.getVisibility()).toBe(visibility);
      });
    });
    return describe('linter:toggle', function() {
      return it('relint when enabled', function() {
        return waitsForPromise(function() {
          return atom.workspace.open(__dirname + '/fixtures/file.txt').then(function() {
            spyOn(linter.commands, 'lint');
            linter.commands.toggleLinter();
            linter.commands.toggleLinter();
            return expect(linter.commands.lint).toHaveBeenCalled();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbW1hbmRzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixRQUFBLGtCQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsSUFBVCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsUUFBOUIsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxTQUFBLEdBQUE7aUJBQzNDLE1BQUEsR0FBUyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLFFBQS9CLENBQXdDLENBQUMsVUFBVSxDQUFDLFNBRGxCO1FBQUEsQ0FBN0MsRUFEYztNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBT0EsVUFBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTtBQUNYLGFBQU87QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sSUFBQSxFQUFNLGNBQWI7QUFBQSxRQUE2QixVQUFBLFFBQTdCO09BQVAsQ0FEVztJQUFBLENBUGIsQ0FBQTtBQUFBLElBVUEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTthQUM3QixFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBRWpDLFlBQUEsVUFBQTtBQUFBLFFBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBbkIsR0FBMkIsU0FBM0IsQ0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBbkIsQ0FBK0I7QUFBQSxVQUFDLEtBQUEsRUFBTyxDQUFDLFVBQUEsQ0FBVyxPQUFYLENBQUQsQ0FBUjtBQUFBLFVBQStCLE9BQUEsRUFBUyxFQUF4QztTQUEvQixDQURBLENBQUE7QUFBQSxRQUdBLFVBQUEsR0FBYSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFuQixDQUFBLENBSGIsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLFVBQVAsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixJQUF4QixDQUpBLENBQUE7QUFBQSxRQUtBLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBaEIsQ0FBQSxDQUxBLENBQUE7QUFBQSxRQU1BLE1BQUEsQ0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFuQixDQUFBLENBQVAsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxDQUFBLFVBQWhELENBTkEsQ0FBQTtBQUFBLFFBT0EsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFoQixDQUFBLENBUEEsQ0FBQTtlQVFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFuQixDQUFBLENBQVAsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxVQUFoRCxFQVZpQztNQUFBLENBQW5DLEVBRDZCO0lBQUEsQ0FBL0IsQ0FWQSxDQUFBO1dBdUJBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTthQUN4QixFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQSxHQUFBO2VBQ3hCLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixTQUFBLEdBQVksb0JBQWhDLENBQXFELENBQUMsSUFBdEQsQ0FBMkQsU0FBQSxHQUFBO0FBQ3pELFlBQUEsS0FBQSxDQUFNLE1BQU0sQ0FBQyxRQUFiLEVBQXVCLE1BQXZCLENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFoQixDQUFBLENBREEsQ0FBQTtBQUFBLFlBRUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFoQixDQUFBLENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUF2QixDQUE0QixDQUFDLGdCQUE3QixDQUFBLEVBSnlEO1VBQUEsQ0FBM0QsRUFEYztRQUFBLENBQWhCLEVBRHdCO01BQUEsQ0FBMUIsRUFEd0I7SUFBQSxDQUExQixFQXhCbUI7RUFBQSxDQUFyQixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Kamilius/.atom/packages/linter/spec/commands-spec.coffee
