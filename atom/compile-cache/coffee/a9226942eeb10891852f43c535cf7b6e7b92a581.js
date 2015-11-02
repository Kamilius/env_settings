(function() {
  var CompositeDisposable, allowUnsafeNewFunction, execSync, findFile, path, statSync, sync,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
      },
      lintHtmlFiles: {
        type: 'boolean',
        "default": false,
        description: 'Enable lint JavaScript in HTML files'
      }
    },
    activate: function() {
      var scopeEmbedded;
      require('atom-package-deps').install('linter-eslint');
      console.log('activate linter-eslint');
      this.subscriptions = new CompositeDisposable;
      if (atom.config.get('linter-eslint.useGlobalEslint')) {
        this.findGlobalNPMdir();
      }
      scopeEmbedded = 'source.js.embedded.html';
      this.scopes = ['source.js', 'source.jsx', 'source.js.jsx', 'source.babel', 'source.js-semantic'];
      return this.subscriptions.add(atom.config.observe('linter-eslint.lintHtmlFiles', (function(_this) {
        return function(lintHtmlFiles) {
          if (lintHtmlFiles) {
            if (__indexOf.call(_this.scopes, scopeEmbedded) < 0) {
              return _this.scopes.push(scopeEmbedded);
            }
          } else {
            if (__indexOf.call(_this.scopes, scopeEmbedded) >= 0) {
              return _this.scopes.splice(_this.scopes.indexOf(scopeEmbedded), 1);
            }
          }
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var provider;
      return provider = {
        name: 'ESLint',
        grammarScopes: this.scopes,
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(TextEditor) {
            var CLIEngine, config, dirname, engine, error, eslintConfig, filePath, lintHtml, linter, onlyConfig, options, relative, results, rulesDir, showRuleId, _ref;
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
            lintHtml = atom.config.get('linter-eslint.lintHtmlFiles');
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
                config.plugins.forEach(_this.loadPlugin.bind(_this, engine, filePath));
              }
              if (lintHtml) {
                if (!config.plugins || (config.plugins && __indexOf.call(config.plugins, 'html') < 0)) {
                  engine.addPlugin('html', require('eslint-plugin-html'));
                }
              }
              try {
                results = [];
                allowUnsafeNewFunction(function() {
                  var messages, report;
                  report = engine.executeOnText(TextEditor.getText(), filePath);
                  messages = report.results[0].messages;
                  return results = messages.map(function(_arg) {
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
            encoding: 'utf8',
            stdio: 'pipe'
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvbGliL2xpbnRlci1lc2xpbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFGQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsU0FBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVDLFdBQVksT0FBQSxDQUFRLGVBQVIsRUFBWixRQUZELENBQUE7O0FBQUEsRUFHQyxXQUFZLE9BQUEsQ0FBUSxJQUFSLEVBQVosUUFIRCxDQUFBOztBQUFBLEVBSUMsV0FBWSxPQUFBLENBQVEsYUFBUixFQUFaLFFBSkQsQ0FBQTs7QUFBQSxFQUtDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFMRCxDQUFBOztBQUFBLEVBTUMseUJBQTBCLE9BQUEsQ0FBUSxVQUFSLEVBQTFCLHNCQU5ELENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxFQURUO09BREY7QUFBQSxNQUdBLCtCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHdEQUZiO09BSkY7QUFBQSxNQU9BLGVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsaUNBRmI7T0FSRjtBQUFBLE1BV0EsbUJBQUEsRUFDRTtBQUFBLFFBQUEs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

//# sourceURL=/Users/Kamilius/.atom/packages/linter-eslint/lib/linter-eslint.coffee
