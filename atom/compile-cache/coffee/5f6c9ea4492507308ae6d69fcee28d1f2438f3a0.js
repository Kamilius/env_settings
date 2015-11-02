(function() {
  var Config, Os;

  Config = require('../lib/config');

  Os = require('os');

  describe('pathSeparator tests', function() {
    ({
      beforeEach: function() {}
    });
    it('Not Windows', function() {
      spyOn(Os, 'platform').andReturn(Math.random());
      expect(Config.pathSeparator()).toBe('/');
      return expect(Os.platform).toHaveBeenCalled();
    });
    return it('Windows', function() {
      spyOn(Os, 'platform').andReturn('win32');
      expect(Config.pathSeparator()).toBe('\\');
      return expect(Os.platform).toHaveBeenCalled();
    });
  });

  describe('saveFile tests', function() {
    beforeEach(function() {
      spyOn(Config, 'saveFolder').andReturn('folder');
      return spyOn(Config, 'pathSeparator').andReturn('/');
    });
    return describe('projects restoring', function() {
      return it('is a project to be restored', function() {
        atom.project.path || (atom.project.rootDirectories[0].path = 'path');
        expect(Config.saveFile()).toBe('folder/path/project.json');
        expect(Config.saveFolder).toHaveBeenCalled();
        return expect(Config.pathSeparator).toHaveBeenCalled();
      });
    });
  });

  describe('transformProjectPath tests', function() {
    it('is Windows with :', function() {
      var path;
      spyOn(Config, 'isWindows').andReturn(true);
      path = Config.transformProjectPath('c:\\path');
      return expect(path).toBe('c\\path');
    });
    it('is Windows without :', function() {
      var path;
      spyOn(Config, 'isWindows').andReturn(true);
      path = Config.transformProjectPath('path\\more');
      return expect(path).toBe('path\\more');
    });
    return it('is not windows', function() {
      var path;
      spyOn(Config, 'isWindows').andReturn(false);
      path = Config.transformProjectPath('path/more');
      return expect(path).toBe('path/more');
    });
  });

  describe('config tests', function() {
    beforeEach(function() {
      spyOn(atom.config, 'set');
      return spyOn(atom.config, 'get');
    });
    it('Contains key and value', function() {
      Config.config('key', 'val');
      expect(atom.config.set).toHaveBeenCalled();
      return expect(atom.config.get).not.toHaveBeenCalled();
    });
    it('Contains key and forced', function() {
      Config.config('key', void 0, true);
      expect(atom.config.set).toHaveBeenCalled();
      return expect(atom.config.get).not.toHaveBeenCalled();
    });
    return it('Contains key only', function() {
      Config.config('key');
      expect(atom.config.set).not.toHaveBeenCalled();
      return expect(atom.config.get).toHaveBeenCalled();
    });
  });

}).call(this);
