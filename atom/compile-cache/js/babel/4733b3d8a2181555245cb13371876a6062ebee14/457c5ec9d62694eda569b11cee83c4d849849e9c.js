var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var Validate = require('./validate');
var Helpers = require('./helpers');

var MessageRegistry = (function () {
  function MessageRegistry() {
    var _this = this;

    _classCallCheck(this, MessageRegistry);

    this.hasChanged = false;
    this.shouldRefresh = true;
    this.publicMessages = [];
    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.linterResponses = new Map();
    // We track messages by the underlying TextBuffer the lint was run against
    // rather than the TextEditor because there may be multiple TextEditors per
    // TextBuffer when multiple panes are in use.  For each buffer, we store a
    // map whose values are messages and whose keys are the linter that produced
    // the messages.  (Note that we are talking about linter instances, not
    // EditorLinter instances.  EditorLinter instances are per-TextEditor and
    // could result in duplicated sets of messages.)
    this.bufferMessages = new Map();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter.ignoredMessageTypes', function (value) {
      return _this.ignoredMessageTypes = value || [];
    }));

    var UpdateMessages = function UpdateMessages() {
      if (_this.shouldRefresh) {
        if (_this.hasChanged) {
          _this.hasChanged = false;
          _this.updatePublic();
        }
        Helpers.requestUpdateFrame(UpdateMessages);
      }
    };
    Helpers.requestUpdateFrame(UpdateMessages);
  }

  _createClass(MessageRegistry, [{
    key: 'set',
    value: function set(_ref) {
      var _this2 = this;

      var linter = _ref.linter;
      var messages = _ref.messages;
      var editor = _ref.editor;

      if (linter.deactivated) return;
      try {
        Validate.messages(messages, linter);
      } catch (e) {
        return Helpers.error(e);
      }
      messages = messages.filter(function (i) {
        return _this2.ignoredMessageTypes.indexOf(i.type) === -1;
      });
      if (linter.scope === 'file') {
        if (!editor.alive) return;
        if (!(editor instanceof _atom.TextEditor)) throw new Error("Given editor isn't really an editor");
        var buffer = editor.getBuffer();
        if (!this.bufferMessages.has(buffer)) this.bufferMessages.set(buffer, new Map());
        this.bufferMessages.get(buffer).set(linter, messages);
      } else {
        // It's project
        this.linterResponses.set(linter, messages);
      }
      this.hasChanged = true;
    }
  }, {
    key: 'updatePublic',
    value: function updatePublic() {
      var latestMessages = [];
      var publicMessages = [];
      var added = [];
      var removed = [];
      var currentKeys = undefined;
      var lastKeys = undefined;

      this.linterResponses.forEach(function (messages) {
        return latestMessages = latestMessages.concat(messages);
      });
      this.bufferMessages.forEach(function (bufferMessages) {
        return bufferMessages.forEach(function (messages) {
          return latestMessages = latestMessages.concat(messages);
        });
      });

      currentKeys = latestMessages.map(function (i) {
        return i.key;
      });
      lastKeys = this.publicMessages.map(function (i) {
        return i.key;
      });

      for (var i of latestMessages) {
        if (lastKeys.indexOf(i.key) === -1) {
          added.push(i);
          publicMessages.push(i);
        }
      }

      for (var i of this.publicMessages) {
        if (currentKeys.indexOf(i.key) === -1) removed.push(i);else publicMessages.push(i);
      }this.publicMessages = publicMessages;
      this.emitter.emit('did-update-messages', { added: added, removed: removed, messages: publicMessages });
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'deleteMessages',
    value: function deleteMessages(linter) {
      if (linter.scope === 'file') {
        this.bufferMessages.forEach(function (r) {
          return r['delete'](linter);
        });
        this.hasChanged = true;
      } else if (this.linterResponses.has(linter)) {
        this.linterResponses['delete'](linter);
        this.hasChanged = true;
      }
    }
  }, {
    key: 'deleteEditorMessages',
    value: function deleteEditorMessages(editor) {
      // Caveat: in the event that there are multiple TextEditor instances open
      // referring to the same underlying buffer and those instances are not also
      // closed, the linting results for this buffer will be temporarily removed
      // until such time as a lint is re-triggered by one of the other
      // corresponding EditorLinter instances.  There are ways to mitigate this,
      // but they all involve some complexity that does not yet seem justified.
      var buffer = editor.getBuffer();
      if (!this.bufferMessages.has(buffer)) return;
      this.bufferMessages['delete'](buffer);
      this.hasChanged = true;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.shouldRefresh = false;
      this.subscriptions.dispose();
      this.linterResponses.clear();
      this.bufferMessages.clear();
    }
  }]);

  return MessageRegistry;
})();

module.exports = MessageRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFDdUQsTUFBTTs7QUFEN0QsV0FBVyxDQUFBOztBQUdYLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN0QyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7O0lBRTlCLGVBQWU7QUFDUixXQURQLGVBQWUsR0FDTDs7OzBCQURWLGVBQWU7O0FBRWpCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7Ozs7Ozs7QUFRaEMsUUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUUvQixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNEJBQTRCLEVBQUUsVUFBQSxLQUFLO2FBQUksTUFBSyxtQkFBbUIsR0FBSSxLQUFLLElBQUksRUFBRSxBQUFDO0tBQUEsQ0FBQyxDQUFDLENBQUE7O0FBRTVILFFBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWMsR0FBUztBQUMzQixVQUFJLE1BQUssYUFBYSxFQUFFO0FBQ3RCLFlBQUksTUFBSyxVQUFVLEVBQUU7QUFDbkIsZ0JBQUssVUFBVSxHQUFHLEtBQUssQ0FBQTtB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QUMsVUFBVSxHQUFHLElBQUksQ0FBQTtPQUN2QjtLQUNGOzs7V0FDbUIsOEJBQUMsTUFBTSxFQUFFOzs7Ozs7O0FBTzNCLFVBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQyxVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTTtBQUM1QyxVQUFJLENBQUMsY0FBYyxVQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbEMsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7S0FDdkI7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUE7QUFDMUIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDNUI7OztTQTlHRyxlQUFlOzs7QUFpSHJCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuaW1wb3J0IHtFbWl0dGVyLCBUZXh0RWRpdG9yLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuXG5jb25zdCBWYWxpZGF0ZSA9IHJlcXVpcmUoJy4vdmFsaWRhdGUnKVxuY29uc3QgSGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpXG5cbmNsYXNzIE1lc3NhZ2VSZWdpc3RyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaGFzQ2hhbmdlZCA9IGZhbHNlXG4gICAgdGhpcy5zaG91bGRSZWZyZXNoID0gdHJ1ZVxuICAgIHRoaXMucHVibGljTWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMgPSBuZXcgTWFwKClcbiAgICAvLyBXZSB0cmFjayBtZXNzYWdlcyBieSB0aGUgdW5kZXJseWluZyBUZXh0QnVmZmVyIHRoZSBsaW50IHdhcyBydW4gYWdhaW5zdFxuICAgIC8vIHJhdGhlciB0aGFuIHRoZSBUZXh0RWRpdG9yIGJlY2F1c2UgdGhlcmUgbWF5IGJlIG11bHRpcGxlIFRleHRFZGl0b3JzIHBlclxuICAgIC8vIFRleHRCdWZmZXIgd2hlbiBtdWx0aXBsZSBwYW5lcyBhcmUgaW4gdXNlLiAgRm9yIGVhY2ggYnVmZmVyLCB3ZSBzdG9yZSBhXG4gICAgLy8gbWFwIHdob3NlIHZhbHVlcyBhcmUgbWVzc2FnZXMgYW5kIHdob3NlIGtleXMgYXJlIHRoZSBsaW50ZXIgdGhhdCBwcm9kdWNlZFxuICAgIC8vIHRoZSBtZXNzYWdlcy4gIChOb3RlIHRoYXQgd2UgYXJlIHRhbGtpbmcgYWJvdXQgbGludGVyIGluc3RhbmNlcywgbm90XG4gICAgLy8gRWRpdG9yTGludGVyIGluc3RhbmNlcy4gIEVkaXRvckxpbnRlciBpbnN0YW5jZXMgYXJlIHBlci1UZXh0RWRpdG9yIGFuZFxuICAgIC8vIGNvdWxkIHJlc3VsdCBpbiBkdXBsaWNhdGVkIHNldHMgb2YgbWVzc2FnZXMuKVxuICAgIHRoaXMuYnVmZmVyTWVzc2FnZXMgPSBuZXcgTWFwKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmlnbm9yZWRNZXNzYWdlVHlwZXMnLCB2YWx1ZSA9PiB0aGlzLmlnbm9yZWRNZXNzYWdlVHlwZXMgPSAodmFsdWUgfHwgW10pKSlcblxuICAgIGNvbnN0IFVwZGF0ZU1lc3NhZ2VzID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2hvdWxkUmVmcmVzaCkge1xuICAgICAgICBpZiAodGhpcy5oYXNDaGFuZ2VkKSB7XG4gICAgICAgICAgdGhpcy5oYXNDaGFuZ2VkID0gZmFsc2VcbiAgICAgICAgICB0aGlzLnVwZGF0ZVB1YmxpYygpXG4gICAgICAgIH1cbiAgICAgICAgSGVscGVycy5yZXF1ZXN0VXBkYXRlRnJhbWUoVXBkYXRlTWVzc2FnZXMpXG4gICAgICB9XG4gICAgfVxuICAgIEhlbHBlcnMucmVxdWVzdFVwZGF0ZUZyYW1lKFVwZGF0ZU1lc3NhZ2VzKVxuICB9XG4gIHNldCh7bGludGVyLCBtZXNzYWdlcywgZWRpdG9yfSkge1xuICAgIGlmIChsaW50ZXIuZGVhY3RpdmF0ZWQpIHJldHVyblxuICAgIHRyeSB7XG4gICAgICBWYWxpZGF0ZS5tZXNzYWdlcyhtZXNzYWdlcywgbGludGVyKVxuICAgIH0gY2F0Y2ggKGUpIHsgcmV0dXJuIEhlbHBlcnMuZXJyb3IoZSkgfVxuICAgIG1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKGkgPT4gdGhpcy5pZ25vcmVkTWVzc2FnZVR5cGVzLmluZGV4T2YoaS50eXBlKSA9PT0gLTEpXG4gICAgaWYgKGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICBpZiAoIWVkaXRvci5hbGl2ZSkgcmV0dXJuXG4gICAgICBpZiAoIShlZGl0b3IgaW5zdGFuY2VvZiBUZXh0RWRpdG9yKSkgdGhyb3cgbmV3IEVycm9yKFwiR2l2ZW4gZWRpdG9yIGlzbid0IHJlYWxseSBhbiBlZGl0b3JcIilcbiAgICAgIGxldCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgIGlmICghdGhpcy5idWZmZXJNZXNzYWdlcy5oYXMoYnVmZmVyKSlcbiAgICAgICAgdGhpcy5idWZmZXJNZXNzYWdlcy5zZXQoYnVmZmVyLCBuZXcgTWFwKCkpXG4gICAgICB0aGlzLmJ1ZmZlck1lc3NhZ2VzLmdldChidWZmZXIpLnNldChsaW50ZXIsIG1lc3NhZ2VzKVxuICAgIH0gZWxzZSB7IC8vIEl0J3MgcHJvamVjdFxuICAgICAgdGhpcy5saW50ZXJSZXNwb25zZXMuc2V0KGxpbnRlciwgbWVzc2FnZXMpXG4gICAgfVxuICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgfVxuICB1cGRhdGVQdWJsaWMoKSB7XG4gICAgbGV0IGxhdGVzdE1lc3NhZ2VzID0gW11cbiAgICBsZXQgcHVibGljTWVzc2FnZXMgPSBbXVxuICAgIGxldCBhZGRlZCA9IFtdXG4gICAgbGV0IHJlbW92ZWQgPSBbXVxuICAgIGxldCBjdXJyZW50S2V5c1xuICAgIGxldCBsYXN0S2V5c1xuXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMuZm9yRWFjaChtZXNzYWdlcyA9PiBsYXRlc3RNZXNzYWdlcyA9IGxhdGVzdE1lc3NhZ2VzLmNvbmNhdChtZXNzYWdlcykpXG4gICAgdGhpcy5idWZmZXJNZXNzYWdlcy5mb3JFYWNoKGJ1ZmZlck1lc3NhZ2VzID0+XG4gICAgICBidWZmZXJNZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2VzID0+IGxhdGVzdE1lc3NhZ2VzID0gbGF0ZXN0TWVzc2FnZXMuY29uY2F0KG1lc3NhZ2VzKSlcbiAgICApXG5cbiAgICBjdXJyZW50S2V5cyA9IGxhdGVzdE1lc3NhZ2VzLm1hcChpID0+IGkua2V5KVxuICAgIGxhc3RLZXlzID0gdGhpcy5wdWJsaWNNZXNzYWdlcy5tYXAoaSA9PiBpLmtleSlcblxuICAgIGZvciAobGV0IGkgb2YgbGF0ZXN0TWVzc2FnZXMpIHtcbiAgICAgIGlmIChsYXN0S2V5cy5pbmRleE9mKGkua2V5KSA9PT0gLTEpIHtcbiAgICAgICAgYWRkZWQucHVzaChpKVxuICAgICAgICBwdWJsaWNNZXNzYWdlcy5wdXNoKGkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSBvZiB0aGlzLnB1YmxpY01lc3NhZ2VzKVxuICAgICAgaWYgKGN1cnJlbnRLZXlzLmluZGV4T2YoaS5rZXkpID09PSAtMSlcbiAgICAgICAgcmVtb3ZlZC5wdXNoKGkpXG4gICAgICBlbHNlXG4gICAgICAgIHB1YmxpY01lc3NhZ2VzLnB1c2goaSlcblxuICAgIHRoaXMucHVibGljTWVzc2FnZXMgPSBwdWJsaWNNZXNzYWdlc1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywge2FkZGVkLCByZW1vdmVkLCBtZXNzYWdlczogcHVibGljTWVzc2FnZXN9KVxuICB9XG4gIG9uRGlkVXBkYXRlTWVzc2FnZXMoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cbiAgZGVsZXRlTWVzc2FnZXMobGludGVyKSB7XG4gICAgaWYgKGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICB0aGlzLmJ1ZmZlck1lc3NhZ2VzLmZvckVhY2gociA9PiByLmRlbGV0ZShsaW50ZXIpKVxuICAgICAgdGhpcy5oYXNDaGFuZ2VkID0gdHJ1ZVxuICAgIH0gZWxzZSBpZih0aGlzLmxpbnRlclJlc3BvbnNlcy5oYXMobGludGVyKSkge1xuICAgICAgdGhpcy5saW50ZXJSZXNwb25zZXMuZGVsZXRlKGxpbnRlcilcbiAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGVsZXRlRWRpdG9yTWVzc2FnZXMoZWRpdG9yKSB7XG4gICAgLy8gQ2F2ZWF0OiBpbiB0aGUgZXZlbnQgdGhhdCB0aGVyZSBhcmUgbXVsdGlwbGUgVGV4dEVkaXRvciBpbnN0YW5jZXMgb3BlblxuICAgIC8vIHJlZmVycmluZyB0byB0aGUgc2FtZSB1bmRlcmx5aW5nIGJ1ZmZlciBhbmQgdGhvc2UgaW5zdGFuY2VzIGFyZSBub3QgYWxzb1xuICAgIC8vIGNsb3NlZCwgdGhlIGxpbnRpbmcgcmVzdWx0cyBmb3IgdGhpcyBidWZmZXIgd2lsbCBiZSB0ZW1wb3JhcmlseSByZW1vdmVkXG4gICAgLy8gdW50aWwgc3VjaCB0aW1lIGFzIGEgbGludCBpcyByZS10cmlnZ2VyZWQgYnkgb25lIG9mIHRoZSBvdGhlclxuICAgIC8vIGNvcnJlc3BvbmRpbmcgRWRpdG9yTGludGVyIGluc3RhbmNlcy4gIFRoZXJlIGFyZSB3YXlzIHRvIG1pdGlnYXRlIHRoaXMsXG4gICAgLy8gYnV0IHRoZXkgYWxsIGludm9sdmUgc29tZSBjb21wbGV4aXR5IHRoYXQgZG9lcyBub3QgeWV0IHNlZW0ganVzdGlmaWVkLlxuICAgIGxldCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG4gICAgaWYgKCF0aGlzLmJ1ZmZlck1lc3NhZ2VzLmhhcyhidWZmZXIpKSByZXR1cm5cbiAgICB0aGlzLmJ1ZmZlck1lc3NhZ2VzLmRlbGV0ZShidWZmZXIpXG4gICAgdGhpcy5oYXNDaGFuZ2VkID0gdHJ1ZVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zaG91bGRSZWZyZXNoID0gZmFsc2VcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMuY2xlYXIoKVxuICAgIHRoaXMuYnVmZmVyTWVzc2FnZXMuY2xlYXIoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZVJlZ2lzdHJ5XG4iXX0=
//# sourceURL=/Users/Kamilius/.atom/packages/linter/lib/message-registry.js
