(function() {
  var BufferedProcess, CompositeDisposable, MinimapPluginGeneratorElement, TextEditor, fs, path, registerOrUpdateElement, _, _ref;

  _ = require('underscore-plus');

  fs = require('fs-plus');

  path = require('path');

  _ref = require('atom'), TextEditor = _ref.TextEditor, BufferedProcess = _ref.BufferedProcess;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  registerOrUpdateElement = require('atom-utils').registerOrUpdateElement;

  module.exports = MinimapPluginGeneratorElement = (function() {
    function MinimapPluginGeneratorElement() {}

    MinimapPluginGeneratorElement.prototype.previouslyFocusedElement = null;

    MinimapPluginGeneratorElement.prototype.mode = null;

    MinimapPluginGeneratorElement.prototype.createdCallback = function() {
      this.classList.add('minimap-plugin-generator');
      this.classList.add('overlay');
      this.classList.add('from-top');
      this.editor = new TextEditor({
        mini: true
      });
      this.editorElement = atom.views.getView(this.editor);
      this.error = document.createElement('div');
      this.error.classList.add('error');
      this.message = document.createElement('div');
      this.message.classList.add('message');
      this.appendChild(this.editorElement);
      this.appendChild(this.error);
      return this.appendChild(this.message);
    };

    MinimapPluginGeneratorElement.prototype.attachedCallback = function() {
      this.previouslyFocusedElement = document.activeElement;
      this.message.textContent = "Enter plugin path";
      this.setPathText("my-minimap-plugin");
      return this.editorElement.focus();
    };

    MinimapPluginGeneratorElement.prototype.attach = function() {
      return atom.views.getView(atom.workspace).appendChild(this);
    };

    MinimapPluginGeneratorElement.prototype.setPathText = function(placeholderName, rangeToSelect) {
      var endOfDirectoryIndex, packagesDirectory, pathLength;
      if (rangeToSelect == null) {
        rangeToSelect = [0, placeholderName.length];
      }
      packagesDirectory = this.getPackagesDirectory();
      this.editor.setText(path.join(packagesDirectory, placeholderName));
      pathLength = this.editor.getText().length;
      endOfDirectoryIndex = pathLength - placeholderName.length;
      return this.editor.setSelectedBufferRange([[0, endOfDirectoryIndex + rangeToSelect[0]], [0, endOfDirectoryIndex + rangeToSelect[1]]]);
    };

    MinimapPluginGeneratorElement.prototype.detach = function() {
      var _ref1;
      if (this.parentNode == null) {
        return;
      }
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return this.parentNode.removeChild(this);
    };

    MinimapPluginGeneratorElement.prototype.confirm = function() {
      if (this.validPackagePath()) {
        this.removeChild(this.editorElement);
        this.message.innerHTML = "<span class='loading loading-spinner-tiny inline-block'></span>\nGenerate plugin at <span class=\"text-primary\">" + (this.getPackagePath()) + "</span>";
        return this.createPackageFiles((function(_this) {
          return function() {
            var packagePath;
            packagePath = _this.getPackagePath();
            atom.open({
              pathsToOpen: [packagePath],
              devMode: atom.config.get('minimap.createPluginInDevMode')
            });
            _this.message.innerHTML = "<span class=\"text-success\">Plugin successfully generated, opening it now...</span>";
            return setTimeout(function() {
              return _this.detach();
            }, 2000);
          };
        })(this));
      }
    };

    MinimapPluginGeneratorElement.prototype.getPackagePath = function() {
      var packageName, packagePath;
      packagePath = this.editor.getText();
      packageName = _.dasherize(path.basename(packagePath));
      return path.join(path.dirname(packagePath), packageName);
    };

    MinimapPluginGeneratorElement.prototype.getPackagesDirectory = function() {
      return atom.config.get('core.projectHome') || process.env.ATOM_REPOS_HOME || path.join(fs.getHomeDirectory(), 'github');
    };

    MinimapPluginGeneratorElement.prototype.validPackagePath = function() {
      if (fs.existsSync(this.getPackagePath())) {
        this.error.textContent = "Path already exists at '" + (this.getPackagePath()) + "'";
        this.error.style.display = 'block';
        return false;
      } else {
        return true;
      }
    };

    MinimapPluginGeneratorElement.prototype.initPackage = function(packagePath, callback) {
      var templatePath;
      templatePath = path.resolve(__dirname, path.join('..', 'templates', "plugin-" + this.template));
      return this.runCommand(atom.packages.getApmPath(), ['init', "-p", "" + packagePath, "--template", templatePath], callback);
    };

    MinimapPluginGeneratorElement.prototype.linkPackage = function(packagePath, callback) {
      var args;
      args = ['link'];
      if (atom.config.get('minimap.createPluginInDevMode')) {
        args.push('--dev');
      }
      args.push(packagePath.toString());
      return this.runCommand(atom.packages.getApmPath(), args, callback);
    };

    MinimapPluginGeneratorElement.prototype.installPackage = function(packagePath, callback) {
      var args;
      args = ['install'];
      return this.runCommand(atom.packages.getApmPath(), args, callback, {
        cwd: packagePath
      });
    };

    MinimapPluginGeneratorElement.prototype.isStoredInDotAtom = function(packagePath) {
      var devPackagesPath, packagesPath;
      packagesPath = path.join(atom.getConfigDirPath(), 'packages', path.sep);
      if (packagePath.indexOf(packagesPath) === 0) {
        return true;
      }
      devPackagesPath = path.join(atom.getConfigDirPath(), 'dev', 'packages', path.sep);
      return packagePath.indexOf(devPackagesPath) === 0;
    };

    MinimapPluginGeneratorElement.prototype.createPackageFiles = function(callback) {
      var packagePath, packagesDirectory;
      packagePath = this.getPackagePath();
      packagesDirectory = this.getPackagesDirectory();
      if (this.isStoredInDotAtom(packagePath)) {
        return this.initPackage(packagePath, (function(_this) {
          return function() {
            return _this.installPackage(packagePath, callback);
          };
        })(this));
      } else {
        return this.initPackage(packagePath, (function(_this) {
          return function() {
            return _this.linkPackage(packagePath, function() {
              return _this.installPackage(packagePath, callback);
            });
          };
        })(this));
      }
    };

    MinimapPluginGeneratorElement.prototype.runCommand = function(command, args, exit, options) {
      if (options == null) {
        options = {};
      }
      return new BufferedProcess({
        command: command,
        args: args,
        exit: exit,
        options: options
      });
    };

    return MinimapPluginGeneratorElement;

  })();

  module.exports = MinimapPluginGeneratorElement = registerOrUpdateElement('minimap-plugin-generator', MinimapPluginGeneratorElement.prototype);

  atom.commands.add('minimap-plugin-generator', {
    'core:confirm': function() {
      return this.confirm();
    },
    'core:cancel': function() {
      return this.detach();
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAtcGx1Z2luLWdlbmVyYXRvci1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwySEFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxPQUFnQyxPQUFBLENBQVEsTUFBUixDQUFoQyxFQUFDLGtCQUFBLFVBQUQsRUFBYSx1QkFBQSxlQUhiLENBQUE7O0FBQUEsRUFJQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBSkQsQ0FBQTs7QUFBQSxFQUtDLDBCQUEyQixPQUFBLENBQVEsWUFBUixFQUEzQix1QkFMRCxDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDTTsrQ0FDSjs7QUFBQSw0Q0FBQSx3QkFBQSxHQUEwQixJQUExQixDQUFBOztBQUFBLDRDQUNBLElBQUEsR0FBTSxJQUROLENBQUE7O0FBQUEsNENBR0EsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLDBCQUFmLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsU0FBZixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFVBQWYsQ0FGQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsVUFBQSxDQUFXO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBTjtP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

//# sourceURL=/Users/Kamilius/.atom/packages/minimap/lib/minimap-plugin-generator-element.coffee
