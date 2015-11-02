(function() {
  var AncestorsMethods, CanvasDrawer, CompositeDisposable, DOMStylesReader, Disposable, EventsDelegation, MinimapElement, MinimapQuickSettingsElement, debounce, registerOrUpdateElement, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  debounce = require('underscore-plus').debounce;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  _ref1 = require('atom-utils'), registerOrUpdateElement = _ref1.registerOrUpdateElement, EventsDelegation = _ref1.EventsDelegation, AncestorsMethods = _ref1.AncestorsMethods;

  DOMStylesReader = require('./mixins/dom-styles-reader');

  CanvasDrawer = require('./mixins/canvas-drawer');

  MinimapQuickSettingsElement = null;

  MinimapElement = (function() {
    function MinimapElement() {
      this.relayMousewheelEvent = __bind(this.relayMousewheelEvent, this);
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
            if (_this.minimapScrollIndicator && (_this.scrollIndicator == null) && !_this.standAlone) {
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
            if (_this.displayPluginsControls && (_this.openQuickSettings == null) && !_this.standAlone) {
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
              return _this.measureHeightAndWidth();
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
      this.initializeCanvas();
      this.shadowRoot = this.createShadowRoot();
      this.shadowRoot.appendChild(this.canvas);
      this.createVisibleArea();
      this.createControls();
      this.subscriptions.add(this.subscribeTo(this, {
        'mousewheel': (function(_this) {
          return function(e) {
            if (!_this.standAlone) {
              return _this.relayMousewheelEvent(e);
            }
          };
        })(this)
      }));
      return this.subscriptions.add(this.subscribeTo(this.canvas, {
        'mousedown': (function(_this) {
          return function(e) {
            return _this.mousePressedOverCanvas(e);
          };
        })(this)
      }));
    };

    MinimapElement.prototype.createVisibleArea = function() {
      if (this.visibleArea != null) {
        return;
      }
      this.visibleArea = document.createElement('div');
      this.visibleArea.classList.add('minimap-visible-area');
      this.shadowRoot.appendChild(this.visibleArea);
      this.visibleAreaSubscription = this.subscribeTo(this.visibleArea, {
        'mousedown': (function(_this) {
          return function(e) {
            return _this.startDrag(e);
          };
        })(this),
        'touchstart': (function(_this) {
          return function(e) {
            return _this.startDrag(e);
          };
        })(this)
      });
      return this.subscriptions.add(this.visibleAreaSubscription);
    };

    MinimapElement.prototype.removeVisibleArea = function() {
      if (this.visibleArea == null) {
        return;
      }
      this.subscriptions.remove(this.visibleAreaSubscription);
      this.visibleAreaSubscription.dispose();
      this.shadowRoot.removeChild(this.visibleArea);
      return delete this.visibleArea;
    };

    MinimapElement.prototype.createControls = function() {
      if ((this.controls != null) || this.standAlone) {
        return;
      }
      this.controls = document.createElement('div');
      this.controls.classList.add('minimap-controls');
      return this.shadowRoot.appendChild(this.controls);
    };

    MinimapElement.prototype.removeControls = function() {
      if (this.controls == null) {
        return;
      }
      this.shadowRoot.removeChild(this.controls);
      return delete this.controls;
    };

    MinimapElement.prototype.initializeScrollIndicator = function() {
      if ((this.scrollIndicator != null) || this.standAlone) {
        return;
      }
      this.scrollIndicator = document.createElement('div');
      this.scrollIndicator.classList.add('minimap-scroll-indicator');
      return this.controls.appendChild(this.scrollIndicator);
    };

    MinimapElement.prototype.disposeScrollIndicator = function() {
      if (this.scrollIndicator == null) {
        return;
      }
      this.controls.removeChild(this.scrollIndicator);
      return delete this.scrollIndicator;
    };

    MinimapElement.prototype.initializeOpenQuickSettings = function() {
      if ((this.openQuickSettings != null) || this.standAlone) {
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
          _this.setStandAlone(_this.minimap.isStandAlone());
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChange((function(_this) {
        return function(change) {
          _this.pendingChanges.push(change);
          return _this.requestUpdate();
        };
      })(this)));
      this.setStandAlone(this.minimap.isStandAlone());
      if ((this.width != null) && (this.height != null)) {
        this.minimap.setScreenHeightAndWidth(this.height, this.width);
      }
      return this.minimap;
    };

    MinimapElement.prototype.setStandAlone = function(standAlone) {
      this.standAlone = standAlone;
      if (this.standAlone) {
        this.setAttribute('stand-alone', true);
        this.disposeScrollIndicator();
        this.disposeOpenQuickSettings();
        this.removeControls();
        return this.removeVisibleArea();
      } else {
        this.removeAttribute('stand-alone');
        this.createVisibleArea();
        this.createControls();
        if (this.minimapScrollIndicator) {
          this.initializeScrollIndicator();
        }
        if (this.displayPluginsControls) {
          return this.initializeOpenQuickSettings();
        }
      }
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
      visibleAreaLeft = this.minimap.getTextEditorScaledScrollLeft();
      visibleAreaTop = this.minimap.getTextEditorScaledScrollTop() - this.minimap.getScrollTop();
      visibleWidth = Math.min(this.canvas.width / devicePixelRatio, this.width);
      if (this.adjustToSoftWrap && this.flexBasis) {
        this.style.flexBasis = this.flexBasis + 'px';
      } else {
        this.style.flexBasis = null;
      }
      if (atom.inSpecMode()) {
        this.applyStyles(this.visibleArea, {
          width: visibleWidth + 'px',
          height: this.minimap.getTextEditorScaledHeight() + 'px',
          top: visibleAreaTop + 'px',
          left: visibleAreaLeft + 'px'
        });
      } else {
        this.applyStyles(this.visibleArea, {
          width: visibleWidth + 'px',
          height: this.minimap.getTextEditorScaledHeight() + 'px',
          transform: this.makeTranslate(visibleAreaLeft, visibleAreaTop)
        });
      }
      this.applyStyles(this.controls, {
        width: visibleWidth + 'px'
      });
      canvasTop = this.minimap.getFirstVisibleScreenRow() * this.minimap.getLineHeight() - this.minimap.getScrollTop();
      canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += " " + this.makeScale(1 / devicePixelRatio);
      }
      if (atom.inSpecMode()) {
        this.applyStyles(this.canvas, {
          top: canvasTop + 'px'
        });
      } else {
        this.applyStyles(this.canvas, {
          transform: canvasTransform
        });
      }
      if (this.minimapScrollIndicator && this.minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }
      if (this.scrollIndicator != null) {
        minimapScreenHeight = this.minimap.getScreenHeight();
        indicatorHeight = minimapScreenHeight * (minimapScreenHeight / this.minimap.getHeight());
        indicatorScroll = (minimapScreenHeight - indicatorHeight) * this.minimap.getCapedTextEditorScrollRatio();
        if (atom.inSpecMode()) {
          this.applyStyles(this.scrollIndicator, {
            height: indicatorHeight + 'px',
            top: indicatorScroll + 'px'
          });
        } else {
          this.applyStyles(this.scrollIndicator, {
            height: indicatorHeight + 'px',
            transform: this.makeTranslate(0, indicatorScroll)
          });
        }
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
          if (softWrap && softWrapAtPreferredLineLength && lineLength && width <= this.width) {
            this.flexBasis = width;
            canvasWidth = width;
          } else {
            delete this.flexBasis;
          }
        } else {
          delete this.flexBasis;
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
      if (element == null) {
        return;
      }
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

  })();

  module.exports = MinimapElement = registerOrUpdateElement('atom-text-editor-minimap', MinimapElement.prototype);

  MinimapElement.registerViewProvider = function() {
    return atom.views.addViewProvider(require('./minimap'), function(model) {
      var element;
      element = new MinimapElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAtZWxlbWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0xBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLFdBQVksT0FBQSxDQUFRLGlCQUFSLEVBQVosUUFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixrQkFBQSxVQUR0QixDQUFBOztBQUFBLEVBRUEsUUFBZ0UsT0FBQSxDQUFRLFlBQVIsQ0FBaEUsRUFBQyxnQ0FBQSx1QkFBRCxFQUEwQix5QkFBQSxnQkFBMUIsRUFBNEMseUJBQUEsZ0JBRjVDLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSw0QkFBUixDQUhsQixDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSx3QkFBUixDQUpmLENBQUE7O0FBQUEsRUFNQSwyQkFBQSxHQUE4QixJQU45QixDQUFBOztBQUFBLEVBb0JNOzs7S0FDSjs7QUFBQSxJQUFBLGVBQWUsQ0FBQyxXQUFoQixDQUE0QixjQUE1QixDQUFBLENBQUE7O0FBQUEsSUFDQSxZQUFZLENBQUMsV0FBYixDQUF5QixjQUF6QixDQURBLENBQUE7O0FBQUEsSUFFQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixjQUE3QixDQUZBLENBQUE7O0FBQUEsSUFHQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixjQUE3QixDQUhBLENBQUE7O0FBS0E7QUFBQSxnQkFMQTs7QUFBQSw2QkFPQSxvQkFBQSxHQUFzQixLQVB0QixDQUFBOztBQUFBLDZCQWtCQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxDQURBLENBQUE7YUFHQSxJQUFDLENBQUEsYUFBRCxDQUNFO0FBQUEsUUFBQSw4QkFBQSxFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsb0JBQUQsR0FBQTtBQUM5QixnQkFBQSxZQUFBO0FBQUEsWUFBQSxZQUFBLEdBQWUsdUJBQUEsSUFBYyxvQkFBQSxLQUEwQixLQUFDLENBQUEsb0JBQXhELENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxvQkFBRCxHQUF3QixvQkFEeEIsQ0FBQTttQkFHQSxLQUFDLENBQUEseUJBQUQsQ0FBQSxFQUo4QjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDO0FBQUEsUUFNQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUUsc0JBQUYsR0FBQTtBQUNoQyxZQURpQyxLQUFDLENBQUEseUJBQUEsc0JBQ2xDLENBQUE7QUFBQSxZQUFBLElBQUcsS0FBQyxDQUFBLHNCQUFELElBQWdDLCtCQUFoQyxJQUFzRCxDQUFBLEtBQUssQ0FBQSxVQUE5RDtBQUNFLGNBQUEsS0FBQyxDQUFBLHlCQUFELENBQUEsQ0FBQSxDQURGO2FBQUEsTUFFSyxJQUFHLDZCQUFIO0FBQ0gsY0FBQSxLQUFDLENBQUEsc0JBQUQsQ0FBQSxDQUFBLENBREc7YUFGTDtBQUtBLFlBQUEsSUFBb0IsS0FBQyxDQUFBLFFBQXJCO3FCQUFBLEtBQUMsQ0FBQSxhQUFELENBQUEsRUFBQTthQU5nQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTmxDO0FBQUEsUUFjQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUUsc0JBQUYsR0FBQTtBQUNoQyxZQURpQyxLQUFDLENBQUEseUJBQUEsc0JBQ2xDLENBQUE7QUFBQSxZQUFBLElBQUcsS0FBQyxDQUFBLHNCQUFELElBQWdDLGlDQUFoQyxJQUF3RCxDQUFBLEtBQUssQ0FBQSxVQUFoRTtxQkFDRSxLQUFDLENBQUEsMkJBQUQsQ0FBQSxFQURGO2FBQUEsTUFFSyxJQUFHLCtCQUFIO3FCQUNILEtBQUMsQ0FBQSx3QkFBRCxDQUFBLEVBREc7YUFIMkI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWRsQztBQUFBLFFBb0JBLHFCQUFBLEVBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBRSxXQUFGLEdBQUE7QUFDckIsWUFEc0IsS0FBQyxDQUFBLGNBQUEsV0FDdkIsQ0FBQTtBQUFBLFlBQUEsSUFBMEIsS0FBQyxDQUFBLFFBQTNCO3FCQUFBLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLEVBQUE7YUFEcUI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXBCdkI7QUFBQSxRQXVCQSwrQkFBQSxFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUUscUJBQUYsR0FBQTtBQUMvQixZQURnQyxLQUFDLENBQUEsd0JBQUEscUJBQ2pDLENBQUE7QUFBQSxZQUFBLElBQTBCLEtBQUMsQ0FBQSxRQUEzQjtxQkFBQSxLQUFDLENBQUEsbUJBQUQsQ0FBQSxFQUFBO2FBRCtCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0F2QmpDO0FBQUEsUUEwQkEsc0NBQUEsRUFBd0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFFLGdCQUFGLEdBQUE7QUFDdEMsWUFEdUMsS0FBQyxDQUFBLG1CQUFBLGdCQUN4QyxDQUFBO0FBQUEsWUFBQSxJQUE0QixLQUFDLENBQUEsUUFBN0I7cUJBQUEsS0FBQyxDQUFBLHFCQUFELENBQUEsRUFBQTthQURzQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBMUJ4QztBQUFBLFFBNkJBLGlDQUFBLEVBQW1DLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBRSx1QkFBRixHQUFBO0FBQ2pDLFlBRGtDLEtBQUMsQ0FBQSwwQkFBQSx1QkFDbkMsQ0FBQTtBQUFBLFlBQUEsSUFBb0IsS0FBQyxDQUFBLFFBQXJCO3FCQUFBLEtBQUMsQ0FBQSxhQUFELENBQUEsRUFBQTthQURpQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBN0JuQztBQUFBLFFBZ0NBLHNCQUFBLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBRSxZQUFGLEdBQUE7QUFDdEIsWUFEdUIsS0FBQyxDQUFBLGVBQUEsWUFDeEIsQ0FBQTttQkFBQSxLQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsVUFBbEIsRUFBOEIsS0FBQyxDQUFBLFlBQS9CLEVBRHNCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FoQ3hCO0FBQUEsUUFtQ0EsNEJBQUEsRUFBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDNUIsWUFBQSxJQUE0QixLQUFDLENBQUEsUUFBN0I7cUJBQUEsS0FBQyxDQUFBLHFCQUFELENBQUEsRUFBQTthQUQ0QjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBbkM5QjtBQUFBLFFBc0NBLGlCQUFBLEVBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQUcsWUFBQSxJQUFvQixLQUFDLENBQUEsUUFBckI7cUJBQUEsS0FBQyxDQUFBLGFBQUQsQ0FBQSxFQUFBO2FBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXRDbkI7QUFBQSxRQXdDQSxzQ0FBQSxFQUF3QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUFHLFlBQUEsSUFBb0IsS0FBQyxDQUFBLFFBQXJCO3FCQUFBLEtBQUMsQ0FBQSxhQUFELENBQUEsRUFBQTthQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0F4Q3hDO09BREYsRUFKZTtJQUFBLENBbEJqQixDQUFBOztBQUFBLDZCQW9FQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7QUFDaEIsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFYLENBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsQ0FBbkIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEscUJBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSx5QkFBRCxDQUFBLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUhaLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixJQUFDLENBQUEsVUFBRCxLQUFlLElBQUMsQ0FBQSx3QkFBRCxDQUFBLENBSnZDLENBQUE7YUFXQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBWixDQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2xELFVBQUEsS0FBQyxDQUFBLGVBQUQsQ0FBQSxDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLG1CQUFELENBQUEsRUFGa0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxDQUFuQixFQVpnQjtJQUFBLENBcEVsQixDQUFBOztBQUFBLDZCQXNGQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7YUFDaEIsSUFBQyxDQUFBLFFBQUQsR0FBWSxNQURJO0lBQUEsQ0F0RmxCLENBQUE7O0FBQUEsNkJBb0dBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsV0FBRCxHQUFlLENBQWYsSUFBb0IsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsRUFBdkM7SUFBQSxDQXBHWCxDQUFBOztBQUFBLDZCQTBHQSxNQUFBLEdBQVEsU0FBQyxNQUFELEdBQUE7QUFDTixNQUFBLElBQVUsSUFBQyxDQUFBLFFBQVg7QUFBQSxjQUFBLENBQUE7T0FBQTthQUNBLGtCQUFDLFNBQVMsSUFBQyxDQUFBLHdCQUFELENBQUEsQ0FBVixDQUFzQyxDQUFDLFdBQXZDLENBQW1ELElBQW5ELEVBRk07SUFBQSxDQTFHUixDQUFBOztBQUFBLDZCQStHQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLFFBQWY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBYyx1QkFBZDtBQUFBLGNBQUEsQ0FBQTtPQURBO2FBRUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxXQUFaLENBQXdCLElBQXhCLEVBSE07SUFBQSxDQS9HUixDQUFBOztBQUFBLDZCQXNIQSx5QkFBQSxHQUEyQixTQUFBLEdBQUE7YUFDekIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLE1BQWxCLEVBQTBCLElBQUMsQ0FBQSxvQkFBM0IsRUFEeUI7SUFBQSxDQXRIM0IsQ0FBQTs7QUFBQSw2QkEwSEEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FISjtJQUFBLENBMUhULENBQUE7O0FBQUEsNkJBeUlBLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTtBQUNqQixNQUFBLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUZkLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixJQUFDLENBQUEsTUFBekIsQ0FKQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxDQU5BLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FQQSxDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFiLEVBQ2pCO0FBQUEsUUFBQSxZQUFBLEVBQWMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLENBQUQsR0FBQTtBQUFPLFlBQUEsSUFBQSxDQUFBLEtBQWlDLENBQUEsVUFBakM7cUJBQUEsS0FBQyxDQUFBLG9CQUFELENBQXNCLENBQXRCLEVBQUE7YUFBUDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQ7T0FEaUIsQ0FBbkIsQ0FUQSxDQUFBO2FBWUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLE1BQWQsRUFDakI7QUFBQSxRQUFBLFdBQUEsRUFBYSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsQ0FBRCxHQUFBO21CQUFPLEtBQUMsQ0FBQSxzQkFBRCxDQUF3QixDQUF4QixFQUFQO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBYjtPQURpQixDQUFuQixFQWJpQjtJQUFBLENBekluQixDQUFBOztBQUFBLDZCQTBKQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsTUFBQSxJQUFVLHdCQUFWO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFELEdBQWUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FGZixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUF2QixDQUEyQixzQkFBM0IsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBd0IsSUFBQyxDQUFBLFdBQXpCLENBSkEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLHVCQUFELEdBQTJCLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLFdBQWQsRUFDekI7QUFBQSxRQUFBLFdBQUEsRUFBYSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsQ0FBRCxHQUFBO21CQUFPLEtBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWCxFQUFQO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBYjtBQUFBLFFBQ0EsWUFBQSxFQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxDQUFELEdBQUE7bUJBQU8sS0FBQyxDQUFBLFNBQUQsQ0FBVyxDQUFYLEVBQVA7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURkO09BRHlCLENBTjNCLENBQUE7YUFVQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLHVCQUFwQixFQVhpQjtJQUFBLENBMUpuQixDQUFBOztBQUFBLDZCQXdLQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsTUFBQSxJQUFjLHdCQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBZixDQUFzQixJQUFDLENBQUEsdUJBQXZCLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLHVCQUF1QixDQUFDLE9BQXpCLENBQUEsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBd0IsSUFBQyxDQUFBLFdBQXpCLENBSkEsQ0FBQTthQUtBLE1BQUEsQ0FBQSxJQUFRLENBQUEsWUFOUztJQUFBLENBeEtuQixDQUFBOztBQUFBLDZCQWlMQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLE1BQUEsSUFBVSx1QkFBQSxJQUFjLElBQUMsQ0FBQSxVQUF6QjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRlosQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBcEIsQ0FBd0Isa0JBQXhCLENBSEEsQ0FBQTthQUlBLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixJQUFDLENBQUEsUUFBekIsRUFMYztJQUFBLENBakxoQixDQUFBOztBQUFBLDZCQXdMQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLE1BQUEsSUFBYyxxQkFBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBd0IsSUFBQyxDQUFBLFFBQXpCLENBRkEsQ0FBQTthQUdBLE1BQUEsQ0FBQSxJQUFRLENBQUEsU0FKTTtJQUFBLENBeExoQixDQUFBOztBQUFBLDZCQWdNQSx5QkFBQSxHQUEyQixTQUFBLEdBQUE7QUFDekIsTUFBQSxJQUFVLDhCQUFBLElBQXFCLElBQUMsQ0FBQSxVQUFoQztBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsZUFBRCxHQUFtQixRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUZuQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUEzQixDQUErQiwwQkFBL0IsQ0FIQSxDQUFBO2FBSUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLENBQXNCLElBQUMsQ0FBQSxlQUF2QixFQUx5QjtJQUFBLENBaE0zQixDQUFBOztBQUFBLDZCQXlNQSxzQkFBQSxHQUF3QixTQUFBLEdBQUE7QUFDdEIsTUFBQSxJQUFjLDRCQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixDQUFzQixJQUFDLENBQUEsZUFBdkIsQ0FGQSxDQUFBO2FBR0EsTUFBQSxDQUFBLElBQVEsQ0FBQSxnQkFKYztJQUFBLENBek14QixDQUFBOztBQUFBLDZCQWlOQSwyQkFBQSxHQUE2QixTQUFBLEdBQUE7QUFDM0IsTUFBQSxJQUFVLGdDQUFBLElBQXVCLElBQUMsQ0FBQSxVQUFsQztBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FGckIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUE3QixDQUFpQyw2QkFBakMsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsUUFBUSxDQUFDLFdBQVYsQ0FBc0IsSUFBQyxDQUFBLGlCQUF2QixDQUpBLENBQUE7YUFLQSxJQUFDLENBQUEsNEJBQUQsR0FBZ0MsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsaUJBQWQsRUFDOUI7QUFBQSxRQUFBLFdBQUEsRUFBYSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ1gsZ0JBQUEsdUJBQUE7QUFBQSxZQUFBLENBQUMsQ0FBQyxjQUFGLENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFDQSxDQUFDLENBQUMsZUFBRixDQUFBLENBREEsQ0FBQTtBQUdBLFlBQUEsSUFBRyxrQ0FBSDtBQUNFLGNBQUEsS0FBQyxDQUFBLG9CQUFvQixDQUFDLE9BQXRCLENBQUEsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSx5QkFBeUIsQ0FBQyxPQUEzQixDQUFBLEVBRkY7YUFBQSxNQUFBOztnQkFJRSw4QkFBK0IsT0FBQSxDQUFRLGtDQUFSO2VBQS9CO0FBQUEsY0FDQSxLQUFDLENBQUEsb0JBQUQsR0FBd0IsR0FBQSxDQUFBLDJCQUR4QixDQUFBO0FBQUEsY0FFQSxLQUFDLENBQUEsb0JBQW9CLENBQUMsUUFBdEIsQ0FBK0IsS0FBL0IsQ0FGQSxDQUFBO0FBQUEsY0FHQSxLQUFDLENBQUEseUJBQUQsR0FBNkIsS0FBQyxDQUFBLG9CQUFvQixDQUFDLFlBQXRCLENBQW1DLFNBQUEsR0FBQTt1QkFDOUQsS0FBQyxDQUFBLG9CQUFELEdBQXdCLEtBRHNDO2NBQUEsQ0FBbkMsQ0FIN0IsQ0FBQTtBQUFBLGNBTUEsUUFBcUIsS0FBQyxDQUFBLE1BQU0sQ0FBQyxxQkFBUixDQUFBLENBQXJCLEVBQUMsWUFBQSxHQUFELEVBQU0sYUFBQSxJQUFOLEVBQVksY0FBQSxLQU5aLENBQUE7QUFBQSxjQU9BLEtBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsR0FBNUIsR0FBa0MsR0FBQSxHQUFNLElBUHhDLENBQUE7QUFBQSxjQVFBLEtBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxNQUF0QixDQUFBLENBUkEsQ0FBQTtBQVVBLGNBQUEsSUFBRyxLQUFDLENBQUEsb0JBQUo7dUJBQ0UsS0FBQyxDQUFBLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxJQUE1QixHQUFvQyxLQUFELEdBQVUsS0FEL0M7ZUFBQSxNQUFBO3VCQUdFLEtBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsSUFBNUIsR0FBbUMsQ0FBQyxJQUFBLEdBQU8sS0FBQyxDQUFBLG9CQUFvQixDQUFDLFdBQTlCLENBQUEsR0FBNkMsS0FIbEY7ZUFkRjthQUpXO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBYjtPQUQ4QixFQU5MO0lBQUEsQ0FqTjdCLENBQUE7O0FBQUEsNkJBaVBBLHdCQUFBLEdBQTBCLFNBQUEsR0FBQTtBQUN4QixNQUFBLElBQWMsOEJBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLENBQXNCLElBQUMsQ0FBQSxpQkFBdkIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsNEJBQTRCLENBQUMsT0FBOUIsQ0FBQSxDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsT0FKRztJQUFBLENBalAxQixDQUFBOztBQUFBLDZCQTBQQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQUEsRUFBSDtJQUFBLENBMVBmLENBQUE7O0FBQUEsNkJBK1BBLG9CQUFBLEdBQXNCLFNBQUEsR0FBQTswQ0FDcEIsSUFBQyxDQUFBLGdCQUFELElBQUMsQ0FBQSxnQkFBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBbkIsRUFERTtJQUFBLENBL1B0QixDQUFBOztBQUFBLDZCQXVRQSx3QkFBQSxHQUEwQixTQUFBLEdBQUE7QUFDeEIsVUFBQSxvQkFBQTtBQUFBLE1BQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsb0JBQUQsQ0FBQSxDQUFoQixDQUFBO2tFQUUyQixjQUhIO0lBQUEsQ0F2UTFCLENBQUE7O0FBQUEsNkJBZ1JBLGVBQUEsR0FBaUIsU0FBQyxVQUFELEdBQUE7QUFDZixNQUFBLElBQUcsVUFBSDtlQUNFLElBQUMsQ0FBQSx3QkFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLG9CQUFELENBQUEsRUFIRjtPQURlO0lBQUEsQ0FoUmpCLENBQUE7O0FBQUEsNkJBaVNBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsUUFBSjtJQUFBLENBalNWLENBQUE7O0FBQUEsNkJBc1NBLFFBQUEsR0FBVSxTQUFFLE9BQUYsR0FBQTtBQUNSLE1BRFMsSUFBQyxDQUFBLFVBQUEsT0FDVixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxvQkFBVCxDQUE4QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxhQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLENBQW5CLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMscUJBQVQsQ0FBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsYUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQixDQUFuQixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QixDQUFuQixDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLGlCQUFULENBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDNUMsVUFBQSxJQUEwQixLQUFDLENBQUEsUUFBM0I7bUJBQUEsS0FBQyxDQUFBLG1CQUFELENBQUEsRUFBQTtXQUQ0QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLENBQW5CLENBSEEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMscUJBQVQsQ0FBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNoRCxVQUFBLEtBQUMsQ0FBQSxhQUFELENBQWUsS0FBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQUEsQ0FBZixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLGFBQUQsQ0FBQSxFQUZnRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9CLENBQW5CLENBTkEsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7QUFDdEMsVUFBQSxLQUFDLENBQUEsY0FBYyxDQUFDLElBQWhCLENBQXFCLE1BQXJCLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsYUFBRCxDQUFBLEVBRnNDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsQ0FBbkIsQ0FWQSxDQUFBO0FBQUEsTUFjQSxJQUFDLENBQUEsYUFBRCxDQUFlLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFBLENBQWYsQ0FkQSxDQUFBO0FBZ0JBLE1BQUEsSUFBcUQsb0JBQUEsSUFBWSxxQkFBakU7QUFBQSxRQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsdUJBQVQsQ0FBaUMsSUFBQyxDQUFBLE1BQWxDLEVBQTBDLElBQUMsQ0FBQSxLQUEzQyxDQUFBLENBQUE7T0FoQkE7YUFrQkEsSUFBQyxDQUFBLFFBbkJPO0lBQUEsQ0F0U1YsQ0FBQTs7QUFBQSw2QkEyVEEsYUFBQSxHQUFlLFNBQUUsVUFBRixHQUFBO0FBQ2IsTUFEYyxJQUFDLENBQUEsYUFBQSxVQUNmLENBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLFVBQUo7QUFDRSxRQUFBLElBQUMsQ0FBQSxZQUFELENBQWMsYUFBZCxFQUE2QixJQUE3QixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxzQkFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLHdCQUFELENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFHQSxJQUFDLENBQUEsY0FBRCxDQUFBLENBSEEsQ0FBQTtlQUlBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBTEY7T0FBQSxNQUFBO0FBUUUsUUFBQSxJQUFDLENBQUEsZUFBRCxDQUFpQixhQUFqQixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUZBLENBQUE7QUFHQSxRQUFBLElBQWdDLElBQUMsQ0FBQSxzQkFBakM7QUFBQSxVQUFBLElBQUMsQ0FBQSx5QkFBRCxDQUFBLENBQUEsQ0FBQTtTQUhBO0FBSUEsUUFBQSxJQUFrQyxJQUFDLENBQUEsc0JBQW5DO2lCQUFBLElBQUMsQ0FBQSwyQkFBRCxDQUFBLEVBQUE7U0FaRjtPQURhO0lBQUEsQ0EzVGYsQ0FBQTs7QUFBQSw2QkFtVkEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLE1BQUEsSUFBVSxJQUFDLENBQUEsY0FBWDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUZsQixDQUFBO2FBR0EscUJBQUEsQ0FBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNwQixVQUFBLEtBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxjQUFELEdBQWtCLE1BRkU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QixFQUphO0lBQUEsQ0FuVmYsQ0FBQTs7QUFBQSw2QkE2VkEsbUJBQUEsR0FBcUIsU0FBQSxHQUFBO0FBQ25CLE1BQUEsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQXJCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQURwQixDQUFBO2FBRUEsSUFBQyxDQUFBLGFBQUQsQ0FBQSxFQUhtQjtJQUFBLENBN1ZyQixDQUFBOztBQUFBLDZCQW1XQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxnSUFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLENBQWMsSUFBQyxDQUFBLFFBQUQsSUFBYyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQWQsSUFBK0Isc0JBQTdDLENBQUE7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsZUFBQSxHQUFrQixJQUFDLENBQUEsT0FBTyxDQUFDLDZCQUFULENBQUEsQ0FGbEIsQ0FBQTtBQUFBLE1BR0EsY0FBQSxHQUFpQixJQUFDLENBQUEsT0FBTyxDQUFDLDRCQUFULENBQUEsQ0FBQSxHQUEwQyxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBQSxDQUgzRCxDQUFBO0FBQUEsTUFJQSxZQUFBLEdBQWUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsZ0JBQXpCLEVBQTJDLElBQUMsQ0FBQSxLQUE1QyxDQUpmLENBQUE7QUFNQSxNQUFBLElBQUcsSUFBQyxDQUFBLGdCQUFELElBQXNCLElBQUMsQ0FBQSxTQUExQjtBQUNFLFFBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFQLEdBQW1CLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBaEMsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBUCxHQUFtQixJQUFuQixDQUhGO09BTkE7QUFXQSxNQUFBLElBQUcsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxXQUFkLEVBQ0U7QUFBQSxVQUFBLEtBQUEsRUFBTyxZQUFBLEdBQWUsSUFBdEI7QUFBQSxVQUNBLE1BQUEsRUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLHlCQUFULENBQUEsQ0FBQSxHQUF1QyxJQUQvQztBQUFBLFVBRUEsR0FBQSxFQUFLLGNBQUEsR0FBaUIsSUFGdEI7QUFBQSxVQUdBLElBQUEsRUFBTSxlQUFBLEdBQWtCLElBSHhCO1NBREYsQ0FBQSxDQURGO09BQUEsTUFBQTtBQU9FLFFBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsV0FBZCxFQUNFO0FBQUEsVUFBQSxLQUFBLEVBQU8sWUFBQSxHQUFlLElBQXRCO0FBQUEsVUFDQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyx5QkFBVCxDQUFBLENBQUEsR0FBdUMsSUFEL0M7QUFBQSxVQUVBLFNBQUEsRUFBVyxJQUFDLENBQUEsYUFBRCxDQUFlLGVBQWYsRUFBZ0MsY0FBaEMsQ0FGWDtTQURGLENBQUEsQ0FQRjtPQVhBO0FBQUEsTUF1QkEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsUUFBZCxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sWUFBQSxHQUFlLElBQXRCO09BREYsQ0F2QkEsQ0FBQTtBQUFBLE1BMEJBLFNBQUEsR0FBWSxJQUFDLENBQUEsT0FBTyxDQUFDLHdCQUFULENBQUEsQ0FBQSxHQUFzQyxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBQSxDQUF0QyxHQUFpRSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBQSxDQTFCN0UsQ0FBQTtBQUFBLE1BNEJBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLGFBQUQsQ0FBZSxDQUFmLEVBQWtCLFNBQWxCLENBNUJsQixDQUFBO0FBNkJBLE1BQUEsSUFBNkQsZ0JBQUEsS0FBc0IsQ0FBbkY7QUFBQSxRQUFBLGVBQUEsSUFBbUIsR0FBQSxHQUFNLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBQSxHQUFJLGdCQUFmLENBQXpCLENBQUE7T0E3QkE7QUErQkEsTUFBQSxJQUFHLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsTUFBZCxFQUFzQjtBQUFBLFVBQUEsR0FBQSxFQUFLLFNBQUEsR0FBWSxJQUFqQjtTQUF0QixDQUFBLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxNQUFkLEVBQXNCO0FBQUEsVUFBQSxTQUFBLEVBQVcsZUFBWDtTQUF0QixDQUFBLENBSEY7T0EvQkE7QUFvQ0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxzQkFBRCxJQUE0QixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBQSxDQUE1QixJQUFxRCxDQUFBLElBQUssQ0FBQSxlQUE3RDtBQUNFLFFBQUEsSUFBQyxDQUFBLHlCQUFELENBQUEsQ0FBQSxDQURGO09BcENBO0FBdUNBLE1BQUEsSUFBRyw0QkFBSDtBQUNFLFFBQUEsbUJBQUEsR0FBc0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxlQUFULENBQUEsQ0FBdEIsQ0FBQTtBQUFBLFFBQ0EsZUFBQSxHQUFrQixtQkFBQSxHQUFzQixDQUFDLG1CQUFBLEdBQXNCLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUFBLENBQXZCLENBRHhDLENBQUE7QUFBQSxRQUVBLGVBQUEsR0FBa0IsQ0FBQyxtQkFBQSxHQUFzQixlQUF2QixDQUFBLEdBQTBDLElBQUMsQ0FBQSxPQUFPLENBQUMsNkJBQVQsQ0FBQSxDQUY1RCxDQUFBO0FBSUEsUUFBQSxJQUFHLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBSDtBQUNFLFVBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsZUFBZCxFQUNFO0FBQUEsWUFBQSxNQUFBLEVBQVEsZUFBQSxHQUFrQixJQUExQjtBQUFBLFlBQ0EsR0FBQSxFQUFLLGVBQUEsR0FBa0IsSUFEdkI7V0FERixDQUFBLENBREY7U0FBQSxNQUFBO0FBS0UsVUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxlQUFkLEVBQ0U7QUFBQSxZQUFBLE1BQUEsRUFBUSxlQUFBLEdBQWtCLElBQTFCO0FBQUEsWUFDQSxTQUFBLEVBQVcsSUFBQyxDQUFBLGFBQUQsQ0FBZSxDQUFmLEVBQWtCLGVBQWxCLENBRFg7V0FERixDQUFBLENBTEY7U0FKQTtBQWFBLFFBQUEsSUFBNkIsQ0FBQSxJQUFLLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBQSxDQUFqQztBQUFBLFVBQUEsSUFBQyxDQUFBLHNCQUFELENBQUEsQ0FBQSxDQUFBO1NBZEY7T0F2Q0E7YUF1REEsSUFBQyxDQUFBLFlBQUQsQ0FBQSxFQXhETTtJQUFBLENBbldSLENBQUE7O0FBQUEsNkJBZ2FBLHdCQUFBLEdBQTBCLFNBQUUscUJBQUYsR0FBQTtBQUN4QixNQUR5QixJQUFDLENBQUEsd0JBQUEscUJBQzFCLENBQUE7QUFBQSxNQUFBLElBQTBCLElBQUMsQ0FBQSxRQUEzQjtlQUFBLElBQUMsQ0FBQSxtQkFBRCxDQUFBLEVBQUE7T0FEd0I7SUFBQSxDQWhhMUIsQ0FBQTs7QUFBQSw2QkFvYUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsaUJBQUE7QUFBQSxNQUFBLGlCQUFBLEdBQW9CLElBQUMsQ0FBQSx3QkFBRCxDQUFBLENBQXBCLENBQUE7QUFDQSxNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFIO0FBQ0UsUUFBQSxJQUFBLENBQUEsSUFBK0IsQ0FBQSxVQUEvQjtBQUFBLFVBQUEsSUFBQyxDQUFBLG1CQUFELENBQUEsQ0FBQSxDQUFBO1NBQUE7ZUFFQSxJQUFDLENBQUEscUJBQUQsQ0FBdUIsaUJBQXZCLEVBQTBDLEtBQTFDLEVBSEY7T0FGTztJQUFBLENBcGFULENBQUE7O0FBQUEsNkJBZ2JBLHdCQUFBLEdBQTBCLFNBQUEsR0FBQTtBQUN4QixNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFIO0FBQ0UsUUFBQSxJQUFHLElBQUMsQ0FBQSxVQUFKO2lCQUNFLE1BREY7U0FBQSxNQUFBO2lCQUdFLElBQUMsQ0FBQSxVQUFELEdBQWMsS0FIaEI7U0FERjtPQUFBLE1BQUE7QUFNRSxRQUFBLElBQUcsSUFBQyxDQUFBLFVBQUo7QUFDRSxVQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsS0FBZCxDQUFBO2lCQUNBLEtBRkY7U0FBQSxNQUFBO2lCQUlFLElBQUMsQ0FBQSxVQUFELEdBQWMsTUFKaEI7U0FORjtPQUR3QjtJQUFBLENBaGIxQixDQUFBOztBQUFBLDZCQWtjQSxxQkFBQSxHQUF1QixTQUFDLGlCQUFELEVBQW9CLFdBQXBCLEdBQUE7QUFDckIsVUFBQSxtRkFBQTs7UUFEeUMsY0FBWTtPQUNyRDtBQUFBLE1BQUEsSUFBYyxvQkFBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxVQUFBLEdBQWEsSUFBQyxDQUFBLEtBQUQsS0FBWSxJQUFDLENBQUEsV0FBYixJQUE0QixJQUFDLENBQUEsTUFBRCxLQUFhLElBQUMsQ0FBQSxZQUZ2RCxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxZQUpYLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLFdBTFYsQ0FBQTtBQUFBLE1BTUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxLQU5mLENBQUE7QUFRQSxNQUFBLElBQXFELG9CQUFyRDtBQUFBLFFBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyx1QkFBVCxDQUFpQyxJQUFDLENBQUEsTUFBbEMsRUFBMEMsSUFBQyxDQUFBLEtBQTNDLENBQUEsQ0FBQTtPQVJBO0FBVUEsTUFBQSxJQUEwQixVQUFBLElBQWMsaUJBQWQsSUFBbUMsV0FBN0Q7QUFBQSxRQUFBLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQUEsQ0FBQTtPQVZBO0FBWUEsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLFNBQUQsQ0FBQSxDQUFkO0FBQUEsY0FBQSxDQUFBO09BWkE7QUFjQSxNQUFBLElBQUcsVUFBQSxJQUFjLFdBQWpCO0FBQ0UsUUFBQSxJQUFHLElBQUMsQ0FBQSxnQkFBSjtBQUNFLFVBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsQ0FBYixDQUFBO0FBQUEsVUFDQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixDQURYLENBQUE7QUFBQSxVQUVBLDZCQUFBLEdBQWdDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsQ0FGaEMsQ0FBQTtBQUFBLFVBR0EsS0FBQSxHQUFRLFVBQUEsR0FBYSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBQSxDQUhyQixDQUFBO0FBS0EsVUFBQSxJQUFHLFFBQUEsSUFBYSw2QkFBYixJQUErQyxVQUEvQyxJQUE4RCxLQUFBLElBQVMsSUFBQyxDQUFBLEtBQTNFO0FBQ0UsWUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLEtBQWIsQ0FBQTtBQUFBLFlBQ0EsV0FBQSxHQUFjLEtBRGQsQ0FERjtXQUFBLE1BQUE7QUFJRSxZQUFBLE1BQUEsQ0FBQSxJQUFRLENBQUEsU0FBUixDQUpGO1dBTkY7U0FBQSxNQUFBO0FBWUUsVUFBQSxNQUFBLENBQUEsSUFBUSxDQUFBLFNBQVIsQ0FaRjtTQUFBO0FBY0EsUUFBQSxJQUFHLFdBQUEsS0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUF6QixJQUFrQyxJQUFDLENBQUEsTUFBRCxLQUFhLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBMUQ7QUFDRSxVQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixXQUFBLEdBQWMsZ0JBQTlCLENBQUE7aUJBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLENBQUMsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBQSxDQUFYLENBQUEsR0FBdUMsaUJBRjFEO1NBZkY7T0FmcUI7SUFBQSxDQWxjdkIsQ0FBQTs7QUFBQSw2QkFnZkEsYUFBQSxHQUFlLFNBQUMsT0FBRCxHQUFBO0FBQ2IsVUFBQSwwQkFBQTs7UUFEYyxVQUFRO09BQ3RCO0FBQUE7V0FBQSxpQkFBQTttQ0FBQTtBQUNFLHNCQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsTUFBcEIsRUFBNEIsUUFBNUIsQ0FBbkIsRUFBQSxDQURGO0FBQUE7c0JBRGE7SUFBQSxDQWhmZixDQUFBOztBQUFBLDZCQXdmQSxzQkFBQSxHQUF3QixTQUFDLENBQUQsR0FBQTtBQUN0QixVQUFBLGtCQUFBO0FBQUEsTUFBQSxJQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFBLENBQVY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBRyxDQUFDLENBQUMsS0FBRixLQUFXLENBQWQ7ZUFDRSxJQUFDLENBQUEsMEJBQUQsQ0FBNEIsQ0FBNUIsRUFERjtPQUFBLE1BRUssSUFBRyxDQUFDLENBQUMsS0FBRixLQUFXLENBQWQ7QUFDSCxRQUFBLElBQUMsQ0FBQSw0QkFBRCxDQUE4QixDQUE5QixDQUFBLENBQUE7QUFBQSxRQUVBLFFBQWdCLElBQUMsQ0FBQSxXQUFXLENBQUMscUJBQWIsQ0FBQSxDQUFoQixFQUFDLFlBQUEsR0FBRCxFQUFNLGVBQUEsTUFGTixDQUFBO2VBR0EsSUFBQyxDQUFBLFNBQUQsQ0FBVztBQUFBLFVBQUMsS0FBQSxFQUFPLENBQVI7QUFBQSxVQUFXLEtBQUEsRUFBTyxHQUFBLEdBQU0sTUFBQSxHQUFPLENBQS9CO1NBQVgsRUFKRztPQUFBLE1BQUE7QUFBQTtPQUppQjtJQUFBLENBeGZ4QixDQUFBOztBQUFBLDZCQXVnQkEsMEJBQUEsR0FBNEIsU0FBQyxJQUFELEdBQUE7QUFDMUIsVUFBQSxzRUFBQTtBQUFBLE1BRDRCLGFBQUEsT0FBTyxjQUFBLE1BQ25DLENBQUE7QUFBQSxNQUFBLENBQUEsR0FBSSxLQUFBLEdBQVEsTUFBTSxDQUFDLHFCQUFQLENBQUEsQ0FBOEIsQ0FBQyxHQUEzQyxDQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUksSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQUEsQ0FBZixDQUFBLEdBQTJDLElBQUMsQ0FBQSxPQUFPLENBQUMsd0JBQVQsQ0FBQSxDQURqRCxDQUFBO0FBQUEsTUFHQSxVQUFBLEdBQWEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQUEsQ0FIYixDQUFBO0FBQUEsTUFLQSxTQUFBLEdBQVksR0FBQSxHQUFNLFVBQVUsQ0FBQyxxQkFBWCxDQUFBLENBQU4sR0FBMkMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxtQkFBVCxDQUFBLENBQUEsR0FBaUMsQ0FMeEYsQ0FBQTtBQU9BLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLENBQUg7QUFDRSxRQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsT0FBTyxDQUFDLHNCQUFULENBQUEsQ0FBUCxDQUFBO0FBQUEsUUFDQSxFQUFBLEdBQUssU0FETCxDQUFBO0FBQUEsUUFFQSxJQUFBLEdBQU8sQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLEdBQUQsR0FBQTttQkFBUyxLQUFDLENBQUEsT0FBTyxDQUFDLHNCQUFULENBQWdDLEdBQWhDLEVBQVQ7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZQLENBQUE7QUFBQSxRQUdBLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLENBSFgsQ0FBQTtlQUlBLElBQUMsQ0FBQSxPQUFELENBQVM7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsVUFBWSxFQUFBLEVBQUksRUFBaEI7QUFBQSxVQUFvQixRQUFBLEVBQVUsUUFBOUI7QUFBQSxVQUF3QyxJQUFBLEVBQU0sSUFBOUM7U0FBVCxFQUxGO09BQUEsTUFBQTtlQU9FLElBQUMsQ0FBQSxPQUFPLENBQUMsc0JBQVQsQ0FBZ0MsU0FBaEMsRUFQRjtPQVIwQjtJQUFBLENBdmdCNUIsQ0FBQTs7QUFBQSw2QkE0aEJBLDRCQUFBLEdBQThCLFNBQUMsSUFBRCxHQUFBO0FBQzVCLFVBQUEsMEJBQUE7QUFBQSxNQUQ4QixRQUFELEtBQUMsS0FDOUIsQ0FBQTtBQUFBLE1BQU0sWUFBYSxJQUFDLENBQUEscUJBQUQsQ0FBQSxFQUFsQixHQUFELENBQUE7QUFBQSxNQUNBLENBQUEsR0FBSSxLQUFBLEdBQVEsU0FBUixHQUFvQixJQUFDLENBQUEsT0FBTyxDQUFDLHlCQUFULENBQUEsQ0FBQSxHQUFxQyxDQUQ3RCxDQUFBO0FBQUEsTUFHQSxLQUFBLEdBQVEsQ0FBQSxHQUNOLENBQUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBVCxDQUFBLENBQUEsR0FBOEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyx5QkFBVCxDQUFBLENBQS9CLENBSkYsQ0FBQTthQU1BLElBQUMsQ0FBQSxPQUFPLENBQUMsc0JBQVQsQ0FDRSxLQUFBLEdBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyx5QkFBVCxDQUFBLENBRFYsRUFQNEI7SUFBQSxDQTVoQjlCLENBQUE7O0FBQUEsNkJBMGlCQSxvQkFBQSxHQUFzQixTQUFDLENBQUQsR0FBQTtBQUNwQixVQUFBLGFBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsVUFBNUIsQ0FBaEIsQ0FBQTthQUVBLGFBQWEsQ0FBQyxTQUFTLENBQUMsWUFBeEIsQ0FBcUMsQ0FBckMsRUFIb0I7SUFBQSxDQTFpQnRCLENBQUE7O0FBQUEsNkJBMmpCQSxTQUFBLEdBQVcsU0FBQyxDQUFELEdBQUE7QUFDVCxVQUFBLG1GQUFBO0FBQUEsTUFBQyxVQUFBLEtBQUQsRUFBUSxVQUFBLEtBQVIsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxPQUFmO0FBQUEsY0FBQSxDQUFBO09BREE7QUFFQSxNQUFBLElBQVUsS0FBQSxLQUFXLENBQVgsSUFBaUIsS0FBQSxLQUFXLENBQTVCLElBQXNDLG1CQUFoRDtBQUFBLGNBQUEsQ0FBQTtPQUZBO0FBQUEsTUFJQyxNQUFPLElBQUMsQ0FBQSxXQUFXLENBQUMscUJBQWIsQ0FBQSxFQUFQLEdBSkQsQ0FBQTtBQUFBLE1BS00sWUFBYSxJQUFDLENBQUEscUJBQUQsQ0FBQSxFQUFsQixHQUxELENBQUE7QUFBQSxNQU9BLFVBQUEsR0FBYSxLQUFBLEdBQVEsR0FQckIsQ0FBQTtBQUFBLE1BU0EsT0FBQSxHQUFVO0FBQUEsUUFBQyxZQUFBLFVBQUQ7QUFBQSxRQUFhLFdBQUEsU0FBYjtPQVRWLENBQUE7QUFBQSxNQVdBLGdCQUFBLEdBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtpQkFBTyxLQUFDLENBQUEsSUFBRCxDQUFNLENBQU4sRUFBUyxPQUFULEVBQVA7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVhuQixDQUFBO0FBQUEsTUFZQSxjQUFBLEdBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtpQkFBTyxLQUFDLENBQUEsT0FBRCxDQUFTLENBQVQsRUFBWSxPQUFaLEVBQVA7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVpqQixDQUFBO0FBQUEsTUFjQSxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFkLENBQStCLFdBQS9CLEVBQTRDLGdCQUE1QyxDQWRBLENBQUE7QUFBQSxNQWVBLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWQsQ0FBK0IsU0FBL0IsRUFBMEMsY0FBMUMsQ0FmQSxDQUFBO0FBQUEsTUFnQkEsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZCxDQUErQixZQUEvQixFQUE2QyxjQUE3QyxDQWhCQSxDQUFBO0FBQUEsTUFrQkEsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZCxDQUErQixXQUEvQixFQUE0QyxnQkFBNUMsQ0FsQkEsQ0FBQTtBQUFBLE1BbUJBLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWQsQ0FBK0IsVUFBL0IsRUFBMkMsY0FBM0MsQ0FuQkEsQ0FBQTthQXFCQSxJQUFDLENBQUEsZ0JBQUQsR0FBd0IsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ2pDLFFBQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBZCxDQUFrQyxXQUFsQyxFQUErQyxnQkFBL0MsQ0FBQSxDQUFBO0FBQUEsUUFDQSxRQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFkLENBQWtDLFNBQWxDLEVBQTZDLGNBQTdDLENBREEsQ0FBQTtBQUFBLFFBRUEsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBZCxDQUFrQyxZQUFsQyxFQUFnRCxjQUFoRCxDQUZBLENBQUE7QUFBQSxRQUlBLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQWQsQ0FBa0MsV0FBbEMsRUFBK0MsZ0JBQS9DLENBSkEsQ0FBQTtlQUtBLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQWQsQ0FBa0MsVUFBbEMsRUFBOEMsY0FBOUMsRUFOaUM7TUFBQSxDQUFYLEVBdEJmO0lBQUEsQ0EzakJYLENBQUE7O0FBQUEsNkJBaW1CQSxJQUFBLEdBQU0sU0FBQyxDQUFELEVBQUksT0FBSixHQUFBO0FBQ0osVUFBQSxRQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLE9BQWY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBVSxDQUFDLENBQUMsS0FBRixLQUFhLENBQWIsSUFBbUIsQ0FBQyxDQUFDLEtBQUYsS0FBYSxDQUFoQyxJQUEwQyxtQkFBcEQ7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUFBLE1BRUEsQ0FBQSxHQUFJLENBQUMsQ0FBQyxLQUFGLEdBQVUsT0FBTyxDQUFDLFNBQWxCLEdBQThCLE9BQU8sQ0FBQyxVQUYxQyxDQUFBO0FBQUEsTUFJQSxLQUFBLEdBQVEsQ0FBQSxHQUFJLENBQUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBVCxDQUFBLENBQUEsR0FBOEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyx5QkFBVCxDQUFBLENBQS9CLENBSlosQ0FBQTthQU1BLElBQUMsQ0FBQSxPQUFPLENBQUMsc0JBQVQsQ0FBZ0MsS0FBQSxHQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMseUJBQVQsQ0FBQSxDQUF4QyxFQVBJO0lBQUEsQ0FqbUJOLENBQUE7O0FBQUEsNkJBa25CQSxPQUFBLEdBQVMsU0FBQyxDQUFELEVBQUksT0FBSixHQUFBO0FBQ1AsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLE9BQWY7QUFBQSxjQUFBLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFsQixDQUFBLEVBRk87SUFBQSxDQWxuQlQsQ0FBQTs7QUFBQSw2QkFtb0JBLFdBQUEsR0FBYSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDWCxVQUFBLHdCQUFBO0FBQUEsTUFBQSxJQUFjLGVBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsT0FBQSxHQUFVLEVBRlYsQ0FBQTtBQUdBLFdBQUEsa0JBQUE7aUNBQUE7QUFBQSxRQUFBLE9BQUEsSUFBVyxFQUFBLEdBQUcsUUFBSCxHQUFZLElBQVosR0FBZ0IsS0FBaEIsR0FBc0IsSUFBakMsQ0FBQTtBQUFBLE9BSEE7YUFLQSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQWQsR0FBd0IsUUFOYjtJQUFBLENBbm9CYixDQUFBOztBQUFBLDZCQWlwQkEsYUFBQSxHQUFlLFNBQUMsQ0FBRCxFQUFLLENBQUwsR0FBQTs7UUFBQyxJQUFFO09BQ2hCOztRQURrQixJQUFFO09BQ3BCO0FBQUEsTUFBQSxJQUFHLElBQUMsQ0FBQSx1QkFBSjtlQUNHLGNBQUEsR0FBYyxDQUFkLEdBQWdCLE1BQWhCLEdBQXNCLENBQXRCLEdBQXdCLFNBRDNCO09BQUEsTUFBQTtlQUdHLFlBQUEsR0FBWSxDQUFaLEdBQWMsTUFBZCxHQUFvQixDQUFwQixHQUFzQixNQUh6QjtPQURhO0lBQUEsQ0FqcEJmLENBQUE7O0FBQUEsNkJBNnBCQSxTQUFBLEdBQVcsU0FBQyxDQUFELEVBQUssQ0FBTCxHQUFBOztRQUFDLElBQUU7T0FDWjs7UUFEYyxJQUFFO09BQ2hCO0FBQUEsTUFBQSxJQUFHLElBQUMsQ0FBQSx1QkFBSjtlQUNHLFVBQUEsR0FBVSxDQUFWLEdBQVksSUFBWixHQUFnQixDQUFoQixHQUFrQixPQURyQjtPQUFBLE1BQUE7ZUFHRyxRQUFBLEdBQVEsQ0FBUixHQUFVLElBQVYsR0FBYyxDQUFkLEdBQWdCLElBSG5CO09BRFM7SUFBQSxDQTdwQlgsQ0FBQTs7QUFBQSw2QkF3cUJBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFBTyxJQUFBLElBQUEsQ0FBQSxFQUFQO0lBQUEsQ0F4cUJULENBQUE7O0FBQUEsNkJBb3JCQSxPQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7QUFDUCxVQUFBLDhDQUFBO0FBQUEsTUFEUyxZQUFBLE1BQU0sVUFBQSxJQUFJLGdCQUFBLFVBQVUsWUFBQSxJQUM3QixDQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFSLENBQUE7QUFBQSxNQUVBLEtBQUEsR0FBUSxTQUFDLFFBQUQsR0FBQTtBQUNOLGVBQU8sR0FBQSxHQUFNLElBQUksQ0FBQyxHQUFMLENBQVUsUUFBQSxHQUFXLElBQUksQ0FBQyxFQUExQixDQUFBLEdBQWlDLENBQTlDLENBRE07TUFBQSxDQUZSLENBQUE7QUFBQSxNQUtBLE1BQUEsR0FBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ1AsY0FBQSx1QkFBQTtBQUFBLFVBQUEsTUFBQSxHQUFTLEtBQUMsQ0FBQSxPQUFELENBQUEsQ0FBQSxHQUFhLEtBQXRCLENBQUE7QUFDQSxVQUFBLElBQUcsUUFBQSxLQUFZLENBQWY7QUFDRSxZQUFBLFFBQUEsR0FBVyxDQUFYLENBREY7V0FBQSxNQUFBO0FBR0UsWUFBQSxRQUFBLEdBQVcsTUFBQSxHQUFTLFFBQXBCLENBSEY7V0FEQTtBQUtBLFVBQUEsSUFBZ0IsUUFBQSxHQUFXLENBQTNCO0FBQUEsWUFBQSxRQUFBLEdBQVcsQ0FBWCxDQUFBO1dBTEE7QUFBQSxVQU1BLEtBQUEsR0FBUSxLQUFBLENBQU0sUUFBTixDQU5SLENBQUE7QUFBQSxVQU9BLElBQUEsQ0FBSyxJQUFBLEdBQU8sQ0FBQyxFQUFBLEdBQUcsSUFBSixDQUFBLEdBQVUsS0FBdEIsQ0FQQSxDQUFBO0FBU0EsVUFBQSxJQUFHLFFBQUEsR0FBVyxDQUFkO21CQUNFLHFCQUFBLENBQXNCLE1BQXRCLEVBREY7V0FWTztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTFQsQ0FBQTthQWtCQSxNQUFBLENBQUEsRUFuQk87SUFBQSxDQXByQlQsQ0FBQTs7MEJBQUE7O01BckJGLENBQUE7O0FBQUEsRUFzdUJBLE1BQU0sQ0FBQyxPQUFQLEdBQ0EsY0FBQSxHQUFpQix1QkFBQSxDQUF3QiwwQkFBeEIsRUFBb0QsY0FBYyxDQUFDLFNBQW5FLENBdnVCakIsQ0FBQTs7QUFBQSxFQTZ1QkEsY0FBYyxDQUFDLG9CQUFmLEdBQXNDLFNBQUEsR0FBQTtXQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQVgsQ0FBMkIsT0FBQSxDQUFRLFdBQVIsQ0FBM0IsRUFBaUQsU0FBQyxLQUFELEdBQUE7QUFDL0MsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsR0FBQSxDQUFBLGNBQVYsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsS0FBakIsQ0FEQSxDQUFBO2FBRUEsUUFIK0M7SUFBQSxDQUFqRCxFQURvQztFQUFBLENBN3VCdEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Kamilius/.atom/packages/minimap/lib/minimap-element.coffee
