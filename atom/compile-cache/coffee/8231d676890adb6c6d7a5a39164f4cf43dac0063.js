(function() {
  var Config;

  Config = require('./config');

  module.exports = {
    activate: function() {
      return this.addListeners();
    },
    enableTemp: function(pane) {
      return pane.promptToSaveItem = function(item) {
        var save;
        save = pane.promptToSaveItem2(item);
        pane.promptToSaveItem = function(item) {
          return true;
        };
        return save;
      };
    },
    addListeners: function() {
      Config.observe('skipSavePrompt', function(val) {
        return atom.workspace.getPanes().map(function(pane) {
          if (val) {
            return pane.promptToSaveItem = function(item) {
              return true;
            };
          } else if (pane.promptToSaveItem2) {
            return pane.promptToSaveItem = function(item) {
              return pane.promptToSaveItem2(item);
            };
          }
        });
      });
      return atom.workspace.observePanes((function(_this) {
        return function(pane) {
          pane.promptToSaveItem2 = pane.promptToSaveItem;
          if (Config.skipSavePrompt()) {
            pane.promptToSaveItem = function(item) {
              return true;
            };
          }
          return pane.onWillDestroyItem(function(event) {
            if (Config.skipSavePrompt()) {
              return _this.enableTemp(pane);
            } else {
              return pane.promptToSaveItem = function(item) {
                return pane.promptToSaveItem2(item);
              };
            }
          });
        };
      })(this));
    }
  };

}).call(this);
