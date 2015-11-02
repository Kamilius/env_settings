(function() {
  module.exports = {
    config: {
      additionalArguments: {
        title: 'Additional Arguments',
        type: 'string',
        "default": ''
      },
      executablePath: {
        title: 'Executable Path',
        type: 'string',
        "default": ''
      }
    },
    activate: function() {
      return console.log('activate linter-scss-lint');
    }
  };

}).call(this);
