(function() {
  var Transpiler, fs, path, pathIsInside;

  fs = require('fs-plus');

  path = require('path');

  pathIsInside = require('path-is-inside');

  Transpiler = (function() {
    function Transpiler() {
      this.transpileErrorNotifications = {};
      this.deprecateConfig();
    }

    Transpiler.prototype.transpile = function(sourceFile, textEditor) {
      var babelOptions, config, pathTo;
      config = this.getConfig();
      if (config.transpileOnSave !== true) {
        return;
      }
      pathTo = this.getPaths(sourceFile, config);
      if (config.disableWhenNoBabelrcFileInPath) {
        if (!this.isBabelrcInPath(pathTo.sourceFileDir, path.parse(pathTo.sourceFileDir).root)) {
          return;
        }
      }
      if (!pathIsInside(pathTo.sourceFile, pathTo.sourceRoot)) {
        if (!config.suppressSourcePathMessages) {
          atom.notifications.addWarning('Babel file is not inside the "Babel Source Path" directory.', {
            dismissable: false,
            detail: "No transpiled code output for file \n" + pathTo.sourceFile + " \n\nTo suppress these 'invalid source path' messages use language-babel package settings"
          });
        }
        return;
      }
      babelOptions = this.getBabelOptions(config, pathTo);
      if (this.transpileErrorNotifications[pathTo.sourceFile] != null) {
        this.transpileErrorNotifications[pathTo.sourceFile].dismiss();
        delete this.transpileErrorNotifications[pathTo.sourceFile];
      }
      if (this.babel == null) {
        this.babel = require('../node_modules/babel-core');
      }
      return this.babel.transformFile(pathTo.sourceFile, babelOptions, (function(_this) {
        return function(err, result) {
          var mapJson, notification, xssiProtection, _ref;
          if (((result != null ? result.ignored : void 0) != null) && result.ignored === true) {
            return;
          }
          if (err) {
            notification = atom.notifications.addError("Babel v" + _this.babel.version + " Transpiler Error", {
              dismissable: true,
              detail: err.message
            });
            _this.transpileErrorNotifications[pathTo.sourceFile] = notification;
            if ((err.loc != null) && (textEditor != null)) {
              return textEditor.setCursorBufferPosition([err.loc.line - 1, err.loc.column - 1]);
            }
          } else {
            if (!config.suppressTranspileOnSaveMessages) {
              atom.notifications.addInfo("Babel v" + _this.babel.version + " Transpiler Success", {
                detail: pathTo.sourceFile
              });
            }
            if (!config.createTranspiledCode) {
              if (!config.suppressTranspileOnSaveMessages) {
                atom.notifications.addInfo('No transpiled output configured');
              }
              return;
            }
            if (pathTo.sourceFile === pathTo.transpiledFile) {
              atom.notifications.addWarning('Transpiled file would overwrite source file. Aborted!', {
                dismissable: true,
                detail: pathTo.sourceFile
              });
              return;
            }
            if (config.createTargetDirectories) {
              fs.makeTreeSync(path.parse(pathTo.transpiledFile).dir);
            }
            if (config.babelMapsAddUrl) {
              result.code = result.code + '\n' + '//# sourceMappingURL=' + pathTo.mapFile;
            }
            fs.writeFileSync(pathTo.transpiledFile, result.code);
            if (config.createMap && ((_ref = result.map) != null ? _ref.version : void 0)) {
              if (config.createTargetDirectories) {
                fs.makeTreeSync(path.parse(pathTo.mapFile).dir);
              }
              mapJson = {
                version: result.map.version,
                sources: pathTo.sourceFile,
                file: pathTo.transpiledFile,
                sourceRoot: '',
                names: result.map.names,
                mappings: result.map.mappings
              };
              xssiProtection = ')]}\n';
              return fs.writeFileSync(pathTo.mapFile, xssiProtection + JSON.stringify(mapJson, null, ' '));
            }
          }
        };
      })(this));
    };

    Transpiler.prototype.deprecateConfig = function() {
      if (atom.config.get('language-babel.supressTranspileOnSaveMessages') != null) {
        atom.config.set('language-babel.suppressTranspileOnSaveMessages', atom.config.get('language-babel.supressTranspileOnSaveMessages'));
      }
      if (atom.config.get('language-babel.supressSourcePathMessages') != null) {
        atom.config.set('language-babel.suppressSourcePathMessages', atom.config.get('language-babel.supressSourcePathMessages'));
      }
      atom.config.unset('language-babel.supressTranspileOnSaveMessages');
      atom.config.unset('language-babel.supressSourcePathMessages');
      atom.config.unset('language-babel.useInternalScanner');
      return atom.config.unset('language-babel.stopAtProjectDirectory');
    };

    Transpiler.prototype.getBabelOptions = function(config, pathTo) {
      var babelOptions;
      babelOptions = {
        sourceMaps: config.createMap,
        blacklist: config.blacklistTransformers,
        loose: config.looseTransformers,
        optional: config.optionalTransformers,
        modules: config.moduleLoader,
        stage: config.babelStage,
        externalHelpers: config.externalHelpers,
        code: true
      };
      if (config.whitelistTransformers.length > 0) {
        babelOptions.whitelist = config.whitelistTransformers;
      }
      return babelOptions;
    };

    Transpiler.prototype.isBabelrcInPath = function(fromDir, toDir) {
      var babelrc, babelrcFile;
      babelrc = '.babelrc';
      babelrcFile = path.join(fromDir, babelrc);
      if (fs.existsSync(babelrcFile)) {
        return true;
      }
      if (fromDir !== toDir) {
        return this.isBabelrcInPath(path.dirname(fromDir), toDir);
      } else {
        return false;
      }
    };

    Transpiler.prototype.getConfig = function() {
      return atom.config.get('language-babel');
    };

    Transpiler.prototype.getPaths = function(sourceFile, config) {
      var absMapFile, absMapsRoot, absProjectPath, absSourceRoot, absTranspileRoot, absTranspiledFile, parsedSourceFile, projectContainingSource, relMapsPath, relSourcePath, relSourceRootToSourceFile, relTranspilePath;
      projectContainingSource = atom.project.relativizePath(sourceFile);
      if (projectContainingSource[0] === null) {
        absProjectPath = path.parse(sourceFile).root;
      } else {
        absProjectPath = path.normalize(projectContainingSource[0]);
      }
      relSourcePath = path.normalize(config.babelSourcePath);
      relTranspilePath = path.normalize(config.babelTranspilePath);
      relMapsPath = path.normalize(config.babelMapsPath);
      absSourceRoot = path.join(absProjectPath, relSourcePath);
      absTranspileRoot = path.join(absProjectPath, relTranspilePath);
      absMapsRoot = path.join(absProjectPath, relMapsPath);
      parsedSourceFile = path.parse(sourceFile);
      relSourceRootToSourceFile = path.relative(absSourceRoot, parsedSourceFile.dir);
      absTranspiledFile = path.join(absTranspileRoot, relSourceRootToSourceFile, parsedSourceFile.name + '.js');
      absMapFile = path.join(absMapsRoot, relSourceRootToSourceFile, parsedSourceFile.name + '.js.map');
      return {
        sourceFile: sourceFile,
        sourceFileDir: parsedSourceFile.dir,
        mapFile: absMapFile,
        transpiledFile: absTranspiledFile,
        sourceRoot: absSourceRoot,
        projectPath: absProjectPath
      };
    };

    return Transpiler;

  })();

  exports.Transpiler = Transpiler;

}).call(this);
