(function() {
  var BufferedNodeProcess, BufferedProcess, Helpers, TextEditor, XRegExp, fs, path, tmp, xcache, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, BufferedNodeProcess = _ref.BufferedNodeProcess, TextEditor = _ref.TextEditor;

  path = require('path');

  fs = require('fs');

  path = require('path');

  tmp = require('tmp');

  xcache = new Map;

  XRegExp = null;

  module.exports = Helpers = {
    exec: function(command, args, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return this._exec(command, args, options, false);
    },
    execNode: function(filePath, args, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return this._exec(filePath, args, options, true);
    },
    _exec: function(command, args, options, isNodeExecutable) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (isNodeExecutable == null) {
        isNodeExecutable = false;
      }
      if (options.stream == null) {
        options.stream = 'stdout';
      }
      if (options.throwOnStdErr == null) {
        options.throwOnStdErr = true;
      }
      return new Promise(function(resolve, reject) {
        var data, exit, prop, spawnedProcess, stderr, stdout, value, _ref1;
        data = {
          stdout: [],
          stderr: []
        };
        stdout = function(output) {
          return data.stdout.push(output.toString());
        };
        stderr = function(output) {
          return data.stderr.push(output.toString());
        };
        exit = function() {
          if (options.stream === 'stdout') {
            if (data.stderr.length && options.throwOnStdErr) {
              return reject(new Error(data.stderr.join('')));
            } else {
              return resolve(data.stdout.join(''));
            }
          } else if (options.stream === 'both') {
            return resolve({
              stdout: data.stdout.join(''),
              stderr: data.stderr.join('')
            });
          } else {
            return resolve(data.stderr.join(''));
          }
        };
        if (isNodeExecutable) {
          if (options.env == null) {
            options.env = {};
          }
          _ref1 = process.env;
          for (prop in _ref1) {
            value = _ref1[prop];
            if (prop !== 'OS') {
              options.env[prop] = value;
            }
          }
          spawnedProcess = new BufferedNodeProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        } else {
          spawnedProcess = new BufferedProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        }
        spawnedProcess.onWillThrowError((function(_this) {
          return function(_arg) {
            var error, handle;
            error = _arg.error, handle = _arg.handle;
            if (error && error.code === 'ENOENT') {
              return reject(error);
            }
            handle();
            if (error.code === 'EACCES') {
              error = new Error("Failed to spawn command `" + command + "`. Make sure it's a file, not a directory and it's executable.");
              error.name = 'BufferedProcessError';
            }
            return reject(error);
          };
        })(this));
        if (options.stdin) {
          spawnedProcess.process.stdin.write(options.stdin.toString());
          return spawnedProcess.process.stdin.end();
        }
      });
    },
    rangeFromLineNumber: function(textEditor, lineNumber, colStart) {
      if (!(textEditor instanceof TextEditor)) {
        throw new Error('Provided text editor is invalid');
      }
      if (typeof lineNumber === 'undefined') {
        throw new Error('Invalid lineNumber provided');
      }
      if (typeof colStart !== 'number') {
        colStart = textEditor.indentationForBufferRow(lineNumber) * textEditor.getTabLength();
      }
      return [[lineNumber, colStart], [lineNumber, textEditor.getBuffer().lineLengthForRow(lineNumber)]];
    },
    parse: function(data, rawRegex, options) {
      var colEnd, colStart, filePath, line, lineEnd, lineStart, match, regex, toReturn, _i, _len, _ref1;
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to parse");
      }
      if (XRegExp == null) {
        XRegExp = require('xregexp').XRegExp;
      }
      if (options.baseReduction == null) {
        options.baseReduction = 1;
      }
      if (options.flags == null) {
        options.flags = "";
      }
      toReturn = [];
      if (xcache.has(rawRegex)) {
        regex = xcache.get(rawRegex);
      } else {
        xcache.set(rawRegex, regex = XRegExp(rawRegex, options.flags));
      }
      if (typeof data !== 'string') {
        throw new Error("Input must be a string");
      }
      _ref1 = data.split(/\r?\n/);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        match = XRegExp.exec(line, regex);
        if (match) {
          if (!options.baseReduction) {
            options.baseReduction = 1;
          }
          lineStart = 0;
          if (match.line) {
            lineStart = match.line - options.baseReduction;
          }
          if (match.lineStart) {
            lineStart = match.lineStart - options.baseReduction;
          }
          colStart = 0;
          if (match.col) {
            colStart = match.col - options.baseReduction;
          }
          if (match.colStart) {
            colStart = match.colStart - options.baseReduction;
          }
          lineEnd = 0;
          if (match.line) {
            lineEnd = match.line - options.baseReduction;
          }
          if (match.lineEnd) {
            lineEnd = match.lineEnd - options.baseReduction;
          }
          colEnd = 0;
          if (match.col) {
            colEnd = match.col - options.baseReduction;
          }
          if (match.colEnd) {
            colEnd = match.colEnd - options.baseReduction;
          }
          filePath = match.file;
          if (options.filePath) {
            filePath = options.filePath;
          }
          toReturn.push({
            type: match.type,
            text: match.message,
            filePath: filePath,
            range: [[lineStart, colStart], [lineEnd, colEnd]]
          });
        }
      }
      return toReturn;
    },
    findFile: function(startDir, names) {
      var currentDir, filePath, name, _i, _len;
      if (!arguments.length) {
        throw new Error("Specify a filename to find");
      }
      if (!(names instanceof Array)) {
        names = [names];
      }
      startDir = startDir.split(path.sep);
      while (startDir.length && startDir.join(path.sep)) {
        currentDir = startDir.join(path.sep);
        for (_i = 0, _len = names.length; _i < _len; _i++) {
          name = names[_i];
          filePath = path.join(currentDir, name);
          try {
            fs.accessSync(filePath, fs.R_OK);
            return filePath;
          } catch (_error) {}
        }
        startDir.pop();
      }
      return null;
    },
    tempFile: function(fileName, fileContents, callback) {
      if (typeof fileName !== 'string') {
        throw new Error('Invalid fileName provided');
      }
      if (typeof fileContents !== 'string') {
        throw new Error('Invalid fileContent provided');
      }
      if (typeof callback !== 'function') {
        throw new Error('Invalid Callback provided');
      }
      return new Promise(function(resolve, reject) {
        return tmp.dir({
          prefix: 'atom-linter_'
        }, function(err, dirPath, cleanupCallback) {
          var filePath;
          if (err) {
            return reject(err);
          }
          filePath = path.join(dirPath, fileName);
          return fs.writeFile(filePath, fileContents, function(err) {
            if (err) {
              cleanupCallback();
              return reject(err);
            }
            return (new Promise(function(resolve) {
              return resolve(callback(filePath));
            })).then(function(result) {
              fs.unlink(filePath, function() {
                return fs.rmdir(dirPath);
              });
              return result;
            }).then(resolve, reject);
          });
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvbm9kZV9tb2R1bGVzL2F0b20tbGludGVyL2xpYi9oZWxwZXJzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrRkFBQTs7QUFBQSxFQUFBLE9BQXFELE9BQUEsQ0FBUSxNQUFSLENBQXJELEVBQUMsdUJBQUEsZUFBRCxFQUFrQiwyQkFBQSxtQkFBbEIsRUFBdUMsa0JBQUEsVUFBdkMsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUpOLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsR0FBQSxDQUFBLEdBTlQsQ0FBQTs7QUFBQSxFQU9BLE9BQUEsR0FBVSxJQVBWLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFBLEdBSWY7QUFBQSxJQUFBLElBQUEsRUFBTSxTQUFDLE9BQUQsRUFBVSxJQUFWLEVBQXFCLE9BQXJCLEdBQUE7O1FBQVUsT0FBTztPQUNyQjs7UUFEeUIsVUFBVTtPQUNuQztBQUFBLE1BQUEsSUFBQSxDQUFBLFNBQXNELENBQUMsTUFBdkQ7QUFBQSxjQUFVLElBQUEsS0FBQSxDQUFNLHFCQUFOLENBQVYsQ0FBQTtPQUFBO0FBQ0EsYUFBTyxJQUFDLENBQUEsS0FBRCxDQUFPLE9BQVAsRUFBZ0IsSUFBaEIsRUFBc0IsT0FBdEIsRUFBK0IsS0FBL0IsQ0FBUCxDQUZJO0lBQUEsQ0FBTjtBQUFBLElBSUEsUUFBQSxFQUFVLFNB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

//# sourceURL=/Users/Kamilius/.atom/packages/linter-eslint/node_modules/atom-linter/lib/helpers.coffee
