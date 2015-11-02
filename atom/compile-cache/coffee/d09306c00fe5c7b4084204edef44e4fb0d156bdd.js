(function() {
  var Helpers, Range, child_process, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Range = require('atom').Range;

  path = require('path');

  child_process = require('child_process');

  Helpers = module.exports = {
    error: function(e) {
      return atom.notifications.addError(e.toString(), {
        detail: e.stack || '',
        dismissable: true
      });
    },
    shouldTriggerLinter: function(linter, onChange, scopes) {
      if (onChange && !linter.lintOnFly) {
        return false;
      }
      if (!scopes.some(function(entry) {
        return __indexOf.call(linter.grammarScopes, entry) >= 0;
      })) {
        return false;
      }
      return true;
    },
    requestUpdateFrame: function(callback) {
      return setTimeout(callback, 100);
    },
    debounce: function(callback, delay) {
      var timeout;
      timeout = null;
      return function(arg) {
        clearTimeout(timeout);
        return timeout = setTimeout((function(_this) {
          return function() {
            return callback.call(_this, arg);
          };
        })(this), delay);
      };
    },
    isPathIgnored: function(filePath) {
      var i, projectPath, repo, _i, _len, _ref;
      repo = null;
      _ref = atom.project.getPaths();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        projectPath = _ref[i];
        if (filePath.indexOf(projectPath + path.sep) === 0) {
          repo = atom.project.getRepositories()[i];
          break;
        }
      }
      if (repo && repo.isProjectAtRoot() && repo.isPathIgnored(filePath)) {
        return true;
      }
      return false;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaGVscGVycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUNBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUixDQUZoQixDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxPQUFQLEdBQ1I7QUFBQSxJQUFBLEtBQUEsRUFBTyxTQUFDLENBQUQsR0FBQTthQUNMLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsQ0FBQyxDQUFDLFFBQUYsQ0FBQSxDQUE1QixFQUEwQztBQUFBLFFBQUMsTUFBQSxFQUFRLENBQUMsQ0FBQyxLQUFGLElBQVcsRUFBcEI7QUFBQSxRQUF3QixXQUFBLEVBQWEsSUFBckM7T0FBMUMsRUFESztJQUFBLENBQVA7QUFBQSxJQUVBLG1CQUFBLEVBQXFCLFNBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsTUFBbkIsR0FBQTtBQUluQixNQUFBLElBQWdCLFFBQUEsSUFBYSxDQUFBLE1BQVUsQ0FBQyxTQUF4QztBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxNQUEwQixDQUFDLElBQVAsQ0FBWSxTQUFDLEtBQUQsR0FBQTtlQUFXLGVBQVMsTUFBTSxDQUFDLGFBQWhCLEVBQUEsS0FBQSxPQUFYO01BQUEsQ0FBWixDQUFwQjtBQUFBLGVBQU8sS0FBUCxDQUFBO09BREE7QUFFQSxhQUFPLElBQVAsQ0FObUI7SUFBQSxDQUZyQjtBQUFBLElBU0Esa0JBQUEsRUFBb0IsU0FBQyxRQUFELEdBQUE7YUFDbEIsVUFBQSxDQUFXLFFBQVgsRUFBcUIsR0FBckIsRUFEa0I7SUFBQSxDQVRwQjtBQUFBLElBV0EsUUFBQSxFQUFVLFNBQUMsUUFBRCxFQUFXLEtBQVgsR0FBQTtBQUNSLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUNBLGFBQU8sU0FBQyxHQUFELEdBQUE7QUFDTCxRQUFBLFlBQUEsQ0FBYSxPQUFiLENBQUEsQ0FBQTtlQUNBLE9BQUEsR0FBVSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ25CLFFBQVEsQ0FBQyxJQUFULENBQWMsS0FBZCxFQUFvQixHQUFwQixFQURtQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFFUixLQUZRLEVBRkw7TUFBQSxDQUFQLENBRlE7SUFBQSxDQVhWO0FBQUEsSUFrQkEsYUFBQSxFQUFlLFNBQUMsUUFBRCxHQUFBO0FBQ2IsVUFBQSxvQ0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUNBO0FBQUEsV0FBQSxtREFBQTs4QkFBQTtBQUNFLFFBQUEsSUFBRyxRQUFRLENBQUMsT0FBVCxDQUFpQixXQUFBLEdBQWMsSUFBSSxDQUFDLEdBQXBDLENBQUEsS0FBNEMsQ0FBL0M7QUFDRSxVQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWIsQ0FBQSxDQUErQixDQUFBLENBQUEsQ0FBdEMsQ0FBQTtBQUNBLGdCQUZGO1NBREY7QUFBQSxPQURBO0FBS0EsTUFBQSxJQUFlLElBQUEsSUFBUyxJQUFJLENBQUMsZUFBTCxDQUFBLENBQVQsSUFBb0MsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsUUFBbkIsQ0FBbkQ7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUxBO0FBTUEsYUFBTyxLQUFQLENBUGE7SUFBQSxDQWxCZjtHQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Kamilius/.atom/packages/linter/lib/helpers.coffee
