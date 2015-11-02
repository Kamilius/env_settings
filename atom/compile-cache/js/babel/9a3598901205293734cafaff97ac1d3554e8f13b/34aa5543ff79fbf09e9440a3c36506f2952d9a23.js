Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cssfmt = require('cssfmt');

var _cssfmt2 = _interopRequireDefault(_cssfmt);

'use babel';

var config = {
  formatOnSave: {
    title: 'Format on Save',
    description: 'Execute formatting CSS on save.',
    type: 'boolean',
    'default': false
  }
};

exports.config = config;
var formatOnSave = function formatOnSave() {
  return atom.config.get('cssfmt.formatOnSave');
};

var execute = function execute() {

  var editor = atom.workspace.getActiveTextEditor();

  if (!editor) {
    return;
  }

  var position = editor.getCursorBufferPosition();
  var text = editor.getText();
  var selectedText = editor.getSelectedText();

  if (selectedText.length !== 0) {
    try {
      editor.setTextInBufferRange(editor.getSelectedBufferRange(), _cssfmt2['default'].process(selectedText));
    } catch (e) {}
  } else {
    try {
      editor.setText(_cssfmt2['default'].process(text));
    } catch (e) {}
  }

  editor.setCursorBufferPosition(position);
};

var editorObserver = null;

var activate = function activate(state) {

  atom.commands.add('atom-workspace', 'cssfmt:execute', function () {
    execute();
  });

  editorObserver = atom.workspace.observeTextEditors(function (editor) {
    editor.getBuffer().onWillSave(function () {
      if (formatOnSave()) {
        execute();
      }
    });
  });
};

exports.activate = activate;
var deactivate = function deactivate() {
  editorObserver.dispose();
};
exports.deactivate = deactivate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9jc3NmbXQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3NCQUVvQixRQUFROzs7O0FBRjVCLFdBQVcsQ0FBQzs7QUFJTCxJQUFJLE1BQU0sR0FBRztBQUNsQixjQUFZLEVBQUU7QUFDWixTQUFLLEVBQUUsZ0JBQWdCO0FBQ3ZCLGVBQVcsRUFBRSxpQ0FBaUM7QUFDOUMsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjtDQUNGLENBQUM7OztBQUVGLElBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWTtTQUFTLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDO0NBQUEsQ0FBQzs7QUFFbEUsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLEdBQVM7O0FBRXBCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7QUFFcEQsTUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLFdBQU87R0FDUjs7QUFFRCxNQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztBQUNoRCxNQUFJLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDNUIsTUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUU1QyxNQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQzdCLFFBQUk7QUFDRixZQUFNLENBQUMsb0JBQW9CLENBQ3pCLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxFQUMvQixvQkFBTyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQzdCLENBQUM7S0FDSCxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUU7R0FDZixNQUFNO0FBQ0wsUUFBSTtBQUNGLFlBQU0sQ0FBQyxPQUFPLENBQ1osb0JBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUNyQixDQUFDO0tBQ0gsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFO0dBQ2Y7O0FBRUQsUUFBTSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQzFDLENBQUM7O0FBRUYsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDOztBQUVuQixJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxLQUFLLEVBQUs7O0FBRWpDLE1BQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLFlBQU07QUFDMUQsV0FBTyxFQUFFLENBQUM7R0FDWCxDQUFDLENBQUM7O0FBRUgsZ0JBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQzdELFVBQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBTTtBQUNsQyxVQUFJLFlBQVksRUFBRSxFQUFFO0FBQ2xCLGVBQU8sRUFBRSxDQUFDO09BQ1g7S0FDRixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDOzs7QUFFSyxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsR0FBUztBQUM5QixnQkFBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0NBQzFCLENBQUMiLCJmaWxlIjoiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2Nzc2ZtdC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgY3NzZm10ICBmcm9tICdjc3NmbXQnO1xuXG5leHBvcnQgbGV0IGNvbmZpZyA9IHtcbiAgZm9ybWF0T25TYXZlOiB7XG4gICAgdGl0bGU6ICdGb3JtYXQgb24gU2F2ZScsXG4gICAgZGVzY3JpcHRpb246ICdFeGVjdXRlIGZvcm1hdHRpbmcgQ1NTIG9uIHNhdmUuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfVxufTtcblxuY29uc3QgZm9ybWF0T25TYXZlID0gKCkgPT4gYXRvbS5jb25maWcuZ2V0KCdjc3NmbXQuZm9ybWF0T25TYXZlJyk7XG5cbmNvbnN0IGV4ZWN1dGUgPSAoKSA9PiB7XG5cbiAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG4gIGlmICghZWRpdG9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCk7XG4gIGxldCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgbGV0IHNlbGVjdGVkVGV4dCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKTtcblxuICBpZiAoc2VsZWN0ZWRUZXh0Lmxlbmd0aCAhPT0gMCkge1xuICAgIHRyeSB7XG4gICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoXG4gICAgICAgIGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKCksXG4gICAgICAgIGNzc2ZtdC5wcm9jZXNzKHNlbGVjdGVkVGV4dClcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfSBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgZWRpdG9yLnNldFRleHQoXG4gICAgICAgIGNzc2ZtdC5wcm9jZXNzKHRleHQpXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cblxuICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zaXRpb24pO1xufTtcblxubGV0IGVkaXRvck9ic2VydmVyID0gbnVsbDtcblxuZXhwb3J0IGNvbnN0IGFjdGl2YXRlID0gKHN0YXRlKSA9PiB7XG5cbiAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2Nzc2ZtdDpleGVjdXRlJywgKCkgPT4ge1xuICAgIGV4ZWN1dGUoKTtcbiAgfSk7XG5cbiAgZWRpdG9yT2JzZXJ2ZXIgPSBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgIGVkaXRvci5nZXRCdWZmZXIoKS5vbldpbGxTYXZlKCgpID0+IHtcbiAgICAgIGlmIChmb3JtYXRPblNhdmUoKSkge1xuICAgICAgICBleGVjdXRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGRlYWN0aXZhdGUgPSAoKSA9PiB7XG4gIGVkaXRvck9ic2VydmVyLmRpc3Bvc2UoKTtcbn07XG4iXX0=
//# sourceURL=/Users/Kamilius/.atom/packages/cssfmt/index.js
