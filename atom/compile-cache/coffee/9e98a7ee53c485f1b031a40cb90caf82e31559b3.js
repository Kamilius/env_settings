(function() {
  var $, Config, Files, Fs, SavePrompt;

  $ = require('atom-space-pen-views').$;

  Fs = require('fs');

  Config = require('./config');

  Files = require('./files');

  SavePrompt = require('./save-prompt');

  module.exports = {
    config: {
      restoreOpenFileContents: {
        type: 'boolean',
        "default": true,
        description: 'Restore the contents of files that were unsaved in the last session'
      },
      skipSavePrompt: {
        type: 'boolean',
        "default": true,
        description: 'Disable the save on exit prompt'
      },
      extraDelay: {
        type: 'integer',
        "default": 500,
        description: "Add an extra delay time in ms for auto saving files after typing."
      },
      dataSaveFolder: {
        type: 'string',
        description: 'The folder in which to save project states'
      }
    },
    activate: function(state) {
      if (Config.saveFolder() == null) {
        Config.saveFolderDefault();
      }
      SavePrompt.activate();
      return Files.activate();
    }
  };

}).call(this);
