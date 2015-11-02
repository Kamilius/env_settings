(function() {
  var Range, Validate, helpers;

  Range = require('atom').Range;

  helpers = require('./helpers');

  module.exports = Validate = {
    linter: function(linter) {
      if (!(linter.grammarScopes instanceof Array)) {
        throw new Error("grammarScopes is not an Array. Got: " + linter.grammarScopes);
      }
      if (linter.lint) {
        if (typeof linter.lint !== 'function') {
          throw new Error("linter.lint isn't a function on provider");
        }
      } else {
        throw new Error('Missing linter.lint on provider');
      }
      if (linter.name) {
        if (typeof linter.name !== 'string') {
          throw new Error('Linter.name must be a string');
        }
      } else {
        linter.name = null;
      }
      if (linter.scope && typeof linter.scope === 'string') {
        linter.scope = linter.scope.toLowerCase();
      }
      if (linter.scope !== 'file' && linter.scope !== 'project') {
        throw new Error('Linter.scope must be either `file` or `project`');
      }
      return true;
    },
    messages: function(messages, linter) {
      if (!(messages instanceof Array)) {
        throw new Error("Expected messages to be array, provided: " + (typeof messages));
      }
      if (!linter) {
        throw new Error('No linter provided');
      }
      messages.forEach(function(result) {
        if (result.type) {
          if (typeof result.type !== 'string') {
            throw new Error('Invalid type field on Linter Response');
          }
        } else {
          throw new Error('Missing type field on Linter Response');
        }
        if (result.html) {
          if (typeof result.html !== 'string') {
            throw new Error('Invalid html field on Linter Response');
          }
        } else if (result.text) {
          if (typeof result.text !== 'string') {
            throw new Error('Invalid text field on Linter Response');
          }
        } else {
          throw new Error('Missing html/text field on Linter Response');
        }
        if (result.trace) {
          if (!(result.trace instanceof Array)) {
            throw new Error('Invalid trace field on Linter Response');
          }
        } else {
          result.trace = null;
        }
        if (result["class"]) {
          if (typeof result["class"] !== 'string') {
            throw new Error('Invalid class field on Linter Response');
          }
        } else {
          result["class"] = result.type.toLowerCase().replace(' ', '-');
        }
        if (result.filePath) {
          if (typeof result.filePath !== 'string') {
            throw new Error('Invalid filePath field on Linter response');
          }
        } else {
          result.filePath = null;
        }
        if (result.range != null) {
          result.range = Range.fromObject(result.range);
        }
        result.key = JSON.stringify(result);
        result.linter = linter.name;
        if (result.trace && result.trace.length) {
          return Validate.messages(result.trace, linter);
        }
      });
      return void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmFsaWRhdGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQURWLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFBLEdBRWY7QUFBQSxJQUFBLE1BQUEsRUFBUSxTQUFDLE1BQUQsR0FBQTtBQUNOLE1BQUEsSUFBQSxDQUFBLENBQU8sTUFBTSxDQUFDLGFBQVAsWUFBZ0MsS0FBdkMsQ0FBQTtBQUNFLGNBQVUsSUFBQSxLQUFBLENBQU8sc0NBQUEsR0FBc0MsTUFBTSxDQUFDLGFBQXBELENBQVYsQ0FERjtPQUFBO0FBRUEsTUFBQSxJQUFHLE1BQU0sQ0FBQyxJQUFWO0FBQ0UsUUFBQSxJQUErRCxNQUFBLENBQUEsTUFBYSxDQUFDLElBQWQsS0FBd0IsVUFBdkY7QUFBQSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSwwQ0FBTixDQUFWLENBQUE7U0FERjtPQUFBLE1BQUE7QUFHRSxjQUFVLElBQUEsS0FBQSxDQUFNLGlDQUFOLENBQVYsQ0FIRjtPQUZBO0FBTUEsTUFBQSxJQUFHLE1BQU0sQ0FBQyxJQUFWO0FBQ0UsUUFBQSxJQUFtRCxNQUFBLENBQUEsTUFBYSxDQUFDLElBQWQsS0FBd0IsUUFBM0U7QUFBQSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSw4QkFBTixDQUFWLENBQUE7U0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsSUFBZCxDQUhGO09BTkE7QUFVQSxNQUFBLElBQUcsTUFBTSxDQUFDLEtBQVAsSUFBaUIsTUFBQSxDQUFBLE1B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

//# sourceURL=/Users/Kamilius/.atom/packages/linter/lib/validate.coffee
