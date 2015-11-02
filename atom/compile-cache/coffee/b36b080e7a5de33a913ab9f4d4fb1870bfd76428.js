(function() {
  var CSON, Comb, CsscombRangeFinder, csscomb, findConfig, fs, syntaxes,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CsscombRangeFinder = require('./csscomb-range-finder');

  Comb = require('csscomb');

  fs = require('fs');

  CSON = require('season');

  module.exports = {
    activate: function(state) {}
  };

  atom.commands.add('atom-text-editor', 'csscomb:run', function() {
    return csscomb(atom.workspace.getActivePaneItem());
  });

  findConfig = function() {
    var csonConfig, jsonConfig, userConfig, _ref, _ref1;
    userConfig = atom.config.get('csscomb');
    if (userConfig) {
      console.log('Found user CSScomb config:', userConfig);
      return userConfig;
    } else {
      jsonConfig = (_ref = atom.project.getDirectories()[0]) != null ? _ref.resolve('.csscomb.json') : void 0;
      csonConfig = (_ref1 = atom.project.getDirectories()[0]) != null ? _ref1.resolve('.csscomb.cson') : void 0;
      if (fs.existsSync(jsonConfig)) {
        console.log('Found project CSScomb config:', jsonConfig);
        return require(jsonConfig);
      } else if (fs.existsSync(csonConfig)) {
        console.log('Found project CSScomb config:', csonConfig);
        return CSON.readFileSync(csonConfig);
      } else {
        console.log('Could not find project CSScomb config, using default: \'csscomb\'');
        return 'csscomb';
      }
    }
  };

  syntaxes = {
    supported: ['css', 'sass', 'scss', 'less'],
    "default": 'css'
  };

  csscomb = function(editor) {
    var comb, config, ranges, syntax, title;
    ranges = CsscombRangeFinder.rangesFor(editor);
    title = editor.getTitle();
    if (title == null) {
      throw new Error('No editor selected');
    }
    syntax = (editor.getTitle().split('.')).pop();
    if (__indexOf.call(syntaxes.supported, syntax) < 0) {
      syntax = syntaxes["default"];
    }
    config = findConfig();
    comb = new Comb(config);
    return ranges.forEach(function(range) {
      var content, result;
      content = editor.getTextInBufferRange(range);
      result = comb.processString(content, {
        syntax: syntax
      });
      return editor.setTextInBufferRange(range, result);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2Nzc2NvbWIvbGliL2Nzc2NvbWIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FBckIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQSxDQUFWO0dBTkYsQ0FBQTs7QUFBQSxFQU9DLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsYUFBdEMsRUFBcUQsU0FBQSxHQUFBO1dBQ3BELE9BQUEsQ0FBUSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBUixFQURvRDtFQUFBLENBQXJELENBUEQsQ0FBQTs7QUFBQSxFQVVBLFVBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxRQUFBLCtDQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLFNBQWhCLENBQWIsQ0FBQTtBQUNBLElBQUEsSUFBRyxVQUFIO0FBQ0UsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDRCQUFaLEVBQTBDLFVBQTFDLENBQUEsQ0FBQTthQUNBLFdBRkY7S0FBQSxNQUFBO0FBSUUsTUFBQSxVQUFBLDJEQUE2QyxDQUFFLE9BQWxDLENBQTBDLGVBQTFDLFVBQWIsQ0FBQTtBQUFBLE1BQ0EsVUFBQSw2REFBNkMsQ0FBRSxPQUFsQyxDQUEwQyxlQUExQyxVQURiLENBQUE7QUFFQSxNQUFBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxVQUFkLENBQUg7QUFDRSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksK0JBQVosRUFBNkMsVUFBN0MsQ0FBQSxDQUFBO2VBQ0EsT0FBQSxDQUFRLFVBQVIsRUFGRjtPQUFBLE1BR0ssSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFVBQWQsQ0FBSDtBQUNILFFBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSwrQkFBWixFQUE2QyxVQUE3QyxDQUFBLENBQUE7ZUFDQSxJQUFJLENBQUMsWUFBTCxDQUFrQixVQUFsQixFQUZHO09BQUEsTUFBQTtBQUlILFFBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxtRUFBWixDQUFBLENBQUE7ZUFDQSxVQUxHO09BVFA7S0FGVztFQUFBLENBVmIsQ0FBQTs7QUFBQSxFQTRCQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFBVyxDQUNULEtBRFMsRUFFVCxNQUZTLEVBR1QsTUFIUyxFQUlULE1BSlMsQ0FBWDtBQUFBLElBTUEsU0FBQSxFQUFTLEtBTlQ7R0E3QkYsQ0FBQTs7QUFBQSxFQXFDQSxPQUFBLEdBQVUsU0FBQyxNQUFELEdBQUE7QUFDUixRQUFBLG1DQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsa0JBQWtCLENBQUMsU0FBbkIsQ0FBNkIsTUFBN0IsQ0FBVCxDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQURSLENBQUE7QUFFQSxJQUFBLElBQTRDLGFBQTVDO0FBQUEsWUFBVSxJQUFBLEtBQUEsQ0FBTSxvQkFBTixDQUFWLENBQUE7S0FGQTtBQUFBLElBR0EsTUFBQSxHQUFTLENBQUMsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQUFpQixDQUFDLEtBQWxCLENBQXdCLEdBQXhCLENBQUQsQ0FBNkIsQ0FBQyxHQUE5QixDQUFBLENBSFQsQ0FBQTtBQUlBLElBQUEsSUFBaUMsZUFBVSxRQUFRLENBQUMsU0FBbkIsRUFBQSxNQUFBLEtBQWpDO0FBQUEsTUFBQSxNQUFBLEdBQVMsUUFBUSxDQUFDLFNBQUQsQ0FBakIsQ0FBQTtLQUpBO0FBQUEsSUFLQSxNQUFBLEdBQVMsVUFBQSxDQUFBLENBTFQsQ0FBQTtBQUFBLElBTUEsSUFBQSxHQUFXLElBQUEsSUFBQSxDQUFLLE1BQUwsQ0FOWCxDQUFBO1dBT0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxTQUFDLEtBQUQsR0FBQTtBQUNiLFVBQUEsZUFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixDQUFWLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsYUFBTCxDQUFtQixPQUFuQixFQUE0QjtBQUFBLFFBQUEsTUFBQSxFQUFRLE1BQVI7T0FBNUIsQ0FEVCxDQUFBO2FBRUEsTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLEVBQW1DLE1BQW5DLEVBSGE7SUFBQSxDQUFmLEVBUlE7RUFBQSxDQXJDVixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Kamilius/.atom/packages/csscomb/lib/csscomb.coffee
