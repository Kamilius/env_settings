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
    this.editorMessages = new Map();

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
        Validate.messages(messages);
      } catch (e) {
        return Helpers.error(e);
      }
      messages = messages.filter(function (i) {
        return _this2.ignoredMessageTypes.indexOf(i.type) === -1;
      });
      if (linter.scope === 'file') {
        if (!editor.alive) return;
        if (!(editor instanceof _atom.TextEditor)) throw new Error("Given editor isn't really an editor");
        if (!this.editorMessages.has(editor)) this.editorMessages.set(editor, new Map());
        this.editorMessages.get(editor).set(linter, messages);
      } else {
        // It's project
        this.linterResponses.set(linter, messages);
      }
      this.hasChanged = true;
    }
  }, {
    key: 'updatePublic',
    value: function updatePublic() {
      var publicMessages = [];
      var added = [];
      var removed = [];
      var currentKeys = undefined;
      var lastKeys = undefined;

      this.linterResponses.forEach(function (messages) {
        return publicMessages = publicMessages.concat(messages);
      });
      this.editorMessages.forEach(function (editorMessages) {
        return editorMessages.forEach(function (messages) {
          return publicMessages = publicMessages.concat(messages);
        });
      });

      currentKeys = publicMessages.map(function (i) {
        return i.key;
      });
      lastKeys = this.publicMessages.map(function (i) {
        return i.key;
      });

      publicMessages.forEach(function (i) {
        if (lastKeys.indexOf(i.key) === -1) added.push(i);
      });
      this.publicMessages.forEach(function (i) {
        if (currentKeys.indexOf(i.key) === -1) removed.push(i);
      });
      this.publicMessages = publicMessages;
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
        this.editorMessages.forEach(function (r) {
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
      if (!this.editorMessages.has(editor)) return;
      this.editorMessages['delete'](editor);
      this.hasChanged = true;
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.shouldRefresh = false;
      this.subscriptions.dispose();
      this.linterResponses.clear();
      this.editorMessages.clear();
    }
  }]);

  return MessageRegistry;
})();

module.exports = MessageRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFDdUQsTUFBTTs7QUFEN0QsV0FBVyxDQUFBOztBQUdYLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN0QyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7O0lBRTlCLGVBQWU7QUFDUixXQURQLGVBQWUsR0FDTDs7OzBCQURWLGVBQWU7O0FBRWpCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsVUFWSSxtQkFBbUIsRUFVRSxDQUFBO0FBQzlDLFFBQUksQ0FBQyxPQUFPLEdBQUcsVUFYWCxPQUFPLEVBV2lCLENBQUE7QUFDNUIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7QUFFL0IsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLFVBQUEsS0FBSzthQUFJLE1BQUssbUJBQW1CLEdBQUksS0FBSyxJQUFJLEVBQUUsQUFBQztLQUFBLENBQUMsQ0FBQyxDQUFBOztBQUU1SCxRQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLEdBQVM7QUFDM0IsVUFBSSxNQUFLLGFBQWEsRUFBRTtBQUN0QixZQUFJLE1BQUssVUFBVSxFQUFFO0FBQ25CLGdCQUFLLFVBQVUsR0FBRyxLQUFLLENBQUE7QUFDdkIsZ0JBQUssWUFBWSxFQUFFLENBQUE7U0FDcEI7QUFDRCxlQUFPLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUE7T0FDM0M7S0FDRixDQUFBO0FBQ0QsV0FBTyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFBO0dBQzNDOztlQXZCRyxlQUFlOztXQXdCaEIsYUFBQyxJQUEwQixFQUFFOzs7VUFBM0IsTUFBTSxHQUFQLElBQTBCLENBQXpCLE1BQU07VUFBRSxRQUFRLEdBQWpCLElBQTBCLENBQWpCLFFBQVE7VUFBRSxNQUFNLEdBQXpCLElBQTBCLENBQVAsTUFBTTs7QUFDM0IsVUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLE9BQU07QUFDOUIsVUFBSTtBQUNGLGdCQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQzVCLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFBRSxlQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FBRTtBQUN2QyxjQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7ZUFBSSxPQUFLLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFBO0FBQ2hGLFVBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxNQUFNLEVBQUU7QUFDM0IsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTTtBQUN6QixZQUFJLEVBQUUsTUFBTSxrQkFyQ0QsVUFBVSxDQXFDYSxBQUFDLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO0FBQzNGLFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFDbEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQTtBQUM1QyxZQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO09BQ3RELE1BQU07O0FBQ0wsWUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO09BQzNDO0FBQ0QsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7S0FDdkI7OztXQUNXLHdCQUFHO0FBQ2IsVUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3ZCLFVBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQTtBQUNkLFVBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQTtBQUNoQixVQUFJLFdBQVcsWUFBQSxDQUFBO0FBQ2YsVUFBSSxRQUFRLFlBQUEsQ0FBQTs7QUFFWixVQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFFBQVE7ZUFBSSxjQUFjLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7T0FBQSxDQUFDLENBQUE7QUFDMUYsVUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQSxjQUFjO2VBQ3hDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQSxRQUFRO2lCQUFJLGNBQWMsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztTQUFBLENBQUM7T0FBQSxDQUNyRixDQUFBOztBQUVELGlCQUFXLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7ZUFBSSxDQUFDLENBQUMsR0FBRztPQUFBLENBQUMsQ0FBQTtBQUM1QyxjQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2VBQUksQ0FBQyxDQUFDLEdBQUc7T0FBQSxDQUFDLENBQUE7O0FBRTlDLG9CQUFjLENBQUMsT0FBTyxDQUFDLFVBQVMsQ0FBQyxFQUFFO0FBQ2pDLFlBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQ2hDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDaEIsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBUyxDQUFDLEVBQUU7QUFDdEMsWUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUNsQixDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQTtBQUNwQyxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFDLEtBQUssRUFBTCxLQUFLLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFDLENBQUMsQ0FBQTtLQUNyRjs7O1dBQ2tCLDZCQUFDLFFBQVEsRUFBRTtBQUM1QixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3hEOzs7V0FDYSx3QkFBQyxNQUFNLEVBQUU7QUFDckIsVUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLE1BQU0sRUFBRTtBQUMzQixZQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7aUJBQUksQ0FBQyxVQUFPLENBQUMsTUFBTSxDQUFDO1NBQUEsQ0FBQyxDQUFBO0FBQ2xELFlBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO09BQ3ZCLE1BQU0sSUFBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMxQyxZQUFJLENBQUMsZUFBZSxVQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbkMsWUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7T0FDdkI7S0FDRjs7O1dBQ21CLDhCQUFDLE1BQU0sRUFBRTtBQUMzQixVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTTtBQUM1QyxVQUFJLENBQUMsY0FBYyxVQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbEMsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7S0FDdkI7OztXQUNTLHNCQUFHO0FBQ1gsVUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUE7QUFDMUIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDNUI7OztTQXpGRyxlQUFlOzs7QUE0RnJCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuaW1wb3J0IHtFbWl0dGVyLCBUZXh0RWRpdG9yLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuXG5jb25zdCBWYWxpZGF0ZSA9IHJlcXVpcmUoJy4vdmFsaWRhdGUnKVxuY29uc3QgSGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVycycpXG5cbmNsYXNzIE1lc3NhZ2VSZWdpc3RyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaGFzQ2hhbmdlZCA9IGZhbHNlXG4gICAgdGhpcy5zaG91bGRSZWZyZXNoID0gdHJ1ZVxuICAgIHRoaXMucHVibGljTWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMgPSBuZXcgTWFwKClcbiAgICB0aGlzLmVkaXRvck1lc3NhZ2VzID0gbmV3IE1hcCgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5pZ25vcmVkTWVzc2FnZVR5cGVzJywgdmFsdWUgPT4gdGhpcy5pZ25vcmVkTWVzc2FnZVR5cGVzID0gKHZhbHVlIHx8IFtdKSkpXG5cbiAgICBjb25zdCBVcGRhdGVNZXNzYWdlcyA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnNob3VsZFJlZnJlc2gpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQ2hhbmdlZCkge1xuICAgICAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IGZhbHNlXG4gICAgICAgICAgdGhpcy51cGRhdGVQdWJsaWMoKVxuICAgICAgICB9XG4gICAgICAgIEhlbHBlcnMucmVxdWVzdFVwZGF0ZUZyYW1lKFVwZGF0ZU1lc3NhZ2VzKVxuICAgICAgfVxuICAgIH1cbiAgICBIZWxwZXJzLnJlcXVlc3RVcGRhdGVGcmFtZShVcGRhdGVNZXNzYWdlcylcbiAgfVxuICBzZXQoe2xpbnRlciwgbWVzc2FnZXMsIGVkaXRvcn0pIHtcbiAgICBpZiAobGludGVyLmRlYWN0aXZhdGVkKSByZXR1cm5cbiAgICB0cnkge1xuICAgICAgVmFsaWRhdGUubWVzc2FnZXMobWVzc2FnZXMpXG4gICAgfSBjYXRjaCAoZSkgeyByZXR1cm4gSGVscGVycy5lcnJvcihlKSB9XG4gICAgbWVzc2FnZXMgPSBtZXNzYWdlcy5maWx0ZXIoaSA9PiB0aGlzLmlnbm9yZWRNZXNzYWdlVHlwZXMuaW5kZXhPZihpLnR5cGUpID09PSAtMSlcbiAgICBpZiAobGludGVyLnNjb3BlID09PSAnZmlsZScpIHtcbiAgICAgIGlmICghZWRpdG9yLmFsaXZlKSByZXR1cm5cbiAgICAgIGlmICghKGVkaXRvciBpbnN0YW5jZW9mIFRleHRFZGl0b3IpKSB0aHJvdyBuZXcgRXJyb3IoXCJHaXZlbiBlZGl0b3IgaXNuJ3QgcmVhbGx5IGFuIGVkaXRvclwiKVxuICAgICAgaWYgKCF0aGlzLmVkaXRvck1lc3NhZ2VzLmhhcyhlZGl0b3IpKVxuICAgICAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLnNldChlZGl0b3IsIG5ldyBNYXAoKSlcbiAgICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZ2V0KGVkaXRvcikuc2V0KGxpbnRlciwgbWVzc2FnZXMpXG4gICAgfSBlbHNlIHsgLy8gSXQncyBwcm9qZWN0XG4gICAgICB0aGlzLmxpbnRlclJlc3BvbnNlcy5zZXQobGludGVyLCBtZXNzYWdlcylcbiAgICB9XG4gICAgdGhpcy5oYXNDaGFuZ2VkID0gdHJ1ZVxuICB9XG4gIHVwZGF0ZVB1YmxpYygpIHtcbiAgICBsZXQgcHVibGljTWVzc2FnZXMgPSBbXVxuICAgIGxldCBhZGRlZCA9IFtdXG4gICAgbGV0IHJlbW92ZWQgPSBbXVxuICAgIGxldCBjdXJyZW50S2V5c1xuICAgIGxldCBsYXN0S2V5c1xuXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMuZm9yRWFjaChtZXNzYWdlcyA9PiBwdWJsaWNNZXNzYWdlcyA9IHB1YmxpY01lc3NhZ2VzLmNvbmNhdChtZXNzYWdlcykpXG4gICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5mb3JFYWNoKGVkaXRvck1lc3NhZ2VzID0+XG4gICAgICBlZGl0b3JNZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2VzID0+IHB1YmxpY01lc3NhZ2VzID0gcHVibGljTWVzc2FnZXMuY29uY2F0KG1lc3NhZ2VzKSlcbiAgICApXG5cbiAgICBjdXJyZW50S2V5cyA9IHB1YmxpY01lc3NhZ2VzLm1hcChpID0+IGkua2V5KVxuICAgIGxhc3RLZXlzID0gdGhpcy5wdWJsaWNNZXNzYWdlcy5tYXAoaSA9PiBpLmtleSlcblxuICAgIHB1YmxpY01lc3NhZ2VzLmZvckVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgaWYgKGxhc3RLZXlzLmluZGV4T2YoaS5rZXkpID09PSAtMSlcbiAgICAgICAgYWRkZWQucHVzaChpKVxuICAgIH0pXG4gICAgdGhpcy5wdWJsaWNNZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgIGlmIChjdXJyZW50S2V5cy5pbmRleE9mKGkua2V5KSA9PT0gLTEpXG4gICAgICAgIHJlbW92ZWQucHVzaChpKVxuICAgIH0pXG4gICAgdGhpcy5wdWJsaWNNZXNzYWdlcyA9IHB1YmxpY01lc3NhZ2VzXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCB7YWRkZWQsIHJlbW92ZWQsIG1lc3NhZ2VzOiBwdWJsaWNNZXNzYWdlc30pXG4gIH1cbiAgb25EaWRVcGRhdGVNZXNzYWdlcyhjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuICBkZWxldGVNZXNzYWdlcyhsaW50ZXIpIHtcbiAgICBpZiAobGludGVyLnNjb3BlID09PSAnZmlsZScpIHtcbiAgICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZm9yRWFjaChyID0+IHIuZGVsZXRlKGxpbnRlcikpXG4gICAgICB0aGlzLmhhc0NoYW5nZWQgPSB0cnVlXG4gICAgfSBlbHNlIGlmKHRoaXMubGludGVyUmVzcG9uc2VzLmhhcyhsaW50ZXIpKSB7XG4gICAgICB0aGlzLmxpbnRlclJlc3BvbnNlcy5kZWxldGUobGludGVyKVxuICAgICAgdGhpcy5oYXNDaGFuZ2VkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkZWxldGVFZGl0b3JNZXNzYWdlcyhlZGl0b3IpIHtcbiAgICBpZiAoIXRoaXMuZWRpdG9yTWVzc2FnZXMuaGFzKGVkaXRvcikpIHJldHVyblxuICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZGVsZXRlKGVkaXRvcilcbiAgICB0aGlzLmhhc0NoYW5nZWQgPSB0cnVlXG4gIH1cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnNob3VsZFJlZnJlc2ggPSBmYWxzZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLmxpbnRlclJlc3BvbnNlcy5jbGVhcigpXG4gICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5jbGVhcigpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlUmVnaXN0cnlcbiJdfQ==