Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var EditorLinter = (function () {
  function EditorLinter(editor) {
    var _this = this;

    _classCallCheck(this, EditorLinter);

    if (!(editor instanceof _atom.TextEditor)) {
      throw new Error('Given editor is not really an editor');
    }

    this.editor = editor;
    this.emitter = new _atom.Emitter();
    this.messages = new Set();
    this.markers = new WeakMap();
    this.gutter = null;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter.underlineIssues', function (underlineIssues) {
      return _this.underlineIssues = underlineIssues;
    }));
    this.subscriptions.add(this.editor.onDidDestroy(function () {
      return _this.dispose();
    }));
    this.subscriptions.add(this.editor.onDidSave(function () {
      return _this.emitter.emit('should-lint', false);
    }));
    this.subscriptions.add(this.editor.onDidChangeCursorPosition(function (_ref) {
      var oldBufferPosition = _ref.oldBufferPosition;
      var newBufferPosition = _ref.newBufferPosition;

      if (newBufferPosition.row !== oldBufferPosition.row) {
        _this.emitter.emit('should-update-line-messages');
      }
      _this.emitter.emit('should-update-bubble');
    }));
    this.subscriptions.add(atom.config.observe('linter.gutterEnabled', function (gutterEnabled) {
      _this.gutterEnabled = gutterEnabled;
      _this.handleGutter();
    }));
    // Using onDidChange instead of observe here 'cause the same function is invoked above
    this.subscriptions.add(atom.config.onDidChange('linter.gutterPosition', function () {
      return _this.handleGutter();
    }));
    this.subscriptions.add(this.onDidMessageAdd(function (message) {
      if (!_this.underlineIssues && !_this.gutterEnabled) {
        return; // No-Op
      }
      var marker = _this.editor.markBufferRange(message.range, { invalidate: 'inside' });
      _this.markers.set(message, marker);
      if (_this.underlineIssues) {
        _this.editor.decorateMarker(marker, {
          type: 'highlight',
          'class': 'linter-highlight ' + message['class']
        });
      }
      if (_this.gutterEnabled) {
        var item = document.createElement('span');
        item.className = 'linter-gutter linter-highlight ' + message['class'];
        _this.gutter.decorateMarker(marker, {
          'class': 'linter-row',
          item: item
        });
      }
    }));
    this.subscriptions.add(this.onDidMessageDelete(function (message) {
      if (_this.markers.has(message)) {
        _this.markers.get(message).destroy();
        _this.markers['delete'](message);
      }
    }));

    // Atom invokes the onDidStopChanging callback immediately on Editor creation. So we wait a moment
    setImmediate(function () {
      _this.subscriptions.add(_this.editor.onDidStopChanging(function () {
        return _this.emitter.emit('should-lint', true);
      }));
    });
  }

  _createClass(EditorLinter, [{
    key: 'handleGutter',
    value: function handleGutter() {
      if (this.gutter !== null) {
        this.removeGutter();
      }
      if (this.gutterEnabled) {
        this.addGutter();
      }
    }
  }, {
    key: 'addGutter',
    value: function addGutter() {
      var position = atom.config.get('linter.gutterPosition');
      this.gutter = this.editor.addGutter({
        name: 'linter',
        priority: position === 'Left' ? -100 : 100
      });
    }
  }, {
    key: 'removeGutter',
    value: function removeGutter() {
      if (this.gutter !== null) {
        try {
          this.gutter.destroy();
          // Atom throws when we try to remove a gutter container from a closed text editor
        } catch (err) {}
        this.gutter = null;
      }
    }
  }, {
    key: 'getMessages',
    value: function getMessages() {
      return this.messages;
    }
  }, {
    key: 'addMessage',
    value: function addMessage(message) {
      if (!this.messages.has(message)) {
        this.messages.add(message);
        this.emitter.emit('did-message-add', message);
        this.emitter.emit('did-message-change', { message: message, type: 'add' });
      }
    }
  }, {
    key: 'deleteMessage',
    value: function deleteMessage(message) {
      if (this.messages.has(message)) {
        this.messages['delete'](message);
        this.emitter.emit('did-message-delete', message);
        this.emitter.emit('did-message-change', { message: message, type: 'delete' });
      }
    }
  }, {
    key: 'lint',
    value: function lint() {
      var onChange = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.emitter.emit('should-lint', onChange);
    }
  }, {
    key: 'onDidMessageAdd',
    value: function onDidMessageAdd(callback) {
      return this.emitter.on('did-message-add', callback);
    }
  }, {
    key: 'onDidMessageDelete',
    value: function onDidMessageDelete(callback) {
      return this.emitter.on('did-message-delete', callback);
    }
  }, {
    key: 'onDidMessageChange',
    value: function onDidMessageChange(callback) {
      return this.emitter.on('did-message-change', callback);
    }
  }, {
    key: 'onShouldUpdateBubble',
    value: function onShouldUpdateBubble(callback) {
      return this.emitter.on('should-update-bubble', callback);
    }
  }, {
    key: 'onShouldUpdateLineMessages',
    value: function onShouldUpdateLineMessages(callback) {
      return this.emitter.on('should-update-line-messages', callback);
    }
  }, {
    key: 'onShouldLint',
    value: function onShouldLint(callback) {
      return this.emitter.on('should-lint', callback);
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      if (this.markers.size) {
        this.markers.forEach(function (marker) {
          return marker.destroy();
        });
        this.markers.clear();
      }
      this.removeGutter();
      this.subscriptions.dispose();
      this.messages.clear();
      this.emitter.dispose();
    }
  }]);

  return EditorLinter;
})();

exports['default'] = EditorLinter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2VkaXRvci1saW50ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRXVELE1BQU07O0FBRjdELFdBQVcsQ0FBQTs7SUFHVSxZQUFZO0FBQ3BCLFdBRFEsWUFBWSxDQUNuQixNQUFNLEVBQUU7OzswQkFERCxZQUFZOztBQUU3QixRQUFJLEVBQUUsTUFBTSw2QkFBc0IsQUFBQyxFQUFFO0FBQ25DLFlBQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtLQUN4RDs7QUFFRCxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUNwQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQTtBQUM1QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF1QixDQUFBOztBQUU1QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxVQUFBLGVBQWU7YUFDbEYsTUFBSyxlQUFlLEdBQUcsZUFBZTtLQUFBLENBQ3ZDLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2FBQzlDLE1BQUssT0FBTyxFQUFFO0tBQUEsQ0FDZixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzthQUMzQyxNQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQztLQUFBLENBQ3hDLENB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QVEsRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNoRDs7O1dBRVcsc0JBQUMsUUFBUSxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDckIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNO2lCQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7U0FBQSxDQUFDLENBQUE7QUFDaEQsWUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtPQUNyQjtBQUNELFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtBQUNuQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDckIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUN2Qjs7O1NBaktrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiIvVXNlcnMvS2FtaWxpdXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9lZGl0b3ItbGludGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtUZXh0RWRpdG9yLCBFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdG9yTGludGVyIHtcbiAgY29uc3RydWN0b3IoZWRpdG9yKSB7XG4gICAgaWYgKCEoZWRpdG9yIGluc3RhbmNlb2YgVGV4dEVkaXRvcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignR2l2ZW4gZWRpdG9yIGlzIG5vdCByZWFsbHkgYW4gZWRpdG9yJylcbiAgICB9XG5cbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvclxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IFNldCgpXG4gICAgdGhpcy5tYXJrZXJzID0gbmV3IFdlYWtNYXAoKVxuICAgIHRoaXMuZ3V0dGVyID0gbnVsbFxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci51bmRlcmxpbmVJc3N1ZXMnLCB1bmRlcmxpbmVJc3N1ZXMgPT5cbiAgICAgIHRoaXMudW5kZXJsaW5lSXNzdWVzID0gdW5kZXJsaW5lSXNzdWVzXG4gICAgKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PlxuICAgICAgdGhpcy5kaXNwb3NlKClcbiAgICApKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lZGl0b3Iub25EaWRTYXZlKCgpID0+XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLWxpbnQnLCBmYWxzZSlcbiAgICApKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbigoe29sZEJ1ZmZlclBvc2l0aW9uLCBuZXdCdWZmZXJQb3NpdGlvbn0pID0+IHtcbiAgICAgIGlmIChuZXdCdWZmZXJQb3NpdGlvbi5yb3cgIT09IG9sZEJ1ZmZlclBvc2l0aW9uLnJvdykge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLXVwZGF0ZS1saW5lLW1lc3NhZ2VzJylcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtdXBkYXRlLWJ1YmJsZScpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuZ3V0dGVyRW5hYmxlZCcsIGd1dHRlckVuYWJsZWQgPT4ge1xuICAgICAgdGhpcy5ndXR0ZXJFbmFibGVkID0gZ3V0dGVyRW5hYmxlZFxuICAgICAgdGhpcy5oYW5kbGVHdXR0ZXIoKVxuICAgIH0pKVxuICAgIC8vIFVzaW5nIG9uRGlkQ2hhbmdlIGluc3RlYWQgb2Ygb2JzZXJ2ZSBoZXJlICdjYXVzZSB0aGUgc2FtZSBmdW5jdGlvbiBpcyBpbnZva2VkIGFib3ZlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGludGVyLmd1dHRlclBvc2l0aW9uJywgKCkgPT5cbiAgICAgIHRoaXMuaGFuZGxlR3V0dGVyKClcbiAgICApKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5vbkRpZE1lc3NhZ2VBZGQobWVzc2FnZSA9PiB7XG4gICAgICBpZiAoIXRoaXMudW5kZXJsaW5lSXNzdWVzICYmICF0aGlzLmd1dHRlckVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIC8vIE5vLU9wXG4gICAgICB9XG4gICAgICBjb25zdCBtYXJrZXIgPSB0aGlzLmVkaXRvci5tYXJrQnVmZmVyUmFuZ2UobWVzc2FnZS5yYW5nZSwge2ludmFsaWRhdGU6ICdpbnNpZGUnfSlcbiAgICAgIHRoaXMubWFya2Vycy5zZXQobWVzc2FnZSwgbWFya2VyKVxuICAgICAgaWYgKHRoaXMudW5kZXJsaW5lSXNzdWVzKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICAgIHR5cGU6ICdoaWdobGlnaHQnLFxuICAgICAgICAgIGNsYXNzOiBgbGludGVyLWhpZ2hsaWdodCAke21lc3NhZ2UuY2xhc3N9YFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZ3V0dGVyRW5hYmxlZCkge1xuICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgIGl0ZW0uY2xhc3NOYW1lID0gYGxpbnRlci1ndXR0ZXIgbGludGVyLWhpZ2hsaWdodCAke21lc3NhZ2UuY2xhc3N9YFxuICAgICAgICB0aGlzLmd1dHRlci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgICBjbGFzczogJ2xpbnRlci1yb3cnLFxuICAgICAgICAgIGl0ZW1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMub25EaWRNZXNzYWdlRGVsZXRlKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2Vycy5oYXMobWVzc2FnZSkpIHtcbiAgICAgICAgdGhpcy5tYXJrZXJzLmdldChtZXNzYWdlKS5kZXN0cm95KClcbiAgICAgICAgdGhpcy5tYXJrZXJzLmRlbGV0ZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgLy8gQXRvbSBpbnZva2VzIHRoZSBvbkRpZFN0b3BDaGFuZ2luZyBjYWxsYmFjayBpbW1lZGlhdGVseSBvbiBFZGl0b3IgY3JlYXRpb24uIFNvIHdlIHdhaXQgYSBtb21lbnRcbiAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZygoKSA9PlxuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLWxpbnQnLCB0cnVlKVxuICAgICAgKSlcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlR3V0dGVyKCkge1xuICAgIGlmICh0aGlzLmd1dHRlciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5yZW1vdmVHdXR0ZXIoKVxuICAgIH1cbiAgICBpZiAodGhpcy5ndXR0ZXJFbmFibGVkKSB7XG4gICAgICB0aGlzLmFkZEd1dHRlcigpXG4gICAgfVxuICB9XG5cbiAgYWRkR3V0dGVyKCkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuZ3V0dGVyUG9zaXRpb24nKVxuICAgIHRoaXMuZ3V0dGVyID0gdGhpcy5lZGl0b3IuYWRkR3V0dGVyKHtcbiAgICAgIG5hbWU6ICdsaW50ZXInLFxuICAgICAgcHJpb3JpdHk6IHBvc2l0aW9uID09PSAnTGVmdCcgPyAtMTAwIDogMTAwXG4gICAgfSlcbiAgfVxuXG4gIHJlbW92ZUd1dHRlcigpIHtcbiAgICBpZiAodGhpcy5ndXR0ZXIgIT09IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZ3V0dGVyLmRlc3Ryb3koKVxuICAgICAgICAvLyBBdG9tIHRocm93cyB3aGVuIHdlIHRyeSB0byByZW1vdmUgYSBndXR0ZXIgY29udGFpbmVyIGZyb20gYSBjbG9zZWQgdGV4dCBlZGl0b3JcbiAgICAgIH0gY2F0Y2ggKGVycikge31cbiAgICAgIHRoaXMuZ3V0dGVyID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGdldE1lc3NhZ2VzKCkge1xuICAgIHJldHVybiB0aGlzLm1lc3NhZ2VzXG4gIH1cblxuICBhZGRNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBpZiAoIXRoaXMubWVzc2FnZXMuaGFzKG1lc3NhZ2UpKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzLmFkZChtZXNzYWdlKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1tZXNzYWdlLWFkZCcsIG1lc3NhZ2UpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW1lc3NhZ2UtY2hhbmdlJywge21lc3NhZ2UsIHR5cGU6ICdhZGQnfSlcbiAgICB9XG4gIH1cblxuICBkZWxldGVNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5tZXNzYWdlcy5oYXMobWVzc2FnZSkpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW1lc3NhZ2UtZGVsZXRlJywgbWVzc2FnZSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtbWVzc2FnZS1jaGFuZ2UnLCB7bWVzc2FnZSwgdHlwZTogJ2RlbGV0ZSd9KVxuICAgIH1cbiAgfVxuXG4gIGxpbnQob25DaGFuZ2UgPSBmYWxzZSkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcsIG9uQ2hhbmdlKVxuICB9XG5cbiAgb25EaWRNZXNzYWdlQWRkKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLW1lc3NhZ2UtYWRkJywgY2FsbGJhY2spXG4gIH1cblxuICBvbkRpZE1lc3NhZ2VEZWxldGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtbWVzc2FnZS1kZWxldGUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uRGlkTWVzc2FnZUNoYW5nZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1tZXNzYWdlLWNoYW5nZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgb25TaG91bGRVcGRhdGVCdWJibGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtdXBkYXRlLWJ1YmJsZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgb25TaG91bGRVcGRhdGVMaW5lTWVzc2FnZXMoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtdXBkYXRlLWxpbmUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uU2hvdWxkTGludChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC1saW50JywgY2FsbGJhY2spXG4gIH1cblxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKVxuICAgIGlmICh0aGlzLm1hcmtlcnMuc2l6ZSkge1xuICAgICAgdGhpcy5tYXJrZXJzLmZvckVhY2gobWFya2VyID0+IG1hcmtlci5kZXN0cm95KCkpXG4gICAgICB0aGlzLm1hcmtlcnMuY2xlYXIoKVxuICAgIH1cbiAgICB0aGlzLnJlbW92ZUd1dHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMubWVzc2FnZXMuY2xlYXIoKVxuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKClcbiAgfVxufVxuIl19
//# sourceURL=/Users/Kamilius/.atom/packages/linter/lib/editor-linter.js
