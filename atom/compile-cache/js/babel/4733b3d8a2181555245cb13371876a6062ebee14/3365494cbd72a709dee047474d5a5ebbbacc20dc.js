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

      if (status) {
        this.removeAttribute('hidden');
      } else this.setAttribute('hidden', true);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL21lc3NhZ2UtZWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7Ozs7O0FBRVgsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFBOztJQUVWLE9BQU87WUFBUCxPQUFPOztXQUFQLE9BQU87MEJBQVAsT0FBTzs7K0JBQVAsT0FBTzs7O2VBQVAsT0FBTzs7V0FDUixvQkFBQyxPQUFPLEVBQXNCO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDcEMsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7QUFDdEIsVUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBQ2UsMEJBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNqQixVQUFJLEtBQUssS0FBSyxNQUFNLEVBQ2xCLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQSxLQUM5QixJQUFJLEtBQUssS0FBSyxNQUFNLEVBQ3ZCLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQTs7QUFFbkMsVUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtBQUNqRCxZQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFDdkQsWUFBSSxJQUFJLEVBQUU7QUFDUixjQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7QUFDdkIsZ0JBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1dBQ3JELE1BQU07QUFDTCxnQkFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFF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Q0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN6QyxRQUFFLENBQUMsU0FBUyxHQUFHLDJEQUEyRCxDQUFBO0FBQzFFLFFBQUUsQ0FBQyxTQUFTLFVBQVEsT0FBTyxTQUFNLEFBQUUsQ0FBQTtBQUNuQyxRQUFFLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUE7QUFDN0IsYUFBTyxFQUFFLENBQUE7S0FDVjs7O1dBQ2lCLHFCQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUU7QUFDdkMsYUFBTyxJQUFJLGNBQWMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7S0FDN0Q7OztTQXhJVSxPQUFPO0dBQVMsV0FBVzs7O0FBMklqQyxJQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFO0FBQ3ZFLFdBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztDQUM3QixDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvbWVzc2FnZS1lbGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuY29uc3QgTmV3TGluZSA9IC9cXHI/XFxuL1xuXG5leHBvcnQgY2xhc3MgTWVzc2FnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgaW5pdGlhbGl6ZShtZXNzYWdlLCBpbmNsdWRlTGluayA9IHRydWUpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgdGhpcy5pbmNsdWRlTGluayA9IGluY2x1ZGVMaW5rXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1cGRhdGVWaXNpYmlsaXR5KHNjb3BlKSB7XG4gICAgbGV0IHN0YXR1cyA9IHRydWVcbiAgICBpZiAoc2NvcGUgPT09ICdMaW5lJylcbiAgICAgIHN0YXR1cyA9IHRoaXMubWVzc2FnZS5jdXJyZW50TGluZVxuICAgIGVsc2UgaWYgKHNjb3BlID09PSAnRmlsZScpXG4gICAgICBzdGF0dXMgPSB0aGlzLm1lc3NhZ2UuY3VycmVudEZpbGVcblxuICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCAmJiB0aGlzLm1lc3NhZ2UuZmlsZVBhdGgpIHtcbiAgICAgIGNvbnN0IGxpbmsgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5saW50ZXItbWVzc2FnZS1saW5rJylcbiAgICAgIGlmIChsaW5rKSB7XG4gICAgICAgIGlmIChzY29wZSA9PT0gJ1Byb2plY3QnKSB7XG4gICAgICAgICAgbGluay5xdWVyeVNlbGVjdG9yKCdzcGFuJykucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpbmsucXVlcnlTZWxlY3Rvcignc3BhbicpLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdGF0dXMpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgIH0gZWxzZSB0aGlzLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgfVxuICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5zaG93UHJvdmlkZXJOYW1lJykgJiYgdGhpcy5tZXNzYWdlLmxpbnRlcikge1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZChNZXNzYWdlLmdldE5hbWUodGhpcy5tZXNzYWdlKSlcbiAgICB9XG4gICAgdGhpcy5hcHBlbmRDaGlsZChNZXNzYWdlLmdldFJpYmJvbih0aGlzLm1lc3NhZ2UpKVxuICAgIHRoaXMuYXBwZW5kQ2hpbGQoTWVzc2FnZS5nZXRNZXNzYWdlKHRoaXMubWVzc2FnZSwgdGhpcy5pbmNsdWRlTGluaykpXG4gIH1cbiAgc3RhdGljIGdldExpbmsobWVzc2FnZSkge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgY29uc3QgcGF0aEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgbGV0IGRpc3BsYXlGaWxlID0gbWVzc2FnZS5maWxlUGF0aFxuXG4gICAgZWwuY2xhc3NOYW1lID0gJ2xpbnRlci1tZXNzYWdlLWxpbmsnXG5cbiAgICBmb3IgKGxldCBwYXRoIG9mIGF0b20ucHJvamVjdC5nZXRQYXRocygpKVxuICAgICAgaWYgKGRpc3BsYXlGaWxlLmluZGV4T2YocGF0aCkgPT09IDApIHtcbiAgICAgICAgZGlzcGxheUZpbGUgPSBkaXNwbGF5RmlsZS5zdWJzdHIocGF0aC5sZW5ndGggKyAxKSAvLyBQYXRoICsgUGF0aCBTZXBhcmF0b3JcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgIGlmIChtZXNzYWdlLnJhbmdlKSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IGBhdCBsaW5lICR7bWVzc2FnZS5yYW5nZS5zdGFydC5yb3cgKyAxfSBjb2wgJHttZXNzYWdlLnJhbmdlLnN0YXJ0LmNvbHVtbiArIDF9YFxuICAgIH1cbiAgICBwYXRoRWwudGV4dENvbnRlbnQgPSAnIGluICcgKyBkaXNwbGF5RmlsZVxuICAgIGVsLmFwcGVuZENoaWxkKHBhdGhFbClcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihtZXNzYWdlLmZpbGVQYXRoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAobWVzc2FnZS5yYW5nZSkge1xuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihtZXNzYWdlLnJhbmdlLnN0YXJ0KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gICAgcmV0dXJuIGVsXG4gIH1cbiAgc3RhdGljIGdldE1lc3NhZ2UobWVzc2FnZSwgaW5jbHVkZUxpbmspIHtcbiAgICBpZiAobWVzc2FnZS5tdWx0aWxpbmUgfHwgTmV3TGluZS50ZXN0KG1lc3NhZ2UudGV4dCkpIHtcbiAgICAgIHJldHVybiBNZXNzYWdlLmdldE11bHRpTGluZU1lc3NhZ2UobWVzc2FnZSwgaW5jbHVkZUxpbmspXG4gICAgfVxuXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBjb25zdCBtZXNzYWdlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItbWVzc2FnZS1saW5lJylcblxuICAgIGVsLmNsYXNzTmFtZSA9ICdsaW50ZXItbWVzc2FnZS1pdGVtJ1xuXG4gICAgZWwuYXBwZW5kQ2hpbGQobWVzc2FnZUVsKVxuXG4gICAgaWYgKGluY2x1ZGVMaW5rICYmIG1lc3NhZ2UuZmlsZVBhdGgpIHtcbiAgICAgIGVsLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0TGluayhtZXNzYWdlKSlcbiAgICB9XG5cbiAgICBpZiAobWVzc2FnZS5odG1sICYmIHR5cGVvZiBtZXNzYWdlLmh0bWwgIT09ICdzdHJpbmcnKSB7XG4gICAgICBtZXNzYWdlRWwuYXBwZW5kQ2hpbGQobWVzc2FnZS5odG1sLmNsb25lTm9kZSh0cnVlKSlcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuaHRtbCkge1xuICAgICAgbWVzc2FnZUVsLmlubmVySFRNTCA9IG1lc3NhZ2UuaHRtbFxuICAgIH0gZWxzZSBpZiAobWVzc2FnZS50ZXh0KSB7XG4gICAgICBtZXNzYWdlRWwudGV4dENvbnRlbnQgPSBtZXNzYWdlLnRleHRcbiAgICB9XG5cbiAgICByZXR1cm4gZWxcbiAgfVxuICBzdGF0aWMgZ2V0TXVsdGlMaW5lTWVzc2FnZShtZXNzYWdlLCBpbmNsdWRlTGluaykge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGNvbnN0IG1lc3NhZ2VFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1tdWx0aWxpbmUtbWVzc2FnZScpXG5cbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gJ2xpbnRlci1tZXNzYWdlLWl0ZW0nXG4gICAgbWVzc2FnZUVsLnNldEF0dHJpYnV0ZSgndGl0bGUnLCBtZXNzYWdlLnRleHQpXG5cbiAgICBtZXNzYWdlLnRleHQuc3BsaXQoTmV3TGluZSkuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpbmRleCkge1xuICAgICAgaWYgKCFsaW5lKSByZXR1cm5cblxuICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItbWVzc2FnZS1saW5lJylcbiAgICAgIGVsLnRleHRDb250ZW50ID0gbGluZVxuICAgICAgbWVzc2FnZUVsLmFwcGVuZENoaWxkKGVsKVxuXG4gICAgICAvLyBSZW5kZXIgdGhlIGxpbmsgaW4gdGhlIFwidGl0bGVcIiBsaW5lLlxuICAgICAgaWYgKGluZGV4ID09PSAwICYmIGluY2x1ZGVMaW5rICYmIG1lc3NhZ2UuZmlsZVBhdGgpIHtcbiAgICAgICAgbWVzc2FnZUVsLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0TGluayhtZXNzYWdlKSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG1lc3NhZ2VFbClcblxuICAgIG1lc3NhZ2VFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIC8vIEF2b2lkIG9wZW5pbmcgdGhlIG1lc3NhZ2UgY29udGVudHMgd2hlbiB3ZSBjbGljayB0aGUgbGluay5cbiAgICAgIHZhciBsaW5rID0gZS50YXJnZXQudGFnTmFtZSA9PT0gJ0EnID8gZS50YXJnZXQgOiBlLnRhcmdldC5wYXJlbnROb2RlXG5cbiAgICAgIGlmICghbGluay5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbnRlci1tZXNzYWdlLWxpbmsnKSkge1xuICAgICAgICBtZXNzYWdlRWwuY2xhc3NMaXN0LnRvZ2dsZSgnZXhwYW5kZWQnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gY29udGFpbmVyXG4gIH1cbiAgc3RhdGljIGdldE5hbWUobWVzc2FnZSkge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgZWwuY2xhc3NOYW1lID0gJ2xpbnRlci1tZXNzYWdlLWl0ZW0gYmFkZ2UgYmFkZ2UtZmxleGlibGUgbGludGVyLWhpZ2hsaWdodCdcbiAgICBlbC50ZXh0Q29udGVudCA9IG1lc3NhZ2UubGludGVyXG4gICAgcmV0dXJuIGVsXG4gIH1cbiAgc3RhdGljIGdldFJpYmJvbihtZXNzYWdlKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBlbC5jbGFzc05hbWUgPSAnbGludGVyLW1lc3NhZ2UtaXRlbSBiYWRnZSBiYWRnZS1mbGV4aWJsZSBsaW50ZXItaGlnaGxpZ2h0J1xuICAgIGVsLmNsYXNzTmFtZSArPSBgICR7bWVzc2FnZS5jbGFzc31gXG4gICAgZWwudGV4dENvbnRlbnQgPSBtZXNzYWdlLnR5cGVcbiAgICByZXR1cm4gZWxcbiAgfVxuICBzdGF0aWMgZnJvbU1lc3NhZ2UobWVzc2FnZSwgaW5jbHVkZUxpbmspIHtcbiAgICByZXR1cm4gbmV3IE1lc3NhZ2VFbGVtZW50KCkuaW5pdGlhbGl6ZShtZXNzYWdlLCBpbmNsdWRlTGluaylcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgTWVzc2FnZUVsZW1lbnQgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpbnRlci1tZXNzYWdlJywge1xuICBwcm90b3R5cGU6IE1lc3NhZ2UucHJvdG90eXBlXG59KVxuIl19
//# sourceURL=/Users/Kamilius/.atom/packages/linter/lib/ui/message-element.js
