(function() {
  var Crypto, Os;

  Os = require('os');

  Crypto = require('crypto');

  module.exports = {
    disableNewBufferOnOpen: function(val, force) {
      return this.config('disableNewFileOnOpen', val, force);
    },
    disableNewBufferOnOpenAlways: function(val, force) {
      return this.config('disableNewFileOnOpenAlways', val, force);
    },
    restoreOpenFilesPerProject: function(val, force) {
      return this.config('restoreOpenFilesPerProject', val, force);
    },
    saveFolder: function(val, force) {
      var saveFolderPath;
      saveFolderPath = this.config('dataSaveFolder', val, force);
      if (saveFolderPath == null) {
        this.setSaveFolderDefault();
        saveFolderPath = this.saveFolder();
      }
      return saveFolderPath;
    },
    restoreOpenFileContents: function(val, force) {
      return this.config('restoreOpenFileContents', val, force);
    },
    skipSavePrompt: function(val, force) {
      return this.config('skipSavePrompt', val, force);
    },
    extraDelay: function(val, force) {
      return this.config('extraDelay', val, force);
    },
    setSaveFolderDefault: function() {
      return this.saveFolder(atom.packages.getPackageDirPaths() + this.pathSeparator() + 'save-session' + this.pathSeparator() + 'projects');
    },
    pathSeparator: function() {
      if (this.isWindows()) {
        return '\\';
      }
      return '/';
    },
    isWindows: function() {
      return Os.platform() === 'win32';
    },
    isArray: function(value) {
      return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number' && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
    },
    saveFile: function() {
      var path, projectPath, projects, saveFolderPath;
      saveFolderPath = this.saveFolder();
      if (atom.project.getPaths().length > 0) {
        projects = atom.project.getPaths();
        if ((projects != null) && projects.length > 0) {
          projectPath = projects[0];
        }
        if (projectPath != null) {
          path = this.transformProjectPath(projectPath);
          return saveFolderPath + this.pathSeparator() + path + this.pathSeparator() + 'project.json';
        }
      }
      return saveFolderPath + this.pathSeparator() + 'project.json';
    },
    transformProjectPath: function(path) {
      var colon;
      if (this.isWindows) {
        colon = path.indexOf(':');
        if (colon !== -1) {
          return path.substring(0, colon) + path.substring(colon + 1, path.length);
        }
      }
      return path;
    },
    hashMyStr: function(str) {
      var hash;
      hash = "";
      if ((str != null) && str !== "") {
        hash = Crypto.createHash('md5').update(str).digest("hex");
      }
      return hash;
    },
    config: function(key, val, force) {
      if ((val != null) || ((force != null) && force)) {
        return atom.config.set('save-session.' + key, val);
      } else {
        return atom.config.get('save-session.' + key);
      }
    },
    observe: function(key, callback) {
      return atom.config.observe('save-session.' + key, callback);
    }
  };

}).call(this);
