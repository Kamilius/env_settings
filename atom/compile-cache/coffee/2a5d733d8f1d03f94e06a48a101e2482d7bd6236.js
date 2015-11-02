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
        return function(charHeight) {
          _this.charHeight = charHeight;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charHeight',
            value: _this.charHeight
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charWidth', (function(_this) {
        return function(charWidth) {
          _this.charWidth = charWidth;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charWidth',
            value: _this.charWidth
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.interline', (function(_this) {
        return function(interline) {
          _this.interline = interline;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.interline',
            value: _this.interline
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
      return this.charHeight + this.interline;
    };

    Minimap.prototype.getCharWidth = function() {
      return this.charWidth;
    };

    Minimap.prototype.getCharHeight = function() {
      return this.charHeight;
    };

    Minimap.prototype.getInterline = function() {
      return this.interline;
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
