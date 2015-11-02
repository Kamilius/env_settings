(function() {
  var path, stylesheet, stylesheetPath;

  path = require('path');

  stylesheetPath = path.resolve(__dirname, '../../styles/minimap.less');

  stylesheet = atom.themes.loadStylesheet(stylesheetPath);

  module.exports = {
    stylesheet: stylesheet
  };

  beforeEach(function() {
    var TextEditor, jasmineContent, styleNode;
    if (atom.workspace.buildTextEditor == null) {
      TextEditor = require('atom').TextEditor;
      atom.workspace.buildTextEditor = function(opts) {
        return new TextEditor(opts);
      };
    }
    jasmineContent = document.body.querySelector('#jasmine-content');
    styleNode = document.createElement('style');
    styleNode.textContent = "" + stylesheet + "\n\natom-text-editor-minimap[stand-alone] {\n  width: 100px;\n  height: 100px;\n}\n\natom-text-editor, atom-text-editor::shadow {\n  line-height: 17px;\n}\n\natom-text-editor atom-text-editor-minimap, atom-text-editor::shadow atom-text-editor-minimap {\n  background: rgba(255,0,0,0.3);\n}\n\natom-text-editor atom-text-editor-minimap::shadow .minimap-scroll-indicator, atom-text-editor::shadow atom-text-editor-minimap::shadow .minimap-scroll-indicator {\n  background: rgba(0,0,255,0.3);\n}\n\natom-text-editor atom-text-editor-minimap::shadow .minimap-visible-area, atom-text-editor::shadow atom-text-editor-minimap::shadow .minimap-visible-area {\n  background: rgba(0,255,0,0.3);\n  opacity: 1;\n}\n\natom-text-editor::shadow atom-text-editor-minimap::shadow .open-minimap-quick-settings {\n  opacity: 1 !important;\n}";
    return jasmineContent.appendChild(styleNode);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9oZWxwZXJzL3dvcmtzcGFjZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsMkJBQXhCLENBRGpCLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFaLENBQTJCLGNBQTNCLENBRmIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFBQyxZQUFBLFVBQUQ7R0FKakIsQ0FBQTs7QUFBQSxFQU1BLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLHFDQUFBO0FBQUEsSUFBQSxJQUFPLHNDQUFQO0FBQ0UsTUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsR0FBaUMsU0FBQyxJQUFELEdBQUE7ZUFBYyxJQUFBLFVBQUEsQ0FBVyxJQUFYLEVBQWQ7TUFBQSxDQURqQyxDQURGO0tBQUE7QUFBQSxJQUlBLGNBQUEsR0FBaUIsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFkLENBQTRCLGtCQUE1QixDQUpqQixDQUFBO0FBQUEsSUFLQSxTQUFBLEdBQVksUUFBUSxDQUFDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FMWixDQUFBO0FBQUEsSUFNQSxTQUFTLENBQUMsV0FBVixHQUF3QixFQUFBLEdBQ3hCLFVBRHdCLEdBQ2IseXpCQVBYLENBQUE7V0FvQ0EsY0FBYyxDQUFDLFdBQWYsQ0FBMkIsU0FBM0IsRUFyQ1M7RUFBQSxDQUFYLENBTkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Kamilius/.atom/packages/minimap/spec/helpers/workspace.coffee
