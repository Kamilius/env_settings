(function() {
  var Tstpackage, WorkspaceView;

  WorkspaceView = require('atom').WorkspaceView;

  Tstpackage = require('../lib/tstpackage');

  describe("Tstpackage", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('tstpackage');
    });
    return describe("when the tstpackage:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.tstpackage')).not.toExist();
        atom.commands.dispatch(atom.workspaceView.element, 'tstpackage:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.tstpackage')).toExist();
          atom.commands.dispatch(atom.workspaceView.element, 'tstpackage:toggle');
          return expect(atom.workspaceView.find('.tstpackage')).not.toExist();
        });
      });
    });
  });

}).call(this);
