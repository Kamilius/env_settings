(function() {
  var AncestorsMethods, CanvasDrawer, CompositeDisposable, DOMStylesReader, Disposable, EventsDelegation, MinimapElement, MinimapQuickSettingsElement, debounce, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  debounce = require('underscore-plus').debounce;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  _ref1 = require('atom-utils'), EventsDelegation = _ref1.EventsDelegation, AncestorsMethods = _ref1.AncestorsMethods;

  DOMStylesReader = require('./mixins/dom-styles-reader');

  CanvasDrawer = require('./mixins/canvas-drawer');

  MinimapQuickSettingsElement = null;

  MinimapElement = (function(_super) {
    __extends(MinimapElement, _super);

    function MinimapElement() {
      this.relayMousewheelEvent = __bind(this.relayMousewheelEvent, this);
      return MinimapElement.__super__.constructor.apply(this, arguments);
    }

    DOMStylesReader.includeInto(MinimapElement);

    CanvasDrawer.includeInto(MinimapElement);

    EventsDelegation.includeInto(MinimapElement);

    AncestorsMethods.includeInto(MinimapElement);


    /* Public */

    MinimapElement.prototype.displayMinimapOnLeft = false;

    MinimapElement.prototype.createdCallback = function() {
      this.subscriptions = new CompositeDisposable;
      this.initializeContent();
      return this.observeConfig({
        'minimap.displayMinimapOnLeft': (function(_this) {
          return function(displayMinimapOnLeft) {
            var swapPosition;
            swapPosition = (_this.minimap != null) && displayMinimapOnLeft !== _this.displayMinimapOnLeft;
            _this.displayMinimapOnLeft = displayMinimapOnLeft;
            return _this.updateMinimapFlexPosition();
          };
        })(this),
        'minimap.minimapScrollIndicator': (function(_this) {
          return function(minimapScrollIndicator) {
            _this.minimapScrollIndicator = minimapScrollIndicator;
            if (_this.minimapScrollIndicator && (_this.scrollIndicator == null)) {
              _this.initializeScrollIndicator();
            } else if (_this.scrollIndicator != null) {
              _this.disposeScrollIndicator();
            }
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'minimap.displayPluginsControls': (function(_this) {
          return function(displayPluginsControls) {
            _this.displayPluginsControls = displayPluginsControls;
            if (_this.displayPluginsControls && (_this.openQuickSettings == null)) {
              return _this.initializeOpenQuickSettings();
            } else if (_this.openQuickSettings != null) {
              return _this.disposeOpenQuickSettings();
            }
          };
        })(this),
        'minimap.textOpacity': (function(_this) {
          return function(textOpacity) {
            _this.textOpacity = textOpacity;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.displayCodeHighlights': (function(_this) {
          return function(displayCodeHighlights) {
            _this.displayCodeHighlights = displayCodeHighlights;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.adjustMinimapWidthToSoftWrap': (function(_this) {
          return function(adjustToSoftWrap) {
            _this.adjustToSoftWrap = adjustToSoftWrap;
            if (_this.attached) {
              return _this.measureHeightAndWidth();
            }
          };
        })(this),
        'minimap.useHardwareAcceleration': (function(_this) {
          return function(useHardwareAcceleration) {
            _this.useHardwareAcceleration = useHardwareAcceleration;
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'minimap.absoluteMode': (function(_this) {
          return function(absoluteMode) {
            _this.absoluteMode = absoluteMode;
            return _this.classList.toggle('absolute', _this.absoluteMode);
          };
        })(this),
        'editor.preferredLineLength': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'editor.softWrap': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'editor.softWrapAtPreferredLineLength': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.attachedCallback = function() {
      this.subscriptions.add(atom.views.pollDocument((function(_this) {
        return function() {
          return _this.pollDOM();
        };
      })(this)));
      this.measureHeightAndWidth();
      this.updateMinimapFlexPosition();
      this.attached = true;
      this.attachedToTextEditor = this.parentNode === this.getTextEditorElementRoot();
      return this.subscriptions.add(atom.styles.onDidAddStyleElement((function(_this) {
        return function() {
          _this.invalidateCache();
          return _this.requestForcedUpdate();
        };
      })(this)));
    };

    MinimapElement.prototype.detachedCallback = function() {
      return this.attached = false;
    };

    MinimapElement.prototype.isVisible = function() {
      return this.offsetWidth > 0 || this.offsetHeight > 0;
    };

    MinimapElement.prototype.attach = function(parent) {
      if (this.attached) {
        return;
      }
      return (parent != null ? parent : this.getTextEditorElementRoot()).appendChild(this);
    };

    MinimapElement.prototype.detach = function() {
      if (!this.attached) {
        return;
      }
      if (this.parentNode == null) {
        return;
      }
      return this.parentNode.removeChild(this);
    };

    MinimapElement.prototype.updateMinimapFlexPosition = function() {
      return this.classList.toggle('left', this.displayMinimapOnLeft);
    };

    MinimapElement.prototype.destroy = function() {
      this.subscriptions.dispose();
      this.detach();
      return this.minimap = null;
    };

    MinimapElement.prototype.initializeContent = function() {
      var canvasMousedown, elementMousewheel, visibleAreaMousedown;
      this.initializeCanvas();
      this.shadowRoot = this.createShadowRoot();
      this.shadowRoot.appendChild(this.canvas);
      this.visibleArea = document.createElement('div');
      this.visibleArea.classList.add('minimap-visible-area');
      this.shadowRoot.appendChild(this.visibleArea);
      this.controls = document.createElement('div');
      this.controls.classList.add('minimap-controls');
      this.shadowRoot.appendChild(this.controls);
      elementMousewheel = (function(_this) {
        return function(e) {
          return _this.relayMousewheelEvent(e);
        };
      })(this);
      canvasMousedown = (function(_this) {
        return function(e) {
          return _this.mousePressedOverCanvas(e);
        };
      })(this);
      visibleAreaMousedown = (function(_this) {
        return function(e) {
          return _this.startDrag(e);
        };
      })(this);
      this.addEventListener('mousewheel', elementMousewheel);
      this.canvas.addEventListener('mousedown', canvasMousedown);
      this.visibleArea.addEventListener('mousedown', visibleAreaMousedown);
      this.visibleArea.addEventListener('touchstart', visibleAreaMousedown);
      return this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          _this.removeEventListener('mousewheel', elementMousewheel);
          _this.canvas.removeEventListener('mousedown', canvasMousedown);
          _this.visibleArea.removeEventListener('mousedown', visibleAreaMousedown);
          return _this.visibleArea.removeEventListener('touchstart', visibleAreaMousedown);
        };
      })(this)));
    };

    MinimapElement.prototype.initializeScrollIndicator = function() {
      this.scrollIndicator = document.createElement('div');
      this.scrollIndicator.classList.add('minimap-scroll-indicator');
      return this.controls.appendChild(this.scrollIndicator);
    };

    MinimapElement.prototype.disposeScrollIndicator = function() {
      this.controls.removeChild(this.scrollIndicator);
      return this.scrollIndicator = void 0;
    };

    MinimapElement.prototype.initializeOpenQuickSettings = function() {
      if (this.openQuickSettings != null) {
        return;
      }
      this.openQuickSettings = document.createElement('div');
      this.openQuickSettings.classList.add('open-minimap-quick-settings');
      this.controls.appendChild(this.openQuickSettings);
      return this.openQuickSettingSubscription = this.subscribeTo(this.openQuickSettings, {
        'mousedown': (function(_this) {
          return function(e) {
            var left, right, top, _ref2;
            e.preventDefault();
            e.stopPropagation();
            if (_this.quickSettingsElement != null) {
              _this.quickSettingsElement.destroy();
              return _this.quickSettingsSubscription.dispose();
            } else {
              if (MinimapQuickSettingsElement == null) {
                MinimapQuickSettingsElement = require('./minimap-quick-settings-element');
              }
              _this.quickSettingsElement = new MinimapQuickSettingsElement;
              _this.quickSettingsElement.setModel(_this);
              _this.quickSettingsSubscription = _this.quickSettingsElement.onDidDestroy(function() {
                return _this.quickSettingsElement = null;
              });
              _ref2 = _this.canvas.getBoundingClientRect(), top = _ref2.top, left = _ref2.left, right = _ref2.right;
              _this.quickSettingsElement.style.top = top + 'px';
              _this.quickSettingsElement.attach();
              if (_this.displayMinimapOnLeft) {
                return _this.quickSettingsElement.style.left = right + 'px';
              } else {
                return _this.quickSettingsElement.style.left = (left - _this.quickSettingsElement.clientWidth) + 'px';
              }
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.disposeOpenQuickSettings = function() {
      if (this.openQuickSettings == null) {
        return;
      }
      this.controls.removeChild(this.openQuickSettings);
      this.openQuickSettingSubscription.dispose();
      return this.openQuickSettings = void 0;
    };

    MinimapElement.prototype.getTextEditor = function() {
      return this.minimap.getTextEditor();
    };

    MinimapElement.prototype.getTextEditorElement = function() {
      return this.editorElement != null ? this.editorElement : this.editorElement = atom.views.getView(this.getTextEditor());
    };

    MinimapElement.prototype.getTextEditorElementRoot = function() {
      var editorElement, _ref2;
      editorElement = this.getTextEditorElement();
      return (_ref2 = editorElement.shadowRoot) != null ? _ref2 : editorElement;
    };

    MinimapElement.prototype.getDummyDOMRoot = function(shadowRoot) {
      if (shadowRoot) {
        return this.getTextEditorElementRoot();
      } else {
        return this.getTextEditorElement();
      }
    };

    MinimapElement.prototype.getModel = function() {
      return this.minimap;
    };

    MinimapElement.prototype.setModel = function(minimap) {
      this.minimap = minimap;
      this.subscriptions.add(this.minimap.onDidChangeScrollTop((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeScrollLeft((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeConfig((function(_this) {
        return function() {
          if (_this.attached) {
            return _this.requestForcedUpdate();
          }
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeStandAlone((function(_this) {
        return function() {
          if (_this.minimap.isStandAlone()) {
            _this.setAttribute('stand-alone', true);
          } else {
            _this.removeAttribute('stand-alone');
          }
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChange((function(_this) {
        return function(change) {
          _this.pendingChanges.push(change);
          return _this.requestUpdate();
        };
      })(this)));
      if (this.minimap.isStandAlone()) {
        this.setAttribute('stand-alone', true);
      }
      if ((this.width != null) && (this.height != null)) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }
      return this.minimap;
    };

    MinimapElement.prototype.requestUpdate = function() {
      if (this.frameRequested) {
        return;
      }
      this.frameRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.update();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapElement.prototype.requestForcedUpdate = function() {
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      return this.requestUpdate();
    };

    MinimapElement.prototype.update = function() {
      var canvasTop, canvasTransform, indicatorHeight, indicatorScroll, minimapScreenHeight, visibleAreaLeft, visibleAreaTop, visibleWidth;
      if (!(this.attached && this.isVisible() && (this.minimap != null))) {
        return;
      }
      if (this.adjustToSoftWrap && (this.marginRight != null)) {
        this.style.marginRight = this.marginRight + 'px';
      } else {
        this.style.marginRight = null;
      }
      visibleAreaLeft = this.minimap.getTextEditorScaledScrollLeft();
      visibleAreaTop = this.minimap.getTextEditorScaledScrollTop() - this.minimap.getScrollTop();
      visibleWidth = Math.min(this.canvas.width / devicePixelRatio, this.width);
      this.applyStyles(this.visibleArea, {
        width: visibleWidth + 'px',
        height: this.minimap.getTextEditorScaledHeight() + 'px',
        transform: this.makeTranslate(visibleAreaLeft, visibleAreaTop)
      });
      this.applyStyles(this.controls, {
        width: visibleWidth + 'px'
      });
      canvasTop = this.minimap.getFirstVisibleScreenRow() * this.minimap.getLineHeight() - this.minimap.getScrollTop();
      canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += " " + this.makeScale(1 / devicePixelRatio);
      }
      this.applyStyles(this.canvas, {
        transform: canvasTransform
      });
      if (this.minimapScrollIndicator && this.minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }
      if (this.scrollIndicator != null) {
        minimapScreenHeight = this.minimap.getScreenHeight();
        indicatorHeight = minimapScreenHeight * (minimapScreenHeight / this.minimap.getHeight());
        indicatorScroll = (minimapScreenHeight - indicatorHeight) * this.minimap.getCapedTextEditorScrollRatio();
        this.applyStyles(this.scrollIndicator, {
          height: indicatorHeight + 'px',
          transform: this.makeTranslate(0, indicatorScroll)
        });
        if (!this.minimap.canScroll()) {
          this.disposeScrollIndicator();
        }
      }
      return this.updateCanvas();
    };

    MinimapElement.prototype.setDisplayCodeHighlights = function(displayCodeHighlights) {
      this.displayCodeHighlights = displayCodeHighlights;
      if (this.attached) {
        return this.requestForcedUpdate();
      }
    };

    MinimapElement.prototype.pollDOM = function() {
      var visibilityChanged;
      visibilityChanged = this.checkForVisibilityChange();
      if (this.isVisible()) {
        if (!this.wasVisible) {
          this.requestForcedUpdate();
        }
        return this.measureHeightAndWidth(visibilityChanged, false);
      }
    };

    MinimapElement.prototype.checkForVisibilityChange = function() {
      if (this.isVisible()) {
        if (this.wasVisible) {
          return false;
        } else {
          return this.wasVisible = true;
        }
      } else {
        if (this.wasVisible) {
          this.wasVisible = false;
          return true;
        } else {
          return this.wasVisible = false;
        }
      }
    };

    MinimapElement.prototype.measureHeightAndWidth = function(visibilityChanged, forceUpdate) {
      var canvasWidth, lineLength, softWrap, softWrapAtPreferredLineLength, wasResized, width;
      if (forceUpdate == null) {
        forceUpdate = true;
      }
      if (this.minimap == null) {
        return;
      }
      wasResized = this.width !== this.clientWidth || this.height !== this.clientHeight;
      this.height = this.clientHeight;
      this.width = this.clientWidth;
      canvasWidth = this.width;
      if (this.minimap != null) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }
      if (wasResized || visibilityChanged || forceUpdate) {
        this.requestForcedUpdate();
      }
      if (!this.isVisible()) {
        return;
      }
      if (wasResized || forceUpdate) {
        if (this.adjustToSoftWrap) {
          lineLength = atom.config.get('editor.preferredLineLength');
          softWrap = atom.config.get('editor.softWrap');
          softWrapAtPreferredLineLength = atom.config.get('editor.softWrapAtPreferredLineLength');
          width = lineLength * this.minimap.getCharWidth();
          if (softWrap && softWrapAtPreferredLineLength && lineLength && width < this.width) {
            this.marginRight = width - this.width;
            canvasWidth = width;
          } else {
            this.marginRight = null;
          }
        } else {
          delete this.marginRight;
        }
        if (canvasWidth !== this.canvas.width || this.height !== this.canvas.height) {
          this.canvas.width = canvasWidth * devicePixelRatio;
          return this.canvas.height = (this.height + this.minimap.getLineHeight()) * devicePixelRatio;
        }
      }
    };

    MinimapElement.prototype.observeConfig = function(configs) {
      var callback, config, _results;
      if (configs == null) {
        configs = {};
      }
      _results = [];
      for (config in configs) {
        callback = configs[config];
        _results.push(this.subscriptions.add(atom.config.observe(config, callback)));
      }
      return _results;
    };

    MinimapElement.prototype.mousePressedOverCanvas = function(e) {
      var height, top, _ref2;
      if (this.minimap.isStandAlone()) {
        return;
      }
      if (e.which === 1) {
        return this.leftMousePressedOverCanvas(e);
      } else if (e.which === 2) {
        this.middleMousePressedOverCanvas(e);
        _ref2 = this.visibleArea.getBoundingClientRect(), top = _ref2.top, height = _ref2.height;
        return this.startDrag({
          which: 2,
          pageY: top + height / 2
        });
      } else {

      }
    };

    MinimapElement.prototype.leftMousePressedOverCanvas = function(_arg) {
      var duration, from, pageY, row, scrollTop, step, target, textEditor, to, y;
      pageY = _arg.pageY, target = _arg.target;
      y = pageY - target.getBoundingClientRect().top;
      row = Math.floor(y / this.minimap.getLineHeight()) + this.minimap.getFirstVisibleScreenRow();
      textEditor = this.minimap.getTextEditor();
      scrollTop = row * textEditor.getLineHeightInPixels() - this.minimap.getTextEditorHeight() / 2;
      if (atom.config.get('minimap.scrollAnimation')) {
        from = this.minimap.getTextEditorScrollTop();
        to = scrollTop;
        step = (function(_this) {
          return function(now) {
            return _this.minimap.setTextEditorScrollTop(now);
          };
        })(this);
        duration = atom.config.get('minimap.scrollAnimationDuration');
        return this.animate({
          from: from,
          to: to,
          duration: duration,
          step: step
        });
      } else {
        return this.minimap.setTextEditorScrollTop(scrollTop);
      }
    };

    MinimapElement.prototype.middleMousePressedOverCanvas = function(_arg) {
      var offsetTop, pageY, ratio, y;
      pageY = _arg.pageY;
      offsetTop = this.getBoundingClientRect().top;
      y = pageY - offsetTop - this.minimap.getTextEditorScaledHeight() / 2;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.relayMousewheelEvent = function(e) {
      var editorElement;
      editorElement = atom.views.getView(this.minimap.textEditor);
      return editorElement.component.onMouseWheel(e);
    };

    MinimapElement.prototype.startDrag = function(e) {
      var dragOffset, initial, mousemoveHandler, mouseupHandler, offsetTop, pageY, top, which;
      which = e.which, pageY = e.pageY;
      if (!this.minimap) {
        return;
      }
      if (which !== 1 && which !== 2 && (e.touches == null)) {
        return;
      }
      top = this.visibleArea.getBoundingClientRect().top;
      offsetTop = this.getBoundingClientRect().top;
      dragOffset = pageY - top;
      initial = {
        dragOffset: dragOffset,
        offsetTop: offsetTop
      };
      mousemoveHandler = (function(_this) {
        return function(e) {
          return _this.drag(e, initial);
        };
      })(this);
      mouseupHandler = (function(_this) {
        return function(e) {
          return _this.endDrag(e, initial);
        };
      })(this);
      document.body.addEventListener('mousemove', mousemoveHandler);
      document.body.addEventListener('mouseup', mouseupHandler);
      document.body.addEventListener('mouseleave', mouseupHandler);
      document.body.addEventListener('touchmove', mousemoveHandler);
      document.body.addEventListener('touchend', mouseupHandler);
      return this.dragSubscription = new Disposable(function() {
        document.body.removeEventListener('mousemove', mousemoveHandler);
        document.body.removeEventListener('mouseup', mouseupHandler);
        document.body.removeEventListener('mouseleave', mouseupHandler);
        document.body.removeEventListener('touchmove', mousemoveHandler);
        return document.body.removeEventListener('touchend', mouseupHandler);
      });
    };

    MinimapElement.prototype.drag = function(e, initial) {
      var ratio, y;
      if (!this.minimap) {
        return;
      }
      if (e.which !== 1 && e.which !== 2 && (e.touches == null)) {
        return;
      }
      y = e.pageY - initial.offsetTop - initial.dragOffset;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.setTextEditorScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.endDrag = function(e, initial) {
      if (!this.minimap) {
        return;
      }
      return this.dragSubscription.dispose();
    };

    MinimapElement.prototype.applyStyles = function(element, styles) {
      var cssText, property, value;
      cssText = '';
      for (property in styles) {
        value = styles[property];
        cssText += "" + property + ": " + value + "; ";
      }
      return element.style.cssText = cssText;
    };

    MinimapElement.prototype.makeTranslate = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (this.useHardwareAcceleration) {
        return "translate3d(" + x + "px, " + y + "px, 0)";
      } else {
        return "translate(" + x + "px, " + y + "px)";
      }
    };

    MinimapElement.prototype.makeScale = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = x;
      }
      if (this.useHardwareAcceleration) {
        return "scale3d(" + x + ", " + y + ", 1)";
      } else {
        return "scale(" + x + ", " + y + ")";
      }
    };

    MinimapElement.prototype.getTime = function() {
      return new Date();
    };

    MinimapElement.prototype.animate = function(_arg) {
      var duration, from, start, step, swing, to, update;
      from = _arg.from, to = _arg.to, duration = _arg.duration, step = _arg.step;
      start = this.getTime();
      swing = function(progress) {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      };
      update = (function(_this) {
        return function() {
          var delta, passed, progress;
          passed = _this.getTime() - start;
          if (duration === 0) {
            progress = 1;
          } else {
            progress = passed / duration;
          }
          if (progress > 1) {
            progress = 1;
          }
          delta = swing(progress);
          step(from + (to - from) * delta);
          if (progress < 1) {
            return requestAnimationFrame(update);
          }
        };
      })(this);
      return update();
    };

    return MinimapElement;

  })(HTMLElement);

  module.exports = MinimapElement = document.registerElement('atom-text-editor-minimap', {
    prototype: MinimapElement.prototype
  });

  MinimapElement.registerViewProvider = function() {
    return atom.views.addViewProvider(require('./minimap'), function(model) {
      var element;
      element = new MinimapElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAtZWxlbWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0tBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxXQUFZLE9BQUEsQ0FBUSxpQkFBUixFQUFaLFFBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0Isa0JBQUEsVUFEdEIsQ0FBQTs7QUFBQSxFQUVBLFFBQXVDLE9BQUEsQ0FBUSxZQUFSLENBQXZDLEVBQUMseUJBQUEsZ0JBQUQsRUFBbUIseUJBQUEsZ0JBRm5CLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSw0QkFBUixDQUhsQixDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSx3QkFBUixDQUpmLENBQUE7O0FBQUEsRUFNQSwyQkFBQSxHQUE4QixJQU45QixDQUFBOztBQUFBLEVBb0JNO0FBQ0oscUNBQUEsQ0FBQTs7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQWUsQ0FBQyxXQUFoQixDQUE0QixjQUE1QixDQUFBLENBQUE7O0FBQUEsSUFDQSxZQUFZLENBQUMsV0FBYixDQUF5QixjQUF6QixDQURBLENBQUE7O0FBQUEsSUFFQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixjQUE3QixDQUZBLENBQUE7O0FBQUEsSUFHQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixjQUE3QixDQUhBLENBQUE7O0FBS0E7QUFBQSxnQkFMQTs7QUFBQSw2QkFPQSxvQkFBQSxHQUFzQixLQVB0QixDQUFBOztBQUFBLDZCQWtCQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxD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

//# sourceURL=/Users/Kamilius/.atom/packages/minimap/lib/minimap-element.coffee
