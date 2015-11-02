(function() {
  var CompositeDisposable, allowUnsafeNewFunction, execSync, findFile, linterPackage, path, statSync, sync;

  path = require('path');

  sync = require('resolve').sync;

  execSync = require('child_process').execSync;

  statSync = require('fs').statSync;

  findFile = require('atom-linter').findFile;

  CompositeDisposable = require('atom').CompositeDisposable;

  allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction;

  linterPackage = atom.packages.getLoadedPackage('linter');

  if (!linterPackage) {
    return atom.notifications.addError('Linter should be installed first, `apm install linter`', {
      dismissable: true
    });
  }

  module.exports = {
    config: {
      eslintRulesDir: {
        type: 'string',
        "default": ''
      },
      disableWhenNoEslintrcFileInPath: {
        type: 'boolean',
        "default": false,
        description: 'Disable linter when no `.eslintrc` is found in project'
      },
      useGlobalEslint: {
        type: 'boolean',
        "default": false,
        description: 'Use globally installed `eslint`'
      },
      showRuleIdInMessage: {
        type: 'boolean',
        "default": true,
        description: 'Show the `eslint` rule before error'
      },
      globalNodePath: {
        type: 'string',
        "default": '',
        description: 'Run `$ npm config get prefix` to find it'
      }
    },
    activate: function() {
      console.log('activate linter-eslint');
      this.subscriptions = new CompositeDisposable;
      if (atom.config.get('linter-eslint.useGlobalEslint')) {
        return this.findGlobalNPMdir();
      }
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var provider;
      return provider = {
        grammarScopes: ['source.js', 'source.js.jsx', 'source.babel', 'source.js-semantic'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(TextEditor) {
            var CLIEngine, config, dirname, engine, error, eslintConfig, filePath, linter, onlyConfig, options, relative, results, rulesDir, showRuleId, _ref;
            filePath = TextEditor.getPath();
            dirname = filePath ? path.dirname(filePath) : '';
            onlyConfig = atom.config.get('linter-eslint.disableWhenNoEslintrcFileInPath');
            eslintConfig = findFile(filePath, '.eslintrc');
            if (onlyConfig && !eslintConfig) {
              return [];
            }
            options = {};
            options.ignorePath = findFile(filePath, '.eslintignore');
            rulesDir = atom.config.get('linter-eslint.eslintRulesDir');
            if (rulesDir) {
              rulesDir = findFile(dirname, [rulesDir], false, 0);
            }
            showRuleId = atom.config.get('linter-eslint.showRuleIdInMessage');
            if (rulesDir) {
              try {
                if (statSync(rulesDir).isDirectory()) {
                  options.rulePaths = [rulesDir];
                }
              } catch (_error) {
                error = _error;
                console.warn('[Linter-ESLint] ESlint rules directory does not exist in your fs');
                console.warn(error.message);
              }
            }
            _ref = _this.requireESLint(filePath), linter = _ref.linter, CLIEngine = _ref.CLIEngine;
            if (filePath) {
              engine = new CLIEngine(options);
              config = {};
              allowUnsafeNewFunction(function() {
                return config = engine.getConfigForFile(filePath);
              });
              if (options.ignorePath) {
                relative = filePath.replace("" + (path.dirname(options.ignorePath)) + path.sep, '');
                if (engine.isPathIgnored(relative || engine.isPathIgnored("" + relative + "/"))) {
                  return [];
                }
              }
              if (config.plugins) {
                if (engine.addPlugin) {
                  config.plugins.forEach(_this.loadPlugin.bind(_this, engine, filePath));
                } else {
                  options.plugins = config.plugins;
                  engine = new CLIEngine(options);
                }
              }
              try {
                results = [];
                allowUnsafeNewFunction(function() {
                  return results = linter.verify(TextEditor.getText(), config, filePath).map(function(_arg) {
                    var endCol, indentLevel, line, message, range, ruleId, severity, startCol;
                    message = _arg.message, line = _arg.line, severity = _arg.severity, ruleId = _arg.ruleId;
                    indentLevel = TextEditor.indentationForBufferRow(line - 1);
                    startCol = TextEditor.getTabLength() * indentLevel;
                    endCol = TextEditor.getBuffer().lineLengthForRow(line - 1);
                    range = [[line - 1, startCol], [line - 1, endCol]];
                    if (showRuleId) {
                      return {
                        type: severity === 1 ? 'warning' : 'error',
                        html: '<span class="badge badge-flexible">' + ruleId + '</span> ' + message,
                        filePath: filePath,
                        range: range
                      };
                    } else {
                      return {
                        type: severity === 1 ? 'warning' : 'error',
                        text: message,
                        filePath: filePath,
                        range: range
                      };
                    }
                  });
                });
                return results;
              } catch (_error) {
                error = _error;
                console.warn('[Linter-ESLint] error while linting file');
                console.warn(error.message);
                console.warn(error.stack);
                return [
                  {
                    type: 'error',
                    text: 'error while linting file, open the console for more information',
                    file: filePath,
                    range: [[0, 0], [0, 0]]
                  }
                ];
              }
            }
          };
        })(this)
      };
    },
    loadPlugin: function(engine, filePath, pluginName) {
      var error, namespace, npmPluginName, plugin, pluginPath, _ref;
      namespace = '';
      if (pluginName[0] === '@') {
        _ref = pluginName.split('/'), namespace = _ref[0], pluginName = _ref[1];
        namespace += '/';
      }
      npmPluginName = pluginName.replace('eslint-plugin-', '');
      npmPluginName = "" + namespace + "eslint-plugin-" + npmPluginName;
      try {
        pluginPath = sync(npmPluginName, {
          basedir: path.dirname(filePath)
        });
        plugin = require(pluginPath);
        return engine.addPlugin(pluginName, plugin);
      } catch (_error) {
        error = _error;
        if (this.useGlobalEslint) {
          try {
            pluginPath = sync(npmPluginName, {
              basedir: this.npmPath
            });
            plugin = require(pluginPath);
            return engine.addPlugin(pluginName, plugin);
          } catch (_error) {}
        }
      }
      console.warn("[Linter-ESLint] error loading plugin");
      console.warn(error.message);
      console.warn(error.stack);
      return atom.notifications.addError("[Linter-ESLint] plugin " + pluginName + " not found", {
        dismissable: true
      });
    },
    requireESLint: function(filePath) {
      var error, eslint, eslintPath;
      this.localEslint = false;
      try {
        eslint = this.requireLocalESLint(filePath);
        this.localEslint = true;
        return eslint;
      } catch (_error) {
        error = _error;
        if (this.useGlobalEslint) {
          try {
            eslintPath = sync('eslint', {
              basedir: this.npmPath
            });
            eslint = allowUnsafeNewFunction(function() {
              return require(eslintPath);
            });
            this.localEslint = true;
            return eslint;
          } catch (_error) {}
        } else {
          if (!this.warnNotFound) {
            console.warn('[Linter-ESLint] local `eslint` not found');
            console.warn(error);
            atom.notifications.addError('[Linter-ESLint] `eslint` binary not found locally, falling back to packaged one. Plugins won\'t be loaded and linting will possibly not work. (Try `Use Global ESLint` option, or install locally `eslint` to your project.)', {
              dismissable: true
            });
            this.warnNotFound = true;
          }
        }
      }
      return require('eslint');
    },
    requireLocalESLint: function(filePath) {
      var currentPath, eslintPath;
      currentPath = filePath;
      while (currentPath !== path.dirname(currentPath)) {
        currentPath = path.dirname(currentPath);
        try {
          eslintPath = sync('eslint', {
            basedir: currentPath
          });
        } catch (_error) {
          continue;
        }
        return allowUnsafeNewFunction(function() {
          return require(eslintPath);
        });
      }
      throw new Error("Could not find `eslint` locally installed in " + (path.dirname(filePath)) + " or any parent directories");
    },
    findGlobalNPMdir: function() {
      var error, globalNodePath, globalNpmPath;
      try {
        globalNodePath = atom.config.get('linter-eslint.globalNodePath');
        if (!globalNodePath) {
          globalNodePath = execSync('npm config get prefix', {
            encoding: 'utf8'
          });
          globalNodePath = globalNodePath.replace(/[\n\r\t]/g, '');
        }
        globalNpmPath = path.join(globalNodePath, 'node_modules');
        try {
          statSync(globalNpmPath).isDirectory();
        } catch (_error) {
          globalNpmPath = path.join(globalNodePath, 'lib', 'node_modules');
        }
        if (statSync(globalNpmPath).isDirectory()) {
          this.useGlobalEslint = true;
          return this.npmPath = globalNpmPath;
        }
      } catch (_error) {
        error = _error;
        console.warn('[Linter-ESlint] error loading global eslint');
        console.warn(error);
        return atom.notifications.addError('[Linter-ESLint] Global node modules path not found, using packaged ESlint. Plugins won\'t be loaded and linting will possibly not work. (Try to set `Global node path` if not set)', {
          dismissable: true
        });
      }
    }
  };

}).call(this);
