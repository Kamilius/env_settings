Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _messageElement = require('./message-element');

'use babel';

var Interact = require('interact.js');

var BottomPanel = (function () {
  function BottomPanel(scope) {
    var _this = this;

    _classCallCheck(this, BottomPanel);

    this.subscriptions = new _atom.CompositeDisposable();
    this.element = document.createElement('linter-panel'); // TODO(steelbrain): Make this a `div`
    this.element.tabIndex = '-1';
    this.messagesElement = document.createElement('div');
    this.panel = atom.workspace.addBottomPanel({ item: this.element, visible: false, priority: 500 });
    this.visibility = false;
    this.visibleMessages = 0;
    this.alwaysTakeMinimumSpace = atom.config.get('linter.alwaysTakeMinimumSpace');
    this.errorPanelHeight = atom.config.get('linter.errorPanelHeight');
    this.configVisibility = atom.config.get('linter.showErrorPanel');
    this.scope = scope;
    this.messages = new Map();

    // Keep messages contained to measure height.
    this.element.appendChild(this.messagesElement);

    this.subscriptions.add(atom.config.onDidChange('linter.alwaysTakeMinimumSpace', function (_ref) {
      var newValue = _ref.newValue;
      var oldValue = _ref.oldValue;

      _this.alwaysTakeMinimumSpace = newValue;
      _this.updateHeight();
    }));

    this.subscriptions.add(atom.config.onDidChange('linter.errorPanelHeight', function (_ref2) {
      var newValue = _ref2.newValue;
      var oldValue = _ref2.oldValue;

      _this.errorPanelHeight = newValue;
      _this.updateHeight();
    }));

    this.subscriptions.add(atom.config.onDidChange('linter.showErrorPanel', function (_ref3) {
      var newValue = _ref3.newValue;
      var oldValue = _ref3.oldValue;

      _this.configVisibility = newValue;
      _this.updateVisibility();
    }));

    this.subscriptions.add(atom.workspace.observeActivePaneItem(function (paneItem) {
      _this.paneVisibility = paneItem === atom.workspace.getActiveTextEditor();
      _this.updateVisibility();
    }));

    Interact(this.element).resizable({ edges: { top: true } }).on('resizemove', function (event) {
      event.target.style.height = event.rect.height + 'px';
    }).on('resizeend', function (event) {
      atom.config.set('linter.errorPanelHeight', event.target.clientHeight);
    });
  }

  _createClass(BottomPanel, [{
    key: 'refresh',
    value: function refresh(scope) {
      this.scope = scope;
      this.visibleMessages = 0;

      for (var message of this.messages) {
        if (message[1].updateVisibility(scope).status) this.visibleMessages++;
      }

      this.updateVisibility();
    }
  }, {
    key: 'setMessages',
    value: function setMessages(_ref4) {
      var added = _ref4.added;
      var removed = _ref4.removed;

      if (removed.length) this.removeMessages(removed);

      for (var message of added) {
        var messageElement = _messageElement.Message.fromMessage(message);
        this.messagesElement.appendChild(messageElement);
        messageElement.updateVisibility(this.scope);
        if (messageElement.status) this.visibleMessages++;
        this.messages.set(message, messageElement);
      }

      this.updateVisibility();
    }
  }, {
    key: 'updateHeight',
    value: function updateHeight() {
      var height = this.errorPanelHeight;

      if (this.alwaysTakeMinimumSpace) {
        // Add `1px` for the top border.
        height = Math.min(this.messagesElement.clientHeight + 1, height);
      }

      this.element.style.height = height + 'px';
    }
  }, {
    key: 'removeMessages',
    value: function removeMessages(removed) {
      for (var message of removed) {
        if (this.messages.has(message)) {
          var messageElement = this.messages.get(message);
          if (messageElement.status) this.visibleMessages--;
          this.messagesElement.removeChild(messageElement);
          this.messages['delete'](message);
        }
      }
    }
  }, {
    key: 'getVisibility',
    value: function getVisibility() {
      return this.visibility;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility() {
      this.visibility = this.configVisibility && this.paneVisibility && this.visibleMessages > 0;

      if (this.visibility) {
        this.panel.show();
        this.updateHeight();
      } else {
        this.panel.hide();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.messages.clear();
      this.panel.destroy();
    }
  }]);

  return BottomPanel;
})();

exports.BottomPanel = BottomPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS1wYW5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFHa0MsTUFBTTs7OEJBQ2xCLG1CQUFtQjs7QUFKekMsV0FBVyxDQUFBOztBQUVYLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTs7SUFJMUIsV0FBVztBQUNYLFdBREEsV0FBVyxDQUNWLEtBQUssRUFBRTs7OzBCQURSLFdBQVc7O0FBRXBCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXVCLENBQUE7QUFDNUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3JELFFBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtBQUM1QixRQUFJLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDcEQsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUE7QUFDL0YsUUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7QUFDdkIsUUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUE7QUFDeEIsUUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUE7QUFDOUUsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFDbEUsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixD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akQsY0FBSSxjQUFjLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUNqRCxjQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUNoRCxjQUFJLENBQUMsUUFBUSxVQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDOUI7T0FDRjtLQUNGOzs7V0FDWSx5QkFBRztBQUNkLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQTtLQUN2Qjs7O1dBQ2UsNEJBQUc7QUFDakIsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQTs7QUFFMUYsVUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ25CLFlBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDakIsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO09BQ3BCLE1BQU07QUFDTCxZQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO09BQ2xCO0tBQ0Y7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3JCLFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDckI7OztTQTNHVSxXQUFXIiwiZmlsZSI6Ii9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS1wYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmNvbnN0IEludGVyYWN0ID0gcmVxdWlyZSgnaW50ZXJhY3QuanMnKVxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHtNZXNzYWdlfSBmcm9tICcuL21lc3NhZ2UtZWxlbWVudCdcblxuZXhwb3J0IGNsYXNzIEJvdHRvbVBhbmVsIHtcbiAgY29uc3RydWN0b3Ioc2NvcGUpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1wYW5lbCcpIC8vIFRPRE8oc3RlZWxicmFpbik6IE1ha2UgdGhpcyBhIGBkaXZgXG4gICAgdGhpcy5lbGVtZW50LnRhYkluZGV4ID0gJy0xJ1xuICAgIHRoaXMubWVzc2FnZXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe2l0ZW06IHRoaXMuZWxlbWVudCwgdmlzaWJsZTogZmFsc2UsIHByaW9yaXR5OiA1MDB9KVxuICAgIHRoaXMudmlzaWJpbGl0eSA9IGZhbHNlXG4gICAgdGhpcy52aXNpYmxlTWVzc2FnZXMgPSAwXG4gICAgdGhpcy5hbHdheXNUYWtlTWluaW11bVNwYWNlID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuYWx3YXlzVGFrZU1pbmltdW1TcGFjZScpXG4gICAgdGhpcy5lcnJvclBhbmVsSGVpZ2h0ID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuZXJyb3JQYW5lbEhlaWdodCcpXG4gICAgdGhpcy5jb25maWdWaXNpYmlsaXR5ID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnKVxuICAgIHRoaXMuc2NvcGUgPSBzY29wZVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWFwKClcblxuICAgIC8vIEtlZXAgbWVzc2FnZXMgY29udGFpbmVkIHRvIG1lYXN1cmUgaGVpZ2h0LlxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1lc3NhZ2VzRWxlbWVudClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2xpbnRlci5hbHdheXNUYWtlTWluaW11bVNwYWNlJywgKHtuZXdWYWx1ZSwgb2xkVmFsdWV9KSA9PiB7XG4gICAgICB0aGlzLmFsd2F5c1Rha2VNaW5pbXVtU3BhY2UgPSBuZXdWYWx1ZVxuICAgICAgdGhpcy51cGRhdGVIZWlnaHQoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGludGVyLmVycm9yUGFuZWxIZWlnaHQnLCAoe25ld1ZhbHVlLCBvbGRWYWx1ZX0pID0+IHtcbiAgICAgIHRoaXMuZXJyb3JQYW5lbEhlaWdodCA9IG5ld1ZhbHVlXG4gICAgICB0aGlzLnVwZGF0ZUhlaWdodCgpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnLCAoe25ld1ZhbHVlLCBvbGRWYWx1ZX0pID0+IHtcbiAgICAgIHRoaXMuY29uZmlnVmlzaWJpbGl0eSA9IG5ld1ZhbHVlXG4gICAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0ocGFuZUl0ZW0gPT4ge1xuICAgICAgdGhpcy5wYW5lVmlzaWJpbGl0eSA9IHBhbmVJdGVtID09PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpXG4gICAgfSkpXG5cbiAgICBJbnRlcmFjdCh0aGlzLmVsZW1lbnQpLnJlc2l6YWJsZSh7ZWRnZXM6IHt0b3A6IHRydWV9fSlcbiAgICAgIC5vbigncmVzaXplbW92ZScsIGV2ZW50ID0+IHtcbiAgICAgICAgZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9IGAke2V2ZW50LnJlY3QuaGVpZ2h0fXB4YFxuICAgICAgfSlcbiAgICAgIC5vbigncmVzaXplZW5kJywgZXZlbnQgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5lcnJvclBhbmVsSGVpZ2h0JywgZXZlbnQudGFyZ2V0LmNsaWVudEhlaWdodClcbiAgICAgIH0pXG4gIH1cbiAgcmVmcmVzaChzY29wZSkge1xuICAgIHRoaXMuc2NvcGUgPSBzY29wZVxuICAgIHRoaXMudmlzaWJsZU1lc3NhZ2VzID0gMFxuXG4gICAgZm9yIChsZXQgbWVzc2FnZSBvZiB0aGlzLm1lc3NhZ2VzKSB7XG4gICAgICBpZiAobWVzc2FnZVsxXS51cGRhdGVWaXNpYmlsaXR5KHNjb3BlKS5zdGF0dXMpIHRoaXMudmlzaWJsZU1lc3NhZ2VzKytcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKVxuICB9XG4gIHNldE1lc3NhZ2VzKHthZGRlZCwgcmVtb3ZlZH0pIHtcbiAgICBpZiAocmVtb3ZlZC5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZU1lc3NhZ2VzKHJlbW92ZWQpXG5cbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIGFkZGVkKSB7XG4gICAgICBjb25zdCBtZXNzYWdlRWxlbWVudCA9IE1lc3NhZ2UuZnJvbU1lc3NhZ2UobWVzc2FnZSlcbiAgICAgIHRoaXMubWVzc2FnZXNFbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2VFbGVtZW50KVxuICAgICAgbWVzc2FnZUVsZW1lbnQudXBkYXRlVmlzaWJpbGl0eSh0aGlzLnNjb3BlKVxuICAgICAgaWYgKG1lc3NhZ2VFbGVtZW50LnN0YXR1cykgdGhpcy52aXNpYmxlTWVzc2FnZXMrK1xuICAgICAgdGhpcy5tZXNzYWdlcy5zZXQobWVzc2FnZSwgbWVzc2FnZUVsZW1lbnQpXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KClcbiAgfVxuICB1cGRhdGVIZWlnaHQoKSB7XG4gICAgbGV0IGhlaWdodCA9IHRoaXMuZXJyb3JQYW5lbEhlaWdodFxuXG4gICAgaWYgKHRoaXMuYWx3YXlzVGFrZU1pbmltdW1TcGFjZSkge1xuICAgICAgLy8gQWRkIGAxcHhgIGZvciB0aGUgdG9wIGJvcmRlci5cbiAgICAgIGhlaWdodCA9IE1hdGgubWluKHRoaXMubWVzc2FnZXNFbGVtZW50LmNsaWVudEhlaWdodCArIDEsIGhlaWdodClcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YFxuICB9XG4gIHJlbW92ZU1lc3NhZ2VzKHJlbW92ZWQpIHtcbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIHJlbW92ZWQpIHtcbiAgICAgIGlmICh0aGlzLm1lc3NhZ2VzLmhhcyhtZXNzYWdlKSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlRWxlbWVudCA9IHRoaXMubWVzc2FnZXMuZ2V0KG1lc3NhZ2UpXG4gICAgICAgIGlmIChtZXNzYWdlRWxlbWVudC5zdGF0dXMpIHRoaXMudmlzaWJsZU1lc3NhZ2VzLS1cbiAgICAgICAgdGhpcy5tZXNzYWdlc0VsZW1lbnQucmVtb3ZlQ2hpbGQobWVzc2FnZUVsZW1lbnQpXG4gICAgICAgIHRoaXMubWVzc2FnZXMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldFZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaWJpbGl0eVxuICB9XG4gIHVwZGF0ZVZpc2liaWxpdHkoKSB7XG4gICAgdGhpcy52aXNpYmlsaXR5ID0gdGhpcy5jb25maWdWaXNpYmlsaXR5ICYmIHRoaXMucGFuZVZpc2liaWxpdHkgJiYgdGhpcy52aXNpYmxlTWVzc2FnZXMgPiAwXG5cbiAgICBpZiAodGhpcy52aXNpYmlsaXR5KSB7XG4gICAgICB0aGlzLnBhbmVsLnNob3coKVxuICAgICAgdGhpcy51cGRhdGVIZWlnaHQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhbmVsLmhpZGUoKVxuICAgIH1cbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLm1lc3NhZ2VzLmNsZWFyKClcbiAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/Kamilius/.atom/packages/linter/lib/ui/bottom-panel.js
