(function() {
  var BottomContainer, BottomPanel, BottomStatus, CompositeDisposable, LinterViews, Message;

  CompositeDisposable = require('atom').CompositeDisposable;

  BottomPanel = require('./ui/bottom-panel').BottomPanel;

  BottomContainer = require('./ui/bottom-container');

  BottomStatus = require('./ui/bottom-status');

  Message = require('./ui/message-element').Message;

  LinterViews = (function() {
    function LinterViews(linter) {
      this.linter = linter;
      this.state = this.linter.state;
      this.subscriptions = new CompositeDisposable;
      this.messages = [];
      this.panel = new BottomPanel(this.state.scope);
      this.bottomContainer = new BottomContainer().prepare(this.linter.state);
      this.bottomBar = null;
      this.bubble = null;
      this.count = {
        File: 0,
        Line: 0,
        Project: 0
      };
      this.subscriptions.add(this.panel);
      this.subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showBubble) {
          return _this.showBubble = showBubble;
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.classifyMessages(_this.messages);
          _this.renderBubble();
          _this.renderCount();
          return _this.panel.refresh(_this.state.scope);
        };
      })(this)));
      this.subscriptions.add(this.bottomContainer.onDidChangeTab((function(_this) {
        return function() {
          atom.config.set('linter.showErrorPanel', true);
          return _this.panel.refresh(_this.state.scope);
        };
      })(this)));
      this.subscriptions.add(this.bottomContainer.onShouldTogglePanel(function() {
        return atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
      }));
    }

    LinterViews.prototype.render = function(_arg) {
      var added, messages, removed;
      added = _arg.added, removed = _arg.removed, messages = _arg.messages;
      this.messages = this.classifyMessages(messages);
      this.panel.setMessages({
        added: added,
        removed: removed
      });
      this.renderBubble();
      this.renderCount();
      return this.notifyEditors({
        added: added,
        removed: removed
      });
    };

    LinterViews.prototype.notifyEditors = function(_arg) {
      var added, removed;
      added = _arg.added, removed = _arg.removed;
      removed.forEach((function(_this) {
        return function(message) {
          var editorLinter;
          if (!(message.filePath && message.range)) {
            return;
          }
          if (!(editorLinter = _this.linter.getEditorLinterByPath(message.filePath))) {
            return;
          }
          return editorLinter.deleteMessage(message);
        };
      })(this));
      return added.forEach((function(_this) {
        return function(message) {
          var editorLinter;
          if (!(message.filePath && message.range)) {
            return;
          }
          if (!(editorLinter = _this.linter.getEditorLinterByPath(message.filePath))) {
            return;
          }
          return editorLinter.addMessage(message);
        };
      })(this));
    };

    LinterViews.prototype.notifyEditor = function(editorLinter) {
      var editorPath;
      editorPath = editorLinter.editor.getPath();
      return this.messages.forEach(function(message) {
        if (!(message.filePath && message.range && message.filePath === editorPath)) {
          return;
        }
        return editorLinter.addMessage(message);
      });
    };

    LinterViews.prototype.renderLineMessages = function(render) {
      if (render == null) {
        render = false;
      }
      this.classifyMessagesByLine(this.messages);
      if (render) {
        this.renderCount();
        return this.panel.refresh(this.state.scope);
      }
    };

    LinterViews.prototype.classifyMessages = function(messages) {
      var filePath, key, message, _ref;
      filePath = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      this.count.File = 0;
      this.count.Project = 0;
      for (key in messages) {
        message = messages[key];
        if (message.currentFile = filePath && message.filePath === filePath) {
          this.count.File++;
        }
        this.count.Project++;
      }
      return this.classifyMessagesByLine(messages);
    };

    LinterViews.prototype.classifyMessagesByLine = function(messages) {
      var key, message, row, _ref;
      row = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getCursorBufferPosition().row : void 0;
      this.count.Line = 0;
      for (key in messages) {
        message = messages[key];
        if (message.currentLine = message.currentFile && message.range && message.range.intersectsRow(row)) {
          this.count.Line++;
        }
      }
      return messages;
    };

    LinterViews.prototype.renderBubble = function() {
      var activeEditor, message, point, _i, _len, _ref, _results;
      this.removeBubble();
      if (!this.showBubble) {
        return;
      }
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!(activeEditor != null ? typeof activeEditor.getPath === "function" ? activeEditor.getPath() : void 0 : void 0)) {
        return;
      }
      point = activeEditor.getCursorBufferPosition();
      _ref = this.messages;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        message = _ref[_i];
        if (!message.currentLine) {
          continue;
        }
        if (!message.range.containsPoint(point)) {
          continue;
        }
        this.bubble = activeEditor.markBufferRange([point, point], {
          invalidate: 'inside'
        });
        activeEditor.decorateMarker(this.bubble, {
          type: 'overlay',
          position: 'tail',
          item: this.renderBubbleContent(message)
        });
        break;
      }
      return _results;
    };

    LinterViews.prototype.renderBubbleContent = function(message) {
      var bubble;
      bubble = document.createElement('div');
      bubble.id = 'linter-inline';
      bubble.appendChild(Message.fromMessage(message, false));
      if (message.trace) {
        message.trace.forEach(function(trace) {
          var element;
          element = Message.fromMessage(trace);
          bubble.appendChild(element);
          return element.updateVisibility('Project');
        });
      }
      return bubble;
    };

    LinterViews.prototype.renderCount = function() {
      return this.bottomContainer.setCount(this.count);
    };

    LinterViews.prototype.attachBottom = function(statusBar) {
      this.subscriptions.add(atom.config.observe('linter.statusIconPosition', (function(_this) {
        return function(statusIconPosition) {
          var _ref;
          if ((_ref = _this.bottomBar) != null) {
            _ref.destroy();
          }
          return _this.bottomBar = statusBar["add" + statusIconPosition + "Tile"]({
            item: _this.bottomContainer,
            priority: statusIconPosition === 'Left' ? -100 : 100
          });
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter.displayLinterInfo', (function(_this) {
        return function(displayLinterInfo) {
          return _this.bottomContainer.setVisibility(displayLinterInfo);
        };
      })(this)));
    };

    LinterViews.prototype.removeBubble = function() {
      var _ref;
      if ((_ref = this.bubble) != null) {
        _ref.destroy();
      }
      return this.bubble = null;
    };

    LinterViews.prototype.dispose = function() {
      var _ref;
      this.notifyEditors({
        added: [],
        removed: this.messages
      });
      this.removeBubble();
      this.subscriptions.dispose();
      return (_ref = this.bottomBar) != null ? _ref.destroy() : void 0;
    };

    return LinterViews;

  })();

  module.exports = LinterViews;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLXZpZXdzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxRkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUMsY0FBZSxPQUFBLENBQVEsbUJBQVIsRUFBZixXQUZELENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx1QkFBUixDQUhsQixDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxvQkFBUixDQUpmLENBQUE7O0FBQUEsRUFLQyxVQUFXLE9BQUEsQ0FBUSxzQkFBUixFQUFYLE9BTEQsQ0FBQTs7QUFBQSxFQU9NO0FBQ1MsSUFBQSxxQkFBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFEakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQUZaLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxXQUFBLENBQVksSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFuQixDQUhiLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxlQUFELEdBQXVCLElBQUEsZUFBQSxDQUFBLENBQWlCLENBQUMsT0FBbEIsQ0FBMEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFsQyxDQUp2QixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBTGIsQ0FBQTtBQUFBLE1BTUEsSUFBQyxD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

//# sourceURL=/Users/Kamilius/.atom/packages/linter/lib/linter-views.coffee
