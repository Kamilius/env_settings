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
var userConfigPath = directory ? directory.resolve('.csscomb.json') : '';

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
    if (_fs2['default'].existsSync(userConfigPath)) {
      config = require(userConfigPath);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9hdG9tLWNzc2NvbWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7Ozt1QkFDSCxTQUFTOzs7O3VCQUNULFNBQVM7Ozs7NkJBQ0gsZUFBZTs7OztBQU56QyxXQUFXLENBQUM7O0FBUVosSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN4RCxJQUFNLGNBQWMsR0FBRyxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRXBFLElBQUksTUFBTSxHQUFHO0FBQ2xCLHFCQUFtQixFQUFFO0FBQ25CLFNBQUssRUFBRSx1QkFBdUI7QUFDOUIsZUFBVyxFQUFFLCtCQUErQjtBQUM1QyxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsU0FBUztBQUNsQixZQUFNLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7R0FDbkM7QUFDRCxtQkFBaUIsRUFBRTtBQUNqQixTQUFLLEVBQUUscUJBQXFCO0FBQzVCLGVBQVcsRUFBRSxvREFBb0Q7QUFDakUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjtBQUNELGVBQWEsRUFBRTtBQUNiLFNBQUssRUFBRSxpQkFBaUI7QUFDeEIsZUFBVyxFQUFFLHVDQUF1QztBQUNwRCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztHQUNmO0FBQ0QsWUFBVSxFQUFFO0FBQ1YsU0FBSyxFQUFFLGFBQWE7QUFDcEIsZUFBVyxFQUFFLGlGQUFpRjtBQUM5RixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsVUFBVTtBQUNuQixZQUFNLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUM7R0FDNUM7QUFDRCxZQUFVLEVBQUU7QUFDVixTQUFLLEVBQUUsYUFB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QUMsVUFBQyxNQUFNLEVBQUs7QUFDN0QsVUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFNO0FBQ2xDLFVBQUksYUFBYSxFQUFFLEVBQUU7QUFDbkIsZUFBTyxFQUFFLENBQUM7T0FDWDtLQUNGLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUM7OztBQUVLLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxHQUFTO0FBQzlCLGdCQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7Q0FDMUIsQ0FBQyIsImZpbGUiOiIvVXNlcnMvS2FtaWxpdXMvLmF0b20vcGFja2FnZXMvYXRvbS1jc3Njb21iL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBDU1NDb21iIGZyb20gJ2Nzc2NvbWInO1xuaW1wb3J0IHBvc3Rjc3MgZnJvbSAncG9zdGNzcyc7XG5pbXBvcnQgcGVyZmVjdGlvbmlzdCBmcm9tICdwZXJmZWN0aW9uaXN0JztcblxuY29uc3QgZGlyZWN0b3J5ID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKCkuc2hpZnQoKTtcbmNvbnN0IHVzZXJDb25maWdQYXRoID0gZGlyZWN0b3J5ID8gZGlyZWN0b3J5LnJlc29sdmUoJy5jc3Njb21iLmpzb24nKSA6ICcnO1xuXG5leHBvcnQgbGV0IGNvbmZpZyA9IHtcbiAgY29uZmlndXJlV2l0aFByZXNldDoge1xuICAgIHRpdGxlOiAnQ29uZmlndXJlIHdpdGggcHJlc2V0JyxcbiAgICBkZXNjcmlwdGlvbjogJ0NvbmZpZ3VyZSB3aXRoIHByZXNldCBjb25maWcuJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnY3NzY29tYicsXG4gICAgZW51bTogWydjc3Njb21iJywgJ3plbicsICd5YW5kZXgnXVxuICB9LFxuICBjb25maWd1cmVXaXRoSlNPTjoge1xuICAgIHRpdGxlOiAnQ29uZmlndXJlIHdpdGggSlNPTicsXG4gICAgZGVzY3JpcHRpb246ICdDb25maWd1cmUgd2l0aCBKU09OIGZpbGUgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5LicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlXG4gIH0sXG4gIGV4ZWN1dGVPblNhdmU6IHtcbiAgICB0aXRsZTogJ0V4ZWN1dGUgb24gU2F2ZScsXG4gICAgZGVzY3JpcHRpb246ICdFeGVjdXRlIHNvcnRpbmcgQ1NTIHByb3BlcnR5IG9uIHNhdmUuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfSxcbiAgZm9ybWF0VHlwZToge1xuICAgIHRpdGxlOiAnRm9ybWF0IFR5cGUnLFxuICAgIGRlc2NyaXB0aW9uOiAnT25seSBmYWNpbGl0YXRlcyBzaW1wbGUgd2hpdGVzcGFjZSBjb21wcmVzc2lvbiBhcm91bmQgc2VsZWN0b3JzICYgZGVjbGFyYXRpb25zLicsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ2V4cGFuZGVkJyxcbiAgICBlbnVtOiBbJ2V4cGFuZGVkJywgJ2NvbXBhY3QnLCAnY29tcHJlc3NlZCddXG4gIH0sXG4gIGluZGVudFNpemU6IHtcbiAgICB0aXRsZTogJ0luZGVudCBTaXplJyxcbiAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICBkZWZhdWx0OiAyXG4gIH0sXG4gIG1heEF0UnVsZUxlbmd0aDoge1xuICAgIHRpdGxlOiAnTWF4IGF0IFJ1bGUgTGVuZ3RoJyxcbiAgICBkZXNjcmlwdGlvbjogJ1RoaXMgdHJhbnNmb3JtIG9ubHkgYXBwbGllcyB0byB0aGUgZXhwYW5kZWQgZm9ybWF0LicsXG4gICAgdHlwZTogJ251bWJlcicsXG4gICAgZGVmYXVsdDogODBcbiAgfSxcbiAgbWF4U2VsZWN0b3JMZW5ndGg6IHtcbiAgICB0aXRsZTogJ01heCBTZWxlY3RvciBMZW5ndGgnLFxuICAgIGRlc2NyaXB0aW9uOiAnVGhpcyB0cmFuc2Zvcm0gb25seSBhcHBsaWVzIHRvIHRoZSBjb21wcmVzc2VkIGZvcm1hdC4nLFxuICAgIHR5cGU6ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IDgwXG4gIH0sXG4gIG1heFZhbHVlTGVuZ3RoOiB7XG4gICAgdGl0bGU6ICdNYXggVmFsdWUgTGVuZ3RoJyxcbiAgICBkZXNjcmlwdGlvbjogJ1RoaXMgdHJhbnNmb3JtIG9ubHkgYXBwbGllcyB0byB0aGUgZXhwYW5kZWQgZm9ybWF0LicsXG4gICAgdHlwZTogJ251bWJlcicsXG4gICAgZGVmYXVsdDogODBcbiAgfVxufTtcblxuY29uc3QgY29uZmlndXJlV2l0aFByZXNldCA9ICgpID0+IGF0b20uY29uZmlnLmdldCgnYXRvbS1jc3Njb21iLmNvbmZpZ3VyZVdpdGhQcmVzZXQnKTtcbmNvbnN0IGNvbmZpZ3VyZVdpdGhKU09OICAgPSAoKSA9PiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY3NzY29tYi5jb25maWd1cmVXaXRoSlNPTicpO1xuY29uc3QgZXhlY3V0ZU9uU2F2ZSAgICAgICA9ICgpID0+IGF0b20uY29uZmlnLmdldCgnYXRvbS1jc3Njb21iLmV4ZWN1dGVPblNhdmUnKTtcbmNvbnN0IGZvcm1hdFR5cGUgICAgICAgICAgPSAoKSA9PiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY3NzY29tYi5mb3JtYXRUeXBlJyk7XG5jb25zdCBpbmRlbnRTaXplICAgICAgICAgID0gKCkgPT4gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNzc2NvbWIuaW5kZW50U2l6ZScpO1xuY29uc3QgbWF4QXRSdWxlTGVuZ3RoICAgICA9ICgpID0+IGF0b20uY29uZmlnLmdldCgnYXRvbS1jc3Njb21iLm1heEF0UnVsZUxlbmd0aCcpO1xuY29uc3QgbWF4U2VsZWN0b3JMZW5ndGggICA9ICgpID0+IGF0b20uY29uZmlnLmdldCgnYXRvbS1jc3Njb21iLm1heFNlbGVjdG9yTGVuZ3RoJyk7XG5jb25zdCBtYXhWYWx1ZUxlbmd0aCAgICAgID0gKCkgPT4gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNzc2NvbWIubWF4VmFsdWVMZW5ndGgnKTtcblxuY29uc3QgZ2V0Q29tYkNvbmZpZyA9ICgpID0+IHtcblxuICBsZXQgY29uZmlnO1xuXG4gIGlmIChjb25maWd1cmVXaXRoSlNPTigpKSB7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmModXNlckNvbmZpZ1BhdGgpKSB7XG4gICAgICBjb25maWcgPSByZXF1aXJlKHVzZXJDb25maWdQYXRoKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmZpZykge1xuICAgIGNvbmZpZyA9IENTU0NvbWIuZ2V0Q29uZmlnKGNvbmZpZ3VyZVdpdGhQcmVzZXQoKSk7XG4gIH1cblxuICByZXR1cm4gY29uZmlnO1xufTtcblxuY29uc3QgY29tYiA9IChjc3MgPSAnJywgc3ludGF4ID0gJ2NzcycpID0+IHtcblxuICBsZXQgY3NzY29tYiA9IG5ldyBDU1NDb21iKGdldENvbWJDb25maWcoKSk7XG4gIGxldCBjb21iZWQgPSBjc3Njb21iLnByb2Nlc3NTdHJpbmcoY3NzLCB7XG4gICAgc3ludGF4OiBzeW50YXhcbiAgfSk7XG5cbiAgcmV0dXJuIHBvc3Rjc3MoW3BlcmZlY3Rpb25pc3Qoe1xuICAgIHN5bnRheDogc3ludGF4LFxuICAgIGZvcm1hdDogZm9ybWF0VHlwZSgpLFxuICAgIGluZGVudFNpemU6IGluZGVudFNpemUoKSxcbiAgICBtYXhBdFJ1bGVMZW5ndGg6IG1heEF0UnVsZUxlbmd0aCgpLFxuICAgIG1heFNlbGVjdG9yTGVuZ3RoOiBtYXhTZWxlY3Rvckxlbmd0aCgpLFxuICAgIG1heFZhbHVlTGVuZ3RoOiBtYXhWYWx1ZUxlbmd0aCgpXG4gIH0pXSkucHJvY2Vzcyhjb21iZWQpLmNzcztcbn07XG5cbmNvbnN0IGV4ZWN1dGUgPSAoKSA9PiB7XG5cbiAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG4gIGlmICghZWRpdG9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuICBsZXQgc2VsZWN0ZWRUZXh0ID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpO1xuICBsZXQgZ3JhbW1lciA9IGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gIHRyeSB7XG4gICAgaWYgKHNlbGVjdGVkVGV4dC5sZW5ndGggIT09IDApIHtcbiAgICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShcbiAgICAgICAgZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKSxcbiAgICAgICAgY29tYihzZWxlY3RlZFRleHQsIGdyYW1tZXIpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBlZGl0b3Iuc2V0VGV4dChjb21iKHRleHQsIGdyYW1tZXIpKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUpO1xuICB9XG59O1xuXG5sZXQgZWRpdG9yT2JzZXJ2ZXIgPSBudWxsO1xuXG5leHBvcnQgY29uc3QgYWN0aXZhdGUgPSAoc3RhdGUpID0+IHtcblxuICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYXRvbS1jc3Njb21iOmV4ZWN1dGUnLCAoKSA9PiB7XG4gICAgZXhlY3V0ZSgpO1xuICB9KTtcblxuICBlZGl0b3JPYnNlcnZlciA9IGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG4gICAgZWRpdG9yLmdldEJ1ZmZlcigpLm9uV2lsbFNhdmUoKCkgPT4ge1xuICAgICAgaWYgKGV4ZWN1dGVPblNhdmUoKSkge1xuICAgICAgICBleGVjdXRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGRlYWN0aXZhdGUgPSAoKSA9PiB7XG4gIGVkaXRvck9ic2VydmVyLmRpc3Bvc2UoKTtcbn07Il19
//# sourceURL=/Users/Kamilius/.atom/packages/atom-csscomb/index.js
