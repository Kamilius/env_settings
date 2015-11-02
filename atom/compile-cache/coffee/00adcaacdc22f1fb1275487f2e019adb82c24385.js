(function() {
  var change;

  change = require('./helpers/events').change;

  describe('ColorProjectElement', function() {
    var pigments, project, projectElement, _ref;
    _ref = [], pigments = _ref[0], project = _ref[1], projectElement = _ref[2];
    beforeEach(function() {
      var jasmineContent;
      jasmineContent = document.body.querySelector('#jasmine-content');
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          project = pigments.getProject();
          projectElement = atom.views.getView(project);
          return jasmineContent.appendChild(projectElement);
        });
      });
    });
    it('is bound to the ColorProject model', function() {
      return expect(projectElement).toExist();
    });
    describe('typing in the sourceNames input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setSourceNames');
        projectElement.sourceNames.getModel().setText('foo, bar');
        projectElement.sourceNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSourceNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the searchNames input', function() {
      return it('update the search names in the project', function() {
        spyOn(project, 'setSearchNames');
        projectElement.searchNames.getModel().setText('foo, bar');
        projectElement.searchNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSearchNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the ignoredNames input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoredNames');
        projectElement.ignoredNames.getModel().setText('foo, bar');
        projectElement.ignoredNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setIgnoredNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the ignoredScopes input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoredScopes');
        projectElement.ignoredScopes.getModel().setText('foo, bar');
        projectElement.ignoredScopes.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setIgnoredScopes).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('toggling on the includeThemes checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIncludeThemes');
        projectElement.includeThemes.checked = true;
        change(projectElement.includeThemes);
        expect(project.setIncludeThemes).toHaveBeenCalledWith(true);
        projectElement.includeThemes.checked = false;
        change(projectElement.includeThemes);
        return expect(project.setIncludeThemes).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalSourceNames checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSourceNames');
        projectElement.ignoreGlobalSourceNames.checked = true;
        change(projectElement.ignoreGlobalSourceNames);
        expect(project.setIgnoreGlobalSourceNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSourceNames.checked = false;
        change(projectElement.ignoreGlobalSourceNames);
        return expect(project.setIgnoreGlobalSourceNames).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalIgnoredNames checkbox', function() {
      return it('update the ignored names in the project', function() {
        spyOn(project, 'setIgnoreGlobalIgnoredNames');
        projectElement.ignoreGlobalIgnoredNames.checked = true;
        change(projectElement.ignoreGlobalIgnoredNames);
        expect(project.setIgnoreGlobalIgnoredNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalIgnoredNames.checked = false;
        change(projectElement.ignoreGlobalIgnoredNames);
        return expect(project.setIgnoreGlobalIgnoredNames).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalIgnoredScopes checkbox', function() {
      return it('update the ignored scopes in the project', function() {
        spyOn(project, 'setIgnoreGlobalIgnoredScopes');
        projectElement.ignoreGlobalIgnoredScopes.checked = true;
        change(projectElement.ignoreGlobalIgnoredScopes);
        expect(project.setIgnoreGlobalIgnoredScopes).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalIgnoredScopes.checked = false;
        change(projectElement.ignoreGlobalIgnoredScopes);
        return expect(project.setIgnoreGlobalIgnoredScopes).toHaveBeenCalledWith(false);
      });
    });
    return describe('toggling on the ignoreGlobalSearchNames checkbox', function() {
      return it('update the search names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSearchNames');
        projectElement.ignoreGlobalSearchNames.checked = true;
        change(projectElement.ignoreGlobalSearchNames);
        expect(project.setIgnoreGlobalSearchNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSearchNames.checked = false;
        change(projectElement.ignoreGlobalSearchNames);
        return expect(project.setIgnoreGlobalSearchNames).toHaveBeenCalledWith(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItcHJvamVjdC1lbGVtZW50LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE1BQUE7O0FBQUEsRUFBQyxTQUFVLE9BQUEsQ0FBUSxrQkFBUixFQUFWLE1BQUQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSx1Q0FBQTtBQUFBLElBQUEsT0FBc0MsRUFBdEMsRUFBQyxrQkFBRCxFQUFXLGlCQUFYLEVBQW9CLHdCQUFwQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxjQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBZCxDQUE0QixrQkFBNUIsQ0FBakIsQ0FBQTthQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFVBQTlCLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsU0FBQyxHQUFELEdBQUE7QUFDaEUsVUFBQSxRQUFBLEdBQVcsR0FBRyxDQUFDLFVBQWYsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxHQUFVLFFBQVEsQ0FBQyxVQUFULENBQUEsQ0FEVixDQUFBO0FBQUEsVUFFQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixPQUFuQixDQUZqQixDQUFBO2lCQUdBLGNBQWMsQ0FBQyxXQUFmLENBQTJCLGNBQTNCLEVBSmdFO1FBQUEsQ0FBL0MsRUFBSDtNQUFBLENBQWhCLEVBSFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBV0EsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUEsR0FBQTthQUN2QyxNQUFB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

//# sourceURL=/Users/Kamilius/.atom/packages/pigments/spec/color-project-element-spec.coffee
