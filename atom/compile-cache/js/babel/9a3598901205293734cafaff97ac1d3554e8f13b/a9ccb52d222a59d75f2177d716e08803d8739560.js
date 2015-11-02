'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewLine = /\r?\n/;

var Message = (function (_HTMLElement) {
  _inherits(Message, _HTMLElement);

  function Message() {
    _classCallCheck(this, Message);

    _get(Object.getPrototypeOf(Message.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Message, [{
    key: 'initialize',
    value: function initialize(message) {
      var includeLink = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      this.message = message;
      this.includeLink = includeLink;
      this.status = false;
      return this;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility(scope) {
      var status = true;
      if (scope === 'Line') status = this.message.currentLine;else if (scope === 'File') status = this.message.currentFile;

      if (this.children.length && this.message.filePath) {
        var link = this.querySelector('.linter-message-link');
        if (link) {
          if (scope === 'Project') {
            link.querySelector('span').removeAttribute('hidden');
          } else {
            link.querySelector('span').setAttribute('hidden', true);
          }
        }
      }

      this.status = status;

      if (status) {
        this.removeAttribute('hidden');
      } else this.setAttribute('hidden', true);

      return this;
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      if (atom.config.get('linter.showProviderName') && this.message.linter) {
        this.appendChild(Message.getName(this.message));
      }
      this.appendChild(Message.getRibbon(this.message));
      this.appendChild(Message.getMessage(this.message, this.includeLink));
    }
  }], [{
    key: 'getLink',
    value: function getLink(message) {
      var el = document.createElement('a');
      var pathEl = document.createElement('span');
      var displayFile = message.filePath;

      el.className = 'linter-message-link';

      for (var path of atom.project.getPaths()) {
        if (displayFile.indexOf(path) === 0) {
          displayFile = displayFile.substr(path.length + 1); // Path + Path Separator
          break;
        }
      }if (message.range) {
        el.textContent = 'at line ' + (message.range.start.row + 1) + ' col ' + (message.range.start.column + 1);
      }
      pathEl.textContent = ' in ' + displayFile;
      el.appendChild(pathEl);
      el.addEventListener('click', function () {
        atom.workspace.open(message.filePath).then(function () {
          if (message.range) {
            atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
          }
        });
      });
      return el;
    }
  }, {
    key: 'getMessage',
    value: function getMessage(message, includeLink) {
      if (message.multiline || NewLine.test(message.text)) {
        return Message.getMultiLineMessage(message, includeLink);
      }

      var el = document.createElement('span');
      var messageEl = document.createElement('linter-message-line');

      el.className = 'linter-message-item';

      el.appendChild(messageEl);

      if (includeLink && message.filePath) {
        el.appendChild(Message.getLink(message));
      }

      if (message.html && typeof message.html !== 'string') {
        messageEl.appendChild(message.html.cloneNode(true));
      } else if (message.html) {
        messageEl.innerHTML = message.html;
      } else if (message.text) {
        messageEl.textContent = message.text;
      }

      return el;
    }
  }, {
    key: 'getMultiLineMessage',
    value: function getMultiLineMessage(message, includeLink) {
      var container = document.createElement('span');
      var messageEl = document.createElement('linter-multiline-message');

      container.className = 'linter-message-item';
      messageEl.setAttribute('title', message.text);

      message.text.split(NewLine).forEach(function (line, index) {
        if (!line) return;

        var el = document.createElement('linter-message-line');
        el.textContent = line;
        messageEl.appendChild(el);

        // Render the link in the "title" line.
        if (index === 0 && includeLink && message.filePath) {
          messageEl.appendChild(Message.getLink(message));
        }
      });

      container.appendChild(messageEl);

      messageEl.addEventListener('click', function (e) {
        // Avoid opening the message contents when we click the link.
        var link = e.target.tagName === 'A' ? e.target : e.target.parentNode;

        if (!link.classList.contains('linter-message-link')) {
          messageEl.classList.toggle('expanded');
        }
      });

      return container;
    }
  }, {
    key: 'getName',
    value: function getName(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item badge badge-flexible linter-highlight';
      el.textContent = message.linter;
      return el;
    }
  }, {
    key: 'getRibbon',
    value: function getRibbon(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item badge badge-flexible linter-highlight';
      el.className += ' ' + message['class'];
      el.textContent = message.type;
      return el;
    }
  }, {
    key: 'fromMessage',
    value: function fromMessage(message, includeLink) {
      return new MessageElement().initialize(message, includeLink);
    }
  }]);

  return Message;
})(HTMLElement);

exports.Message = Message;
var MessageElement = document.registerElement('linter-message', {
  prototype: Message.prototype
});
exports.MessageElement = MessageElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL21lc3NhZ2UtZWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7Ozs7O0FBRVgsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFBOztJQUVWLE9BQU87WUFBUCxPQUFPOztXQUFQLE9BQU87MEJBQVAsT0FBTzs7K0JBQVAsT0FBTzs7O2VBQVAsT0FBTzs7V0FDUixvQkFBQyxPQUFPLEVBQXNCO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDcEMsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7QUFDdEIsVUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7QUFDbkIsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBQ2UsMEJBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNqQixVQUFJLEtBQUssS0FBSyxNQUFNLEVBQ2xCLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQSxLQUM5QixJQUFJLEtBQUssS0FBSyxNQUFNLEVBQ3ZCLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQTs7QUFFbkMsVUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtBQUNqRCxZQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFDdkQsWUFBSSxJQUFJLEVBQUU7QUFDUixjQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7QUFDdkIsZ0JBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1dBQ3JELE1BQU07QUFDTCxnQkFBSSxDQUFDLGFBQWEsQ0FB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QUFNLENBQUE7QUFDL0IsYUFBTyxFQUFFLENBQUE7S0FDVjs7O1dBQ2UsbUJBQUMsT0FBTyxFQUFFO0FBQ3hCLFVBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDekMsUUFBRSxDQUFDLFNBQVMsR0FBRywyREFBMkQsQ0FBQTtBQUMxRSxRQUFFLENBQUMsU0FBUyxVQUFRLE9BQU8sU0FBTSxBQUFFLENBQUE7QUFDbkMsUUFBRSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFBO0FBQzdCLGFBQU8sRUFBRSxDQUFBO0tBQ1Y7OztXQUNpQixxQkFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFO0FBQ3ZDLGFBQU8sSUFBSSxjQUFjLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0tBQzdEOzs7U0E3SVUsT0FBTztHQUFTLFdBQVc7OztBQWdKakMsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN2RSxXQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7Q0FDN0IsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL21lc3NhZ2UtZWxlbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmNvbnN0IE5ld0xpbmUgPSAvXFxyP1xcbi9cblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIGluaXRpYWxpemUobWVzc2FnZSwgaW5jbHVkZUxpbmsgPSB0cnVlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMuaW5jbHVkZUxpbmsgPSBpbmNsdWRlTGlua1xuICAgIHRoaXMuc3RhdHVzID0gZmFsc2VcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVwZGF0ZVZpc2liaWxpdHkoc2NvcGUpIHtcbiAgICBsZXQgc3RhdHVzID0gdHJ1ZVxuICAgIGlmIChzY29wZSA9PT0gJ0xpbmUnKVxuICAgICAgc3RhdHVzID0gdGhpcy5tZXNzYWdlLmN1cnJlbnRMaW5lXG4gICAgZWxzZSBpZiAoc2NvcGUgPT09ICdGaWxlJylcbiAgICAgIHN0YXR1cyA9IHRoaXMubWVzc2FnZS5jdXJyZW50RmlsZVxuXG4gICAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoICYmIHRoaXMubWVzc2FnZS5maWxlUGF0aCkge1xuICAgICAgY29uc3QgbGluayA9IHRoaXMucXVlcnlTZWxlY3RvcignLmxpbnRlci1tZXNzYWdlLWxpbmsnKVxuICAgICAgaWYgKGxpbmspIHtcbiAgICAgICAgaWYgKHNjb3BlID09PSAnUHJvamVjdCcpIHtcbiAgICAgICAgICBsaW5rLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGluay5xdWVyeVNlbGVjdG9yKCdzcGFuJykuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXNcblxuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgIH0gZWxzZSB0aGlzLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcblxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuc2hvd1Byb3ZpZGVyTmFtZScpICYmIHRoaXMubWVzc2FnZS5saW50ZXIpIHtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoTWVzc2FnZS5nZXROYW1lKHRoaXMubWVzc2FnZSkpXG4gICAgfVxuICAgIHRoaXMuYXBwZW5kQ2hpbGQoTWVzc2FnZS5nZXRSaWJib24odGhpcy5tZXNzYWdlKSlcbiAgICB0aGlzLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0TWVzc2FnZSh0aGlzLm1lc3NhZ2UsIHRoaXMuaW5jbHVkZUxpbmspKVxuICB9XG4gIHN0YXRpYyBnZXRMaW5rKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgIGNvbnN0IHBhdGhFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGxldCBkaXNwbGF5RmlsZSA9IG1lc3NhZ2UuZmlsZVBhdGhcblxuICAgIGVsLmNsYXNzTmFtZSA9ICdsaW50ZXItbWVzc2FnZS1saW5rJ1xuXG4gICAgZm9yIChsZXQgcGF0aCBvZiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKSlcbiAgICAgIGlmIChkaXNwbGF5RmlsZS5pbmRleE9mKHBhdGgpID09PSAwKSB7XG4gICAgICAgIGRpc3BsYXlGaWxlID0gZGlzcGxheUZpbGUuc3Vic3RyKHBhdGgubGVuZ3RoICsgMSkgLy8gUGF0aCArIFBhdGggU2VwYXJhdG9yXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICBpZiAobWVzc2FnZS5yYW5nZSkge1xuICAgICAgZWwudGV4dENvbnRlbnQgPSBgYXQgbGluZSAke21lc3NhZ2UucmFuZ2Uuc3RhcnQucm93ICsgMX0gY29sICR7bWVzc2FnZS5yYW5nZS5zdGFydC5jb2x1bW4gKyAxfWBcbiAgICB9XG4gICAgcGF0aEVsLnRleHRDb250ZW50ID0gJyBpbiAnICsgZGlzcGxheUZpbGVcbiAgICBlbC5hcHBlbmRDaGlsZChwYXRoRWwpXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4obWVzc2FnZS5maWxlUGF0aCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2UucmFuZ2UpIHtcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24obWVzc2FnZS5yYW5nZS5zdGFydClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICAgIHJldHVybiBlbFxuICB9XG4gIHN0YXRpYyBnZXRNZXNzYWdlKG1lc3NhZ2UsIGluY2x1ZGVMaW5rKSB7XG4gICAgaWYgKG1lc3NhZ2UubXVsdGlsaW5lIHx8IE5ld0xpbmUudGVzdChtZXNzYWdlLnRleHQpKSB7XG4gICAgICByZXR1cm4gTWVzc2FnZS5nZXRNdWx0aUxpbmVNZXNzYWdlKG1lc3NhZ2UsIGluY2x1ZGVMaW5rKVxuICAgIH1cblxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgY29uc3QgbWVzc2FnZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGludGVyLW1lc3NhZ2UtbGluZScpXG5cbiAgICBlbC5jbGFzc05hbWUgPSAnbGludGVyLW1lc3NhZ2UtaXRlbSdcblxuICAgIGVsLmFwcGVuZENoaWxkKG1lc3NhZ2VFbClcblxuICAgIGlmIChpbmNsdWRlTGluayAmJiBtZXNzYWdlLmZpbGVQYXRoKSB7XG4gICAgICBlbC5hcHBlbmRDaGlsZChNZXNzYWdlLmdldExpbmsobWVzc2FnZSkpXG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UuaHRtbCAmJiB0eXBlb2YgbWVzc2FnZS5odG1sICE9PSAnc3RyaW5nJykge1xuICAgICAgbWVzc2FnZUVsLmFwcGVuZENoaWxkKG1lc3NhZ2UuaHRtbC5jbG9uZU5vZGUodHJ1ZSkpXG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmh0bWwpIHtcbiAgICAgIG1lc3NhZ2VFbC5pbm5lckhUTUwgPSBtZXNzYWdlLmh0bWxcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UudGV4dCkge1xuICAgICAgbWVzc2FnZUVsLnRleHRDb250ZW50ID0gbWVzc2FnZS50ZXh0XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsXG4gIH1cbiAgc3RhdGljIGdldE11bHRpTGluZU1lc3NhZ2UobWVzc2FnZSwgaW5jbHVkZUxpbmspIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBjb25zdCBtZXNzYWdlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItbXVsdGlsaW5lLW1lc3NhZ2UnKVxuXG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICdsaW50ZXItbWVzc2FnZS1pdGVtJ1xuICAgIG1lc3NhZ2VFbC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgbWVzc2FnZS50ZXh0KVxuXG4gICAgbWVzc2FnZS50ZXh0LnNwbGl0KE5ld0xpbmUpLmZvckVhY2goZnVuY3Rpb24obGluZSwgaW5kZXgpIHtcbiAgICAgIGlmICghbGluZSkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGludGVyLW1lc3NhZ2UtbGluZScpXG4gICAgICBlbC50ZXh0Q29udGVudCA9IGxpbmVcbiAgICAgIG1lc3NhZ2VFbC5hcHBlbmRDaGlsZChlbClcblxuICAgICAgLy8gUmVuZGVyIHRoZSBsaW5rIGluIHRoZSBcInRpdGxlXCIgbGluZS5cbiAgICAgIGlmIChpbmRleCA9PT0gMCAmJiBpbmNsdWRlTGluayAmJiBtZXNzYWdlLmZpbGVQYXRoKSB7XG4gICAgICAgIG1lc3NhZ2VFbC5hcHBlbmRDaGlsZChNZXNzYWdlLmdldExpbmsobWVzc2FnZSkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChtZXNzYWdlRWwpXG5cbiAgICBtZXNzYWdlRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAvLyBBdm9pZCBvcGVuaW5nIHRoZSBtZXNzYWdlIGNvbnRlbnRzIHdoZW4gd2UgY2xpY2sgdGhlIGxpbmsuXG4gICAgICB2YXIgbGluayA9IGUudGFyZ2V0LnRhZ05hbWUgPT09ICdBJyA/IGUudGFyZ2V0IDogZS50YXJnZXQucGFyZW50Tm9kZVxuXG4gICAgICBpZiAoIWxpbmsuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW50ZXItbWVzc2FnZS1saW5rJykpIHtcbiAgICAgICAgbWVzc2FnZUVsLmNsYXNzTGlzdC50b2dnbGUoJ2V4cGFuZGVkJylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbnRhaW5lclxuICB9XG4gIHN0YXRpYyBnZXROYW1lKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGVsLmNsYXNzTmFtZSA9ICdsaW50ZXItbWVzc2FnZS1pdGVtIGJhZGdlIGJhZGdlLWZsZXhpYmxlIGxpbnRlci1oaWdobGlnaHQnXG4gICAgZWwudGV4dENvbnRlbnQgPSBtZXNzYWdlLmxpbnRlclxuICAgIHJldHVybiBlbFxuICB9XG4gIHN0YXRpYyBnZXRSaWJib24obWVzc2FnZSkge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgZWwuY2xhc3NOYW1lID0gJ2xpbnRlci1tZXNzYWdlLWl0ZW0gYmFkZ2UgYmFkZ2UtZmxleGlibGUgbGludGVyLWhpZ2hsaWdodCdcbiAgICBlbC5jbGFzc05hbWUgKz0gYCAke21lc3NhZ2UuY2xhc3N9YFxuICAgIGVsLnRleHRDb250ZW50ID0gbWVzc2FnZS50eXBlXG4gICAgcmV0dXJuIGVsXG4gIH1cbiAgc3RhdGljIGZyb21NZXNzYWdlKG1lc3NhZ2UsIGluY2x1ZGVMaW5rKSB7XG4gICAgcmV0dXJuIG5ldyBNZXNzYWdlRWxlbWVudCgpLmluaXRpYWxpemUobWVzc2FnZSwgaW5jbHVkZUxpbmspXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IE1lc3NhZ2VFbGVtZW50ID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaW50ZXItbWVzc2FnZScsIHtcbiAgcHJvdG90eXBlOiBNZXNzYWdlLnByb3RvdHlwZVxufSlcbiJdfQ==
//# sourceURL=/Users/Kamilius/.atom/packages/linter/lib/ui/message-element.js
