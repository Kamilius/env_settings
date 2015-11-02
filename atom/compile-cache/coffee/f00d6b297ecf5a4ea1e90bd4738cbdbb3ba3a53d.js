(function() {
  var CompositeDisposable, allowUnsafeNewFunction, execSync, findFile, path, statSync, sync;

  path = require('path');

  sync = require('resolve').sync;

  execSync = require('child_process').execSync;

  statSync = require('fs').statSync;

  findFile = require('atom-linter').findFile;

  CompositeDisposable = require('atom').CompositeDisposable;

  allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction;

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
      require('atom-package-deps').install('linter-eslint');
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
        name: 'ESLint',
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
                    var column, endOfLine, indentLevel, line, message, range, ruleId, severity, startCol;
                    message = _arg.message, line = _arg.line, severity = _arg.severity, ruleId = _arg.ruleId, column = _arg.column;
                    indentLevel = TextEditor.indentationForBufferRow(line - 1);
                    startCol = (column || TextEditor.getTabLength() * indentLevel) - 1;
                    endOfLine = TextEditor.getBuffer().lineLengthForRow(line - 1);
                    range = [[line - 1, startCol], [line - 1, endOfLine]];
                    if (showRuleId) {
                      return {
                        type: severity === 1 ? 'Warning' : 'Error',
                        html: '<span class="badge badge-flexible">' + ruleId + '</span> ' + message,
                        filePath: filePath,
                        range: range
                      };
                    } else {
                      return {
                        type: severity === 1 ? 'Warning' : 'Error',
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
                    type: 'Error',
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvbGliL2xpbnRlci1lc2xpbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFGQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLFNBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQyxXQUFZLE9BQUEsQ0FBUSxlQUFSLEVBQVosUUFGRCxDQUFBOztBQUFBLEVBR0MsV0FBWSxPQUFBLENBQVEsSUFBUixFQUFaLFFBSEQsQ0FBQTs7QUFBQSxFQUlDLFdBQVksT0FBQSxDQUFRLGFBQVIsRUFBWixRQUpELENBQUE7O0FBQUEsRUFLQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBTEQsQ0FBQTs7QUFBQSxFQU1DLHlCQUEwQixPQUFBLENBQVEsVUFBUixFQUExQixzQkFORCxDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtPQURGO0FBQUEsTUFHQSwrQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSx3REFGYjtPQUpGO0FBQUEsTUFPQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGlDQUZiO09BUkY7QUFBQSxNQVdBLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxT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

//# sourceURL=/Users/Kamilius/.atom/packages/linter-eslint/lib/linter-eslint.coffee
