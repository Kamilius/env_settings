Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _bottomTab = require('./bottom-tab');

var _bottomTab2 = _interopRequireDefault(_bottomTab);

var _bottomStatus = require('./bottom-status');

var _bottomStatus2 = _interopRequireDefault(_bottomStatus);

'use babel';

var BottomContainer = (function (_HTMLElement) {
  _inherits(BottomContainer, _HTMLElement);

  function BottomContainer() {
    _classCallCheck(this, BottomContainer);

    _get(Object.getPrototypeOf(BottomContainer.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BottomContainer, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.subscriptions = new _atom.CompositeDisposable();
      this.emitter = new _atom.Emitter();
      this.tabs = new Map();
      this.tabs.set('Line', _bottomTab2['default'].create('Line'));
      this.tabs.set('File', _bottomTab2['default'].create('File'));
      this.tabs.set('Project', _bottomTab2['default'].create('Project'));
      this.status = new _bottomStatus2['default']();

      this.subscriptions.add(this.emitter);
      this.subscriptions.add(atom.config.observe('linter.displayLinterInfo', function (displayInfo) {
        _this.visibility = displayInfo;
      }));
      this.subscriptions.add(atom.config.observe('linter.statusIconScope', function (iconScope) {
        _this.iconScope = iconScope;
        _this.status.count = _this.tabs.get(iconScope).count;
      }));

      for (var tab of this.tabs) {
        this.appendChild(tab[1]);
        this.subscriptions.add(tab[1]);
      }
      this.appendChild(this.status);

      this.onDidChangeTab(function (activeName) {
        _this.activeTab = activeName;
      });
    }
  }, {
    key: 'getTab',
    value: function getTab(name) {
      return this.tabs.get(name);
    }
  }, {
    key: 'setCount',
    value: function setCount(_ref) {
      var Project = _ref.Project;
      var File = _ref.File;
      var Line = _ref.Line;

      this.tabs.get('Project').count = Project;
      this.tabs.get('File').count = File;
      this.tabs.get('Line').count = Line;
      this.status.count = this.tabs.get(this.iconScope).count;
    }
  }, {
    key: 'onDidChangeTab',
    value: function onDidChangeTab(callback) {
      var disposable = new _atom.CompositeDisposable();
      this.tabs.forEach(function (tab) {
        disposable.add(tab.onDidChangeTab(callback));
      });
      return disposable;
    }
  }, {
    key: 'onShouldTogglePanel',
    value: function onShouldTogglePanel(callback) {
      var disposable = new _atom.CompositeDisposable();
      this.tabs.forEach(function (tab) {
        disposable.add(tab.onShouldTogglePanel(callback));
      });
      return disposable;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.tabs.clear();
      this.status = null;
    }
  }, {
    key: 'activeTab',
    set: function set(activeName) {
      this._activeTab = activeName;
      for (var _ref23 of this.tabs) {
        var _ref22 = _slicedToArray(_ref23, 2);

        var _name = _ref22[0];
        var tab = _ref22[1];

        tab.active = _name === activeName;
      }
    },
    get: function get() {
      return this._activeTab;
    }
  }, {
    key: 'visibility',
    get: function get() {
      return !this.hasAttribute('hidden');
    },
    set: function set(value) {
      if (value) {
        this.removeAttribute('hidden');
      } else {
        this.setAttribute('hidden', true);
      }
    }
  }], [{
    key: 'create',
    value: function create(activeTab) {
      var el = document.createElement('linter-bottom-container');
      el.activeTab = activeTab;
      return el;
    }
  }]);

  return BottomContainer;
})(HTMLElement);

exports['default'] = BottomContainer;

document.registerElement('linter-bottom-container', {
  prototype: BottomContainer.prototype
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS1jb250YWluZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7eUJBQzNCLGNBQWM7Ozs7NEJBQ1gsaUJBQWlCOzs7O0FBSjFDLFdBQVcsQ0FBQTs7SUFNVSxlQUFlO1lBQWYsZUFBZTs7V0FBZixlQUFlOzBCQUFmLGVBQWU7OytCQUFmLGVBQWU7OztlQUFmLGVBQWU7O1dBQ25CLDJCQUFHOzs7QUFDaEIsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBdUIsQ0FBQTtBQUM1QyxVQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFXLENBQUE7QUFDMUIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3JCLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSx1QkFBVSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtBQUMvQyxVQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsdUJBQVUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7QUFDL0MsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLHVCQUFVLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0FBQ3JELFVBQUksQ0FBQyxNQUFNLEdBQUcsK0JBQWdCLENBQUE7O0FBRTlCLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxVQUFBLFdBQVcsRUFBSTtBQUNwRixjQUFLLFVBQVUsR0FBRyxXQUFXLENBQUE7T0FDOUIsQ0FBQyxDQUFDLENBQUE7QUFDSCxVQUFJLENBQUMs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Q1ksZUFBRztBQUNkLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQTtLQUN2Qjs7O1NBRWEsZUFBRztBQUNmLGFBQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQ3BDO1NBQ2EsYUFBQyxLQUFLLEVBQUU7QUFDcEIsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQy9CLE1BQU07QUFDTCxZQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUNsQztLQUNGOzs7V0F1QlksZ0JBQUMsU0FBUyxFQUFFO0FBQ3ZCLFVBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsQ0FBQTtBQUM1RCxRQUFFLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtBQUN4QixhQUFPLEVBQUUsQ0FBQTtLQUNWOzs7U0FyRmtCLGVBQWU7R0FBUyxXQUFXOztxQkFBbkMsZUFBZTs7QUF3RnBDLFFBQVEsQ0FBQyxlQUFlLENBQUMseUJBQXlCLEVBQUU7QUFDbEQsV0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTO0NBQ3JDLENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvS2FtaWxpdXMvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tY29udGFpbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEJvdHRvbVRhYiBmcm9tICcuL2JvdHRvbS10YWInXG5pbXBvcnQgQm90dG9tU3RhdHVzIGZyb20gJy4vYm90dG9tLXN0YXR1cydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm90dG9tQ29udGFpbmVyIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIHRoaXMudGFicyA9IG5ldyBNYXAoKVxuICAgIHRoaXMudGFicy5zZXQoJ0xpbmUnLCBCb3R0b21UYWIuY3JlYXRlKCdMaW5lJykpXG4gICAgdGhpcy50YWJzLnNldCgnRmlsZScsIEJvdHRvbVRhYi5jcmVhdGUoJ0ZpbGUnKSlcbiAgICB0aGlzLnRhYnMuc2V0KCdQcm9qZWN0JywgQm90dG9tVGFiLmNyZWF0ZSgnUHJvamVjdCcpKVxuICAgIHRoaXMuc3RhdHVzID0gbmV3IEJvdHRvbVN0YXR1c1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuZGlzcGxheUxpbnRlckluZm8nLCBkaXNwbGF5SW5mbyA9PiB7XG4gICAgICB0aGlzLnZpc2liaWxpdHkgPSBkaXNwbGF5SW5mb1xuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLnN0YXR1c0ljb25TY29wZScsIGljb25TY29wZSA9PiB7XG4gICAgICB0aGlzLmljb25TY29wZSA9IGljb25TY29wZVxuICAgICAgdGhpcy5zdGF0dXMuY291bnQgPSB0aGlzLnRhYnMuZ2V0KGljb25TY29wZSkuY291bnRcbiAgICB9KSlcblxuICAgIGZvciAobGV0IHRhYiBvZiB0aGlzLnRhYnMpIHtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGFiWzFdKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0YWJbMV0pXG4gICAgfVxuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5zdGF0dXMpXG5cbiAgICB0aGlzLm9uRGlkQ2hhbmdlVGFiKGFjdGl2ZU5hbWUgPT4ge1xuICAgICAgdGhpcy5hY3RpdmVUYWIgPSBhY3RpdmVOYW1lXG4gICAgfSlcbiAgfVxuICBnZXRUYWIobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnRhYnMuZ2V0KG5hbWUpXG4gIH1cbiAgc2V0Q291bnQoe1Byb2plY3QsIEZpbGUsIExpbmV9KSB7XG4gICAgdGhpcy50YWJzLmdldCgnUHJvamVjdCcpLmNvdW50ID0gUHJvamVjdFxuICAgIHRoaXMudGFicy5nZXQoJ0ZpbGUnKS5jb3VudCA9IEZpbGVcbiAgICB0aGlzLnRhYnMuZ2V0KCdMaW5lJykuY291bnQgPSBMaW5lXG4gICAgdGhpcy5zdGF0dXMuY291bnQgPSB0aGlzLnRhYnMuZ2V0KHRoaXMuaWNvblNjb3BlKS5jb3VudFxuICB9XG5cbiAgc2V0IGFjdGl2ZVRhYihhY3RpdmVOYW1lKSB7XG4gICAgdGhpcy5fYWN0aXZlVGFiID0gYWN0aXZlTmFtZVxuICAgIGZvciAobGV0IFtuYW1lLCB0YWJdIG9mIHRoaXMudGFicykge1xuICAgICAgdGFiLmFjdGl2ZSA9IG5hbWUgPT09IGFjdGl2ZU5hbWVcbiAgICB9XG4gIH1cbiAgZ2V0IGFjdGl2ZVRhYigpIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlVGFiXG4gIH1cblxuICBnZXQgdmlzaWJpbGl0eSgpIHtcbiAgICByZXR1cm4gIXRoaXMuaGFzQXR0cmlidXRlKCdoaWRkZW4nKVxuICB9XG4gIHNldCB2aXNpYmlsaXR5KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpXG4gICAgfVxuICB9XG5cbiAgb25EaWRDaGFuZ2VUYWIoY2FsbGJhY2spIHtcbiAgICBjb25zdCBkaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLnRhYnMuZm9yRWFjaChmdW5jdGlvbih0YWIpIHtcbiAgICAgIGRpc3Bvc2FibGUuYWRkKHRhYi5vbkRpZENoYW5nZVRhYihjYWxsYmFjaykpXG4gICAgfSlcbiAgICByZXR1cm4gZGlzcG9zYWJsZVxuICB9XG4gIG9uU2hvdWxkVG9nZ2xlUGFuZWwoY2FsbGJhY2spIHtcbiAgICBjb25zdCBkaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLnRhYnMuZm9yRWFjaChmdW5jdGlvbih0YWIpIHtcbiAgICAgIGRpc3Bvc2FibGUuYWRkKHRhYi5vblNob3VsZFRvZ2dsZVBhbmVsKGNhbGxiYWNrKSlcbiAgICB9KVxuICAgIHJldHVybiBkaXNwb3NhYmxlXG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnRhYnMuY2xlYXIoKVxuICAgIHRoaXMuc3RhdHVzID0gbnVsbFxuICB9XG5cbiAgc3RhdGljIGNyZWF0ZShhY3RpdmVUYWIpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1ib3R0b20tY29udGFpbmVyJylcbiAgICBlbC5hY3RpdmVUYWIgPSBhY3RpdmVUYWJcbiAgICByZXR1cm4gZWxcbiAgfVxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpbnRlci1ib3R0b20tY29udGFpbmVyJywge1xuICBwcm90b3R5cGU6IEJvdHRvbUNvbnRhaW5lci5wcm90b3R5cGVcbn0pXG4iXX0=
//# sourceURL=/Users/Kamilius/.atom/packages/linter/lib/ui/bottom-container.js
