Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _csscomb = require('csscomb');

var _csscomb2 = _interopRequireDefault(_csscomb);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _perfectionist = require('perfectionist');

var _perfectionist2 = _interopRequireDefault(_perfectionist);

'use babel';

var directory = atom.project.getDirectories().shift();
var configPath = directory ? directory.resolve('.csscomb.json') : '';

var config = {
  configureWithPreset: {
    title: 'Configure with preset',
    description: 'Configure with preset config.',
    type: 'string',
    'default': 'csscomb',
    'enum': ['csscomb', 'zen', 'yandex']
  },
  configureWithJSON: {
    title: 'Configure with JSON',
    description: 'Configure with JSON file in the current directory.',
    type: 'boolean',
    'default': false
  },
  executeOnSave: {
    title: 'Execute on Save',
    description: 'Execute sorting CSS property on save.',
    type: 'boolean',
    'default': false
  },
  formatType: {
    title: 'Format Type',
    description: 'Only facilitates simple whitespace compression around selectors & declarations.',
    type: 'string',
    'default': 'expanded',
    'enum': ['expanded', 'compact', 'compressed']
  },
  indentSize: {
    title: 'Indent Size',
    type: 'number',
    'default': 2
  },
  maxAtRuleLength: {
    title: 'Max at Rule Length',
    description: 'This transform only applies to the expanded format.',
    type: 'number',
    'default': 80
  },
  maxSelectorLength: {
    title: 'Max Selector Length',
    description: 'This transform only applies to the compressed format.',
    type: 'number',
    'default': 80
  },
  maxValueLength: {
    title: 'Max Value Length',
    description: 'This transform only applies to the expanded format.',
    type: 'number',
    'default': 80
  }
};

exports.config = config;
var configureWithPreset = function configureWithPreset() {
  return atom.config.get('atom-csscomb.configureWithPreset');
};
var configureWithJSON = function configureWithJSON() {
  return atom.config.get('atom-csscomb.configureWithJSON');
};
var executeOnSave = function executeOnSave() {
  return atom.config.get('atom-csscomb.executeOnSave');
};
var formatType = function formatType() {
  return atom.config.get('atom-csscomb.formatType');
};
var indentSize = function indentSize() {
  return atom.config.get('atom-csscomb.indentSize');
};
var maxAtRuleLength = function maxAtRuleLength() {
  return atom.config.get('atom-csscomb.maxAtRuleLength');
};
var maxSelectorLength = function maxSelectorLength() {
  return atom.config.get('atom-csscomb.maxSelectorLength');
};
var maxValueLength = function maxValueLength() {
  return atom.config.get('atom-csscomb.maxValueLength');
};

var getCombConfig = function getCombConfig() {

  var config = undefined;

  if (configureWithJSON()) {
    if (_fs2['default'].existsSync(configPath)) {
      config = require(configPath);
    }
  }

  if (!config) {
    config = _csscomb2['default'].getConfig(configureWithPreset());
  }

  return config;
};

var comb = function comb() {
  var css = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
  var syntax = arguments.length <= 1 || arguments[1] === undefined ? 'css' : arguments[1];

  var csscomb = new _csscomb2['default'](getCombConfig());
  var combed = csscomb.processString(css, {
    syntax: syntax
  });

  return (0, _postcss2['default'])([(0, _perfectionist2['default'])({
    syntax: syntax,
    format: formatType(),
    indentSize: indentSize(),
    maxAtRuleLength: maxAtRuleLength(),
    maxSelectorLength: maxSelectorLength(),
    maxValueLength: maxValueLength()
  })]).process(combed).css;
};

var execute = function execute() {

  var editor = atom.workspace.getActiveTextEditor();

  if (!editor) {
    return;
  }

  var position = editor.getCursorBufferPosition();
  var text = editor.getText();
  var selectedText = editor.getSelectedText();
  var grammer = editor.getGrammar().name.toLowerCase();

  try {
    if (selectedText.length !== 0) {
      editor.setTextInBufferRange(editor.getSelectedBufferRange(), comb(selectedText, grammer));
    } else {
      editor.setText(comb(text, grammer));
    }
  } catch (e) {
    console.error(e);
  }

  editor.setCursorBufferPosition(position);
};

var editorObserver = null;

var activate = function activate(state) {

  atom.commands.add('atom-workspace', 'atom-csscomb:execute', function () {
    execute();
  });

  editorObserver = atom.workspace.observeTextEditors(function (editor) {
    editor.getBuffer().onWillSave(function () {
      if (executeOnSave()) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9hdG9tLWNzc2NvbWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7Ozt1QkFDSCxTQUFTOzs7O3VCQUNULFNBQVM7Ozs7NkJBQ0gsZUFBZTs7OztBQU56QyxXQUFXLENBQUM7O0FBUVosSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN4RCxJQUFNLFVBQVUsR0FBRyxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRWhFLElBQUksTUFBTSxHQUFHO0FBQ2xCLHFCQUFtQixFQUFFO0FBQ25CLFNBQUssRUFBRSx1QkFBdUI7QUFDOUIsZUFBVyxFQUFFLCtCQUErQjtBQUM1QyxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsU0FBUztBQUNsQixZQUFNLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7R0FDbkM7QUFDRCxtQkFBaUIsRUFBRTtBQUNqQixTQUFLLEVBQUUscUJBQXFCO0FBQzVCLGVBQVcsRUFBRSxvREFBb0Q7QUFDakUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjtBQUNELGVBQWEsRUFBRTtBQUNiLFNBQUssRUFBRSxpQkFBaUI7QUFDeEIsZUFBVyxFQUFFLHVDQUF1QztBQUNwRCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztHQUNmO0FBQ0QsWUFBVSxFQUFFO0FBQ1YsU0FBSyxFQUFFLGFBQWE7QUFDcEIsZUFBVyxFQUFFLGlGQUFpRjtBQUM5RixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsVUFBVTtBQUNuQixZQUFNLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUM7R0FDNUM7QUFDRCxZQUFVLEVBQUU7QUFDVixTQUFLLEVBQUUsYUFB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RUFBRSxZQUFNO0FBQ2hFLFdBQU8sRUFBRSxDQUFDO0dBQ1gsQ0FBQyxDQUFDOztBQUVILGdCQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUM3RCxVQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQU07QUFDbEMsVUFBSSxhQUFhLEVBQUUsRUFBRTtBQUNuQixlQUFPLEVBQUUsQ0FBQztPQUNYO0tBQ0YsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQzs7O0FBRUssSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFVLEdBQVM7QUFDOUIsZ0JBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztDQUMxQixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9hdG9tLWNzc2NvbWIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IENTU0NvbWIgZnJvbSAnY3NzY29tYic7XG5pbXBvcnQgcG9zdGNzcyBmcm9tICdwb3N0Y3NzJztcbmltcG9ydCBwZXJmZWN0aW9uaXN0IGZyb20gJ3BlcmZlY3Rpb25pc3QnO1xuXG5jb25zdCBkaXJlY3RvcnkgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKS5zaGlmdCgpO1xuY29uc3QgY29uZmlnUGF0aCA9IGRpcmVjdG9yeSA/IGRpcmVjdG9yeS5yZXNvbHZlKCcuY3NzY29tYi5qc29uJykgOiAnJztcblxuZXhwb3J0IGxldCBjb25maWcgPSB7XG4gIGNvbmZpZ3VyZVdpdGhQcmVzZXQ6IHtcbiAgICB0aXRsZTogJ0NvbmZpZ3VyZSB3aXRoIHByZXNldCcsXG4gICAgZGVzY3JpcHRpb246ICdDb25maWd1cmUgd2l0aCBwcmVzZXQgY29uZmlnLicsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ2Nzc2NvbWInLFxuICAgIGVudW06IFsnY3NzY29tYicsICd6ZW4nLCAneWFuZGV4J11cbiAgfSxcbiAgY29uZmlndXJlV2l0aEpTT046IHtcbiAgICB0aXRsZTogJ0NvbmZpZ3VyZSB3aXRoIEpTT04nLFxuICAgIGRlc2NyaXB0aW9uOiAnQ29uZmlndXJlIHdpdGggSlNPTiBmaWxlIGluIHRoZSBjdXJyZW50IGRpcmVjdG9yeS4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZVxuICB9LFxuICBleGVjdXRlT25TYXZlOiB7XG4gICAgdGl0bGU6ICdFeGVjdXRlIG9uIFNhdmUnLFxuICAgIGRlc2NyaXB0aW9uOiAnRXhlY3V0ZSBzb3J0aW5nIENTUyBwcm9wZXJ0eSBvbiBzYXZlLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlXG4gIH0sXG4gIGZvcm1hdFR5cGU6IHtcbiAgICB0aXRsZTogJ0Zvcm1hdCBUeXBlJyxcbiAgICBkZXNjcmlwdGlvbjogJ09ubHkgZmFjaWxpdGF0ZXMgc2ltcGxlIHdoaXRlc3BhY2UgY29tcHJlc3Npb24gYXJvdW5kIHNlbGVjdG9ycyAmIGRlY2xhcmF0aW9ucy4nLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdleHBhbmRlZCcsXG4gICAgZW51bTogWydleHBhbmRlZCcsICdjb21wYWN0JywgJ2NvbXByZXNzZWQnXVxuICB9LFxuICBpbmRlbnRTaXplOiB7XG4gICAgdGl0bGU6ICdJbmRlbnQgU2l6ZScsXG4gICAgdHlwZTogJ251bWJlcicsXG4gICAgZGVmYXVsdDogMlxuICB9LFxuICBtYXhBdFJ1bGVMZW5ndGg6IHtcbiAgICB0aXRsZTogJ01heCBhdCBSdWxlIExlbmd0aCcsXG4gICAgZGVzY3JpcHRpb246ICdUaGlzIHRyYW5zZm9ybSBvbmx5IGFwcGxpZXMgdG8gdGhlIGV4cGFuZGVkIGZvcm1hdC4nLFxuICAgIHR5cGU6ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IDgwXG4gIH0sXG4gIG1heFNlbGVjdG9yTGVuZ3RoOiB7XG4gICAgdGl0bGU6ICdNYXggU2VsZWN0b3IgTGVuZ3RoJyxcbiAgICBkZXNjcmlwdGlvbjogJ1RoaXMgdHJhbnNmb3JtIG9ubHkgYXBwbGllcyB0byB0aGUgY29tcHJlc3NlZCBmb3JtYXQuJyxcbiAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICBkZWZhdWx0OiA4MFxuICB9LFxuICBtYXhWYWx1ZUxlbmd0aDoge1xuICAgIHRpdGxlOiAnTWF4IFZhbHVlIExlbmd0aCcsXG4gICAgZGVzY3JpcHRpb246ICdUaGlzIHRyYW5zZm9ybSBvbmx5IGFwcGxpZXMgdG8gdGhlIGV4cGFuZGVkIGZvcm1hdC4nLFxuICAgIHR5cGU6ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IDgwXG4gIH1cbn07XG5cbmNvbnN0IGNvbmZpZ3VyZVdpdGhQcmVzZXQgPSAoKSA9PiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY3NzY29tYi5jb25maWd1cmVXaXRoUHJlc2V0Jyk7XG5jb25zdCBjb25maWd1cmVXaXRoSlNPTiAgID0gKCkgPT4gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNzc2NvbWIuY29uZmlndXJlV2l0aEpTT04nKTtcbmNvbnN0IGV4ZWN1dGVPblNhdmUgICAgICAgPSAoKSA9PiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY3NzY29tYi5leGVjdXRlT25TYXZlJyk7XG5jb25zdCBmb3JtYXRUeXBlICAgICAgICAgID0gKCkgPT4gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNzc2NvbWIuZm9ybWF0VHlwZScpO1xuY29uc3QgaW5kZW50U2l6ZSAgICAgICAgICA9ICgpID0+IGF0b20uY29uZmlnLmdldCgnYXRvbS1jc3Njb21iLmluZGVudFNpemUnKTtcbmNvbnN0IG1heEF0UnVsZUxlbmd0aCAgICAgPSAoKSA9PiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY3NzY29tYi5tYXhBdFJ1bGVMZW5ndGgnKTtcbmNvbnN0IG1heFNlbGVjdG9yTGVuZ3RoICAgPSAoKSA9PiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY3NzY29tYi5tYXhTZWxlY3Rvckxlbmd0aCcpO1xuY29uc3QgbWF4VmFsdWVMZW5ndGggICAgICA9ICgpID0+IGF0b20uY29uZmlnLmdldCgnYXRvbS1jc3Njb21iLm1heFZhbHVlTGVuZ3RoJyk7XG5cbmNvbnN0IGdldENvbWJDb25maWcgPSAoKSA9PiB7XG5cbiAgbGV0IGNvbmZpZztcblxuICBpZiAoY29uZmlndXJlV2l0aEpTT04oKSkge1xuICAgIGlmIChmcy5leGlzdHNTeW5jKGNvbmZpZ1BhdGgpKSB7XG4gICAgICBjb25maWcgPSByZXF1aXJlKGNvbmZpZ1BhdGgpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZmlnKSB7XG4gICAgY29uZmlnID0gQ1NTQ29tYi5nZXRDb25maWcoY29uZmlndXJlV2l0aFByZXNldCgpKTtcbiAgfVxuXG4gIHJldHVybiBjb25maWc7XG59O1xuXG5jb25zdCBjb21iID0gKGNzcyA9ICcnLCBzeW50YXggPSAnY3NzJykgPT4ge1xuXG4gIGxldCBjc3Njb21iID0gbmV3IENTU0NvbWIoZ2V0Q29tYkNvbmZpZygpKTtcbiAgbGV0IGNvbWJlZCA9IGNzc2NvbWIucHJvY2Vzc1N0cmluZyhjc3MsIHtcbiAgICBzeW50YXg6IHN5bnRheFxuICB9KTtcblxuICByZXR1cm4gcG9zdGNzcyhbcGVyZmVjdGlvbmlzdCh7XG4gICAgc3ludGF4OiBzeW50YXgsXG4gICAgZm9ybWF0OiBmb3JtYXRUeXBlKCksXG4gICAgaW5kZW50U2l6ZTogaW5kZW50U2l6ZSgpLFxuICAgIG1heEF0UnVsZUxlbmd0aDogbWF4QXRSdWxlTGVuZ3RoKCksXG4gICAgbWF4U2VsZWN0b3JMZW5ndGg6IG1heFNlbGVjdG9yTGVuZ3RoKCksXG4gICAgbWF4VmFsdWVMZW5ndGg6IG1heFZhbHVlTGVuZ3RoKClcbiAgfSldKS5wcm9jZXNzKGNvbWJlZCkuY3NzO1xufTtcblxuY29uc3QgZXhlY3V0ZSA9ICgpID0+IHtcblxuICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgaWYgKCFlZGl0b3IpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgcG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKTtcbiAgbGV0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuICBsZXQgc2VsZWN0ZWRUZXh0ID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpO1xuICBsZXQgZ3JhbW1lciA9IGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gIHRyeSB7XG4gICAgaWYgKHNlbGVjdGVkVGV4dC5sZW5ndGggIT09IDApIHtcbiAgICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShcbiAgICAgICAgZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKSxcbiAgICAgICAgY29tYihzZWxlY3RlZFRleHQsIGdyYW1tZXIpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBlZGl0b3Iuc2V0VGV4dChjb21iKHRleHQsIGdyYW1tZXIpKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUpO1xuICB9XG5cbiAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKTtcbn07XG5cbmxldCBlZGl0b3JPYnNlcnZlciA9IG51bGw7XG5cbmV4cG9ydCBjb25zdCBhY3RpdmF0ZSA9IChzdGF0ZSkgPT4ge1xuXG4gIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdhdG9tLWNzc2NvbWI6ZXhlY3V0ZScsICgpID0+IHtcbiAgICBleGVjdXRlKCk7XG4gIH0pO1xuXG4gIGVkaXRvck9ic2VydmVyID0gYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICBlZGl0b3IuZ2V0QnVmZmVyKCkub25XaWxsU2F2ZSgoKSA9PiB7XG4gICAgICBpZiAoZXhlY3V0ZU9uU2F2ZSgpKSB7XG4gICAgICAgIGV4ZWN1dGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgZGVhY3RpdmF0ZSA9ICgpID0+IHtcbiAgZWRpdG9yT2JzZXJ2ZXIuZGlzcG9zZSgpO1xufTtcbiJdfQ==
//# sourceURL=/Users/Kamilius/.atom/packages/atom-csscomb/index.js
