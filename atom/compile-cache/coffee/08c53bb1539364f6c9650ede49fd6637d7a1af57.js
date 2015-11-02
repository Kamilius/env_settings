(function() {
  var BetaAdater, CompositeDisposable, DecorationManagement, Emitter, LegacyAdater, Minimap, nextModelId, _ref;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  DecorationManagement = require('./mixins/decoration-management');

  LegacyAdater = require('./adapters/legacy-adapter');

  BetaAdater = require('./adapters/beta-adapter');

  nextModelId = 1;

  module.exports = Minimap = (function() {
    DecorationManagement.includeInto(Minimap);


    /* Public */

    function Minimap(options) {
      var subs;
      if (options == null) {
        options = {};
      }
      this.textEditor = options.textEditor, this.standAlone = options.standAlone, this.width = options.width, this.height = options.height;
      if (this.textEditor == null) {
        throw new Error('Cannot create a minimap without an editor');
      }
      this.id = nextModelId++;
      this.emitter = new Emitter;
      this.subscriptions = subs = new CompositeDisposable;
      this.initializeDecorations();
      if (atom.views.getView(this.textEditor).getScrollTop != null) {
        this.adapter = new BetaAdater(this.textEditor);
      } else {
        this.adapter = new LegacyAdater(this.textEditor);
      }
      if (this.standAlone) {
        this.scrollTop = 0;
      }
      subs.add(atom.config.observe('editor.scrollPastEnd', (function(_this) {
        return function(scrollPastEnd) {
          _this.scrollPastEnd = scrollPastEnd;
          _this.adapter.scrollPastEnd = _this.scrollPastEnd;
          return _this.emitter.emit('did-change-config', {
            config: 'editor.scrollPastEnd',
            value: _this.scrollPastEnd
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charHeight', (function(_this) {
        return function(configCharHeight) {
          _this.configCharHeight = configCharHeight;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charHeight',
            value: _this.getCharHeight()
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charWidth', (function(_this) {
        return function(configCharWidth) {
          _this.configCharWidth = configCharWidth;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charWidth',
            value: _this.getCharWidth()
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.interline', (function(_this) {
        return function(configInterline) {
          _this.configInterline = configInterline;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.interline',
            value: _this.getInterline()
          });
        };
      })(this)));
      subs.add(this.adapter.onDidChangeScrollTop((function(_this) {
        return function() {
          if (!_this.standAlone) {
            return _this.emitter.emit('did-change-scroll-top', _this);
          }
        };
      })(this)));
      subs.add(this.adapter.onDidChangeScrollLeft((function(_this) {
        return function() {
          if (!_this.standAlone) {
            return _this.emitter.emit('did-change-scroll-left', _this);
          }
        };
      })(this)));
      subs.add(this.textEditor.onDidChange((function(_this) {
        return function(changes) {
          return _this.emitChanges(changes);
        };
      })(this)));
      subs.add(this.textEditor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      subs.add(this.textEditor.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          return _this.emitter.emit('did-change-config');
        };
      })(this)));
    }

    Minimap.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      this.removeAllDecorations();
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.textEditor = null;
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      return this.destroyed = true;
    };

    Minimap.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    Minimap.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    Minimap.prototype.onDidChangeConfig = function(callback) {
      return this.emitter.on('did-change-config', callback);
    };

    Minimap.prototype.onDidChangeScrollTop = function(callback) {
      return this.emitter.on('did-change-scroll-top', callback);
    };

    Minimap.prototype.onDidChangeScrollLeft = function(callback) {
      return this.emitter.on('did-change-scroll-left', callback);
    };

    Minimap.prototype.onDidChangeStandAlone = function(callback) {
      return this.emitter.on('did-change-stand-alone', callback);
    };

    Minimap.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    Minimap.prototype.isStandAlone = function() {
      return this.standAlone;
    };

    Minimap.prototype.setStandAlone = function(standAlone) {
      if (standAlone !== this.standAlone) {
        this.standAlone = standAlone;
        return this.emitter.emit('did-change-stand-alone', this);
      }
    };

    Minimap.prototype.getTextEditor = function() {
      return this.textEditor;
    };

    Minimap.prototype.getTextEditorScaledHeight = function() {
      return this.adapter.getHeight() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollTop = function() {
      return this.adapter.getScrollTop() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollLeft = function() {
      return this.adapter.getScrollLeft() * this.getHorizontalScaleFactor();
    };

    Minimap.prototype.getTextEditorMaxScrollTop = function() {
      return this.adapter.getMaxScrollTop();
    };

    Minimap.prototype.getTextEditorScrollTop = function() {
      return this.adapter.getScrollTop();
    };

    Minimap.prototype.setTextEditorScrollTop = function(scrollTop) {
      return this.adapter.setScrollTop(scrollTop);
    };

    Minimap.prototype.getTextEditorScrollLeft = function() {
      return this.adapter.getScrollLeft();
    };

    Minimap.prototype.getTextEditorHeight = function() {
      return this.adapter.getHeight();
    };

    Minimap.prototype.getTextEditorScrollRatio = function() {
      return this.adapter.getScrollTop() / (this.getTextEditorMaxScrollTop() || 1);
    };

    Minimap.prototype.getCapedTextEditorScrollRatio = function() {
      return Math.min(1, this.getTextEditorScrollRatio());
    };

    Minimap.prototype.getHeight = function() {
      return this.textEditor.getScreenLineCount() * this.getLineHeight();
    };

    Minimap.prototype.getWidth = function() {
      return this.textEditor.getMaxScreenLineLength() * this.getCharWidth();
    };

    Minimap.prototype.getVisibleHeight = function() {
      return Math.min(this.getScreenHeight(), this.getHeight());
    };

    Minimap.prototype.getScreenHeight = function() {
      if (this.isStandAlone()) {
        if (this.height != null) {
          return this.height;
        } else {
          return this.getHeight();
        }
      } else {
        return this.adapter.getHeight();
      }
    };

    Minimap.prototype.getVisibleWidth = function() {
      return Math.min(this.getScreenWidth(), this.getWidth());
    };

    Minimap.prototype.getScreenWidth = function() {
      if (this.isStandAlone() && (this.width != null)) {
        return this.width;
      } else {
        return this.getWidth();
      }
    };

    Minimap.prototype.setScreenHeightAndWidth = function(height, width) {
      this.height = height;
      this.width = width;
    };

    Minimap.prototype.getVerticalScaleFactor = function() {
      return this.getLineHeight() / this.textEditor.getLineHeightInPixels();
    };

    Minimap.prototype.getHorizontalScaleFactor = function() {
      return this.getCharWidth() / this.textEditor.getDefaultCharWidth();
    };

    Minimap.prototype.getLineHeight = function() {
      return this.getCharHeight() + this.getInterline();
    };

    Minimap.prototype.getCharWidth = function() {
      var _ref1;
      return (_ref1 = this.charWidth) != null ? _ref1 : this.configCharWidth;
    };

    Minimap.prototype.setCharWidth = function(charWidth) {
      this.charWidth = Math.floor(charWidth);
      return this.emitter.emit('did-change-config');
    };

    Minimap.prototype.getCharHeight = function() {
      var _ref1;
      return (_ref1 = this.charHeight) != null ? _ref1 : this.configCharHeight;
    };

    Minimap.prototype.setCharHeight = function(charHeight) {
      this.charHeight = Math.floor(charHeight);
      return this.emitter.emit('did-change-config');
    };

    Minimap.prototype.getInterline = function() {
      var _ref1;
      return (_ref1 = this.interline) != null ? _ref1 : this.configInterline;
    };

    Minimap.prototype.setInterline = function(interline) {
      this.interline = Math.floor(interline);
      return this.emitter.emit('did-change-config');
    };

    Minimap.prototype.getFirstVisibleScreenRow = function() {
      return Math.floor(this.getScrollTop() / this.getLineHeight());
    };

    Minimap.prototype.getLastVisibleScreenRow = function() {
      return Math.ceil((this.getScrollTop() + this.getScreenHeight()) / this.getLineHeight());
    };

    Minimap.prototype.getScrollTop = function() {
      if (this.standAlone) {
        return this.scrollTop;
      } else {
        return Math.abs(this.getCapedTextEditorScrollRatio() * this.getMaxScrollTop());
      }
    };

    Minimap.prototype.setScrollTop = function(scrollTop) {
      this.scrollTop = scrollTop;
      if (this.standAlone) {
        return this.emitter.emit('did-change-scroll-top', this);
      }
    };

    Minimap.prototype.getMaxScrollTop = function() {
      return Math.max(0, this.getHeight() - this.getScreenHeight());
    };

    Minimap.prototype.canScroll = function() {
      return this.getMaxScrollTop() > 0;
    };

    Minimap.prototype.getMarker = function(id) {
      return this.textEditor.getMarker(id);
    };

    Minimap.prototype.findMarkers = function(o) {
      try {
        return this.textEditor.findMarkers(o);
      } catch (_error) {
        return [];
      }
    };

    Minimap.prototype.markBufferRange = function(range) {
      return this.textEditor.markBufferRange(range);
    };

    Minimap.prototype.emitChanges = function(changes) {
      return this.emitter.emit('did-change', changes);
    };

    return Minimap;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21pbmltYXAuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdHQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLFdBQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixDQUFBOztBQUFBLEVBQ0Esb0JBQUEsR0FBdUIsT0FBQSxDQUFRLGdDQUFSLENBRHZCLENBQUE7O0FBQUEsRUFFQSxZQUFBLEdBQWUsT0FBQSxDQUFRLDJCQUFSLENBRmYsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEseUJBQVIsQ0FIYixDQUFBOztBQUFBLEVBS0EsV0FBQSxHQUFjLENBTGQsQ0FBQTs7QUFBQSxFQWFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLG9CQUFvQixDQUFDLFdBQXJCLENBQWlDLE9BQWpDLENBQUEsQ0FBQTs7QUFFQTtBQUFBLGdCQUZBOztBQVFhLElBQUEsaUJBQUMsT0FBRCxHQUFBO0FBQ1gsVUFBQSxJQUFBOztRQURZLFVBQVE7T0FDcEI7QUFBQSxNQUFDLElBQUMsQ0FBQSxxQkFBQSxVQUFGLEVBQWMsSUFBQyxDQUFBLHFCQUFBLFVBQWYsRUFBMkIsSUFBQyxDQUFBLGdCQUFBLEtBQTVCLEVBQW1DLElBQUMsQ0FBQSxpQkFBQSxNQUFwQyxDQUFBO0FBRUEsTUFBQSxJQUFPLHVCQUFQO0FBQ0UsY0FBVSxJQUFBLEtBQUEsQ0FBTSwyQ0FBTixDQUFWLENBREY7T0FGQTtBQUFBLE1BS0EsSUFBQyxDQUFBLEVBQUQsR0FBTSxXQUFBLEVBTE4sQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FOWCxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsYUFBRCxH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

//# sourceURL=/Users/Kamilius/.atom/packages/minimap/lib/minimap.coffee
