(function() {
  var CompositeDisposable, Emitter, Main, Minimap, MinimapElement, MinimapPluginGeneratorElement, PluginManagement, deprecate, semver, _ref, _ref1;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  PluginManagement = require('./mixins/plugin-management');

  _ref1 = [], Minimap = _ref1[0], MinimapElement = _ref1[1], MinimapPluginGeneratorElement = _ref1[2], deprecate = _ref1[3], semver = _ref1[4];

  Main = (function() {
    PluginManagement.includeInto(Main);


    /* Public */

    Main.prototype.config = {
      plugins: {
        type: 'object',
        properties: {}
      },
      autoToggle: {
        type: 'boolean',
        "default": true
      },
      displayMinimapOnLeft: {
        type: 'boolean',
        "default": false
      },
      displayCodeHighlights: {
        type: 'boolean',
        "default": true,
        description: 'Toggles the render of the buffer tokens in the minimap.'
      },
      displayPluginsControls: {
        type: 'boolean',
        "default": true,
        description: 'You need to restart Atom for this setting to be effective.'
      },
      minimapScrollIndicator: {
        type: 'boolean',
        "default": true,
        description: 'Toggles the display of a side line showing which part of the buffer is currently displayed by the minimap. This side line will only appear if the minimap is taller than the editor view height.'
      },
      useHardwareAcceleration: {
        type: 'boolean',
        "default": true
      },
      adjustMinimapWidthToSoftWrap: {
        type: 'boolean',
        "default": true,
        description: 'If this option is enabled and Soft Wrap is checked then the Minimap max width is set to the Preferred Line Length value.'
      },
      charWidth: {
        type: 'number',
        "default": 1,
        minimum: .5
      },
      charHeight: {
        type: 'number',
        "default": 2,
        minimum: .5
      },
      interline: {
        type: 'number',
        "default": 1,
        minimum: 0,
        description: 'The space between lines in the minimap in pixels.'
      },
      textOpacity: {
        type: 'number',
        "default": 0.6,
        minimum: 0,
        maximum: 1,
        description: "The opacity used to render the line's text in the minimap."
      },
      scrollAnimation: {
        type: 'boolean',
        "default": false,
        description: 'Enables animations when scrolling by clicking on the minimap.'
      },
      scrollAnimationDuration: {
        type: 'integer',
        "default": 300,
        description: 'The duration of scrolling animations when clicking on the minimap.'
      },
      createPluginInDevMode: {
        type: 'boolean',
        "default": false
      },
      absoluteMode: {
        type: 'boolean',
        "default": false,
        description: 'When enabled the text editor content will be able to flow below the minimap.'
      }
    };

    Main.prototype.active = false;

    function Main() {
      this.emitter = new Emitter;
    }

    Main.prototype.activate = function() {
      if (this.active) {
        return;
      }
      if (MinimapElement == null) {
        MinimapElement = require('./minimap-element');
      }
      MinimapElement.registerViewProvider();
      this.subscriptionsOfCommands = atom.commands.add('atom-workspace', {
        'minimap:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'minimap:generate-coffee-plugin': (function(_this) {
          return function() {
            return _this.generatePlugin('coffee');
          };
        })(this),
        'minimap:generate-javascript-plugin': (function(_this) {
          return function() {
            return _this.generatePlugin('javascript');
          };
        })(this),
        'minimap:generate-babel-plugin': (function(_this) {
          return function() {
            return _this.generatePlugin('babel');
          };
        })(this)
      });
      this.subscriptions = new CompositeDisposable;
      this.active = true;
      if (atom.config.get('minimap.autoToggle')) {
        return this.toggle();
      }
    };

    Main.prototype.deactivate = function() {
      var _ref2;
      if (!this.active) {
        return;
      }
      this.deactivateAllPlugins();
      if ((_ref2 = this.editorsMinimaps) != null) {
        _ref2.forEach((function(_this) {
          return function(value, key) {
            value.destroy();
            return _this.editorsMinimaps["delete"](key);
          };
        })(this));
      }
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.subscriptionsOfCommands.dispose();
      this.subscriptionsOfCommands = null;
      this.editorsMinimaps = void 0;
      this.toggled = false;
      return this.active = false;
    };

    Main.prototype.toggle = function() {
      var _ref2;
      if (!this.active) {
        return;
      }
      if (this.toggled) {
        this.toggled = false;
        if ((_ref2 = this.editorsMinimaps) != null) {
          _ref2.forEach((function(_this) {
            return function(value, key) {
              value.destroy();
              return _this.editorsMinimaps["delete"](key);
            };
          })(this));
        }
        return this.subscriptions.dispose();
      } else {
        this.toggled = true;
        return this.initSubscriptions();
      }
    };

    Main.prototype.generatePlugin = function(template) {
      var view;
      if (MinimapPluginGeneratorElement == null) {
        MinimapPluginGeneratorElement = require('./minimap-plugin-generator-element');
      }
      view = new MinimapPluginGeneratorElement();
      view.template = template;
      return view.attach();
    };

    Main.prototype.onDidActivate = function(callback) {
      return this.emitter.on('did-activate', callback);
    };

    Main.prototype.onDidDeactivate = function(callback) {
      return this.emitter.on('did-deactivate', callback);
    };

    Main.prototype.onDidCreateMinimap = function(callback) {
      return this.emitter.on('did-create-minimap', callback);
    };

    Main.prototype.onDidAddPlugin = function(callback) {
      return this.emitter.on('did-add-plugin', callback);
    };

    Main.prototype.onDidRemovePlugin = function(callback) {
      return this.emitter.on('did-remove-plugin', callback);
    };

    Main.prototype.onDidActivatePlugin = function(callback) {
      return this.emitter.on('did-activate-plugin', callback);
    };

    Main.prototype.onDidDeactivatePlugin = function(callback) {
      return this.emitter.on('did-deactivate-plugin', callback);
    };

    Main.prototype.minimapClass = function() {
      return Minimap != null ? Minimap : Minimap = require('./minimap');
    };

    Main.prototype.minimapForEditorElement = function(editorElement) {
      if (editorElement == null) {
        return;
      }
      return this.minimapForEditor(editorElement.getModel());
    };

    Main.prototype.minimapForEditor = function(textEditor) {
      var editorSubscription, minimap;
      if (textEditor == null) {
        return;
      }
      if (Minimap == null) {
        Minimap = require('./minimap');
      }
      if (this.editorsMinimaps == null) {
        this.editorsMinimaps = new Map;
      }
      minimap = this.editorsMinimaps.get(textEditor);
      if (minimap == null) {
        minimap = new Minimap({
          textEditor: textEditor
        });
        this.editorsMinimaps.set(textEditor, minimap);
        editorSubscription = textEditor.onDidDestroy((function(_this) {
          return function() {
            var _ref2;
            if ((_ref2 = _this.editorsMinimaps) != null) {
              _ref2["delete"](textEditor);
            }
            return editorSubscription.dispose();
          };
        })(this));
      }
      return minimap;
    };

    Main.prototype.standAloneMinimapForEditor = function(textEditor) {
      if (textEditor == null) {
        return;
      }
      if (Minimap == null) {
        Minimap = require('./minimap');
      }
      return new Minimap({
        textEditor: textEditor,
        standAlone: true
      });
    };

    Main.prototype.getActiveMinimap = function() {
      return this.minimapForEditor(atom.workspace.getActiveTextEditor());
    };

    Main.prototype.observeMinimaps = function(iterator) {
      var createdCallback, _ref2;
      if (iterator == null) {
        return;
      }
      if ((_ref2 = this.editorsMinimaps) != null) {
        _ref2.forEach(function(minimap) {
          return iterator(minimap);
        });
      }
      createdCallback = function(minimap) {
        return iterator(minimap);
      };
      return this.onDidCreateMinimap(createdCallback);
    };

    Main.prototype.initSubscriptions = function() {
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          var editorElement, minimap, minimapElement;
          minimap = _this.minimapForEditor(textEditor);
          editorElement = atom.views.getView(textEditor);
          minimapElement = atom.views.getView(minimap);
          _this.emitter.emit('did-create-minimap', minimap);
          return minimapElement.attach();
        };
      })(this)));
    };

    return Main;

  })();

  module.exports = new Main();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRJQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLFdBQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixDQUFBOztBQUFBLEVBRUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDRCQUFSLENBRm5CLENBQUE7O0FBQUEsRUFJQSxRQUE4RSxFQUE5RSxFQUFDLGtCQUFELEVBQVUseUJBQVYsRUFBMEIsd0NBQTFCLEVBQXlELG9CQUF6RCxFQUFvRSxpQkFKcEUsQ0FBQTs7QUFBQSxFQXFCTTtBQUNKLElBQUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsSUFBN0IsQ0FBQSxDQUFBOztBQUVBO0FBQUEsZ0JBRkE7O0FBQUEsbUJBS0EsTUFBQSxHQUNFO0FBQUEsTUFBQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxVQUFBLEVBQVksRUFEWjtPQURGO0FBQUEsTUFHQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQUpGO0FBQUEsTUFNQSxvQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FQRjtBQUFBLE1BU0EscUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEseURBRmI7T0FWRjtBQUFBLE1BYUEsc0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FB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

//# sourceURL=/Users/Kamilius/.atom/packages/minimap/lib/main.coffee
