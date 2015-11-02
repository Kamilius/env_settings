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
        spawnedProcess.onWillThrowError(reject);
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
        options = {
          baseReduction: 1
        };
      }
      if (!arguments.length) {
        throw new Error("Nothing to parse");
      }
      if (XRegExp == null) {
        XRegExp = require('xregexp').XRegExp;
      }
      toReturn = [];
      if (xcache.has(rawRegex)) {
        regex = xcache.get(rawRegex);
      } else {
        xcache.set(rawRegex, regex = XRegExp(rawRegex));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2NzL25vZGVfbW9kdWxlcy9hdG9tLWxpbnRlci9saWIvaGVscGVycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0ZBQUE7O0FBQUEsRUFBQSxPQUFxRCxPQUFBLENBQVEsTUFBUixDQUFyRCxFQUFDLHVCQUFBLGVBQUQsRUFBa0IsMkJBQUEsbUJBQWxCLEVBQXVDLGtCQUFBLFVBQXZDLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FKTixDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLEdBQUEsQ0FBQSxHQU5ULENBQUE7O0FBQUEsRUFPQSxPQUFBLEdBQVUsSUFQVixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBQSxHQUlmO0FBQUEsSUFBQSxJQUFBLEVBQU0sU0FBQyxPQUFELEVBQVUsSUFBVixFQUFxQixPQUFyQixHQUFBOztRQUFVLE9BQU87T0FDckI7O1FBRHlCLFVBQVU7T0FDbkM7QUFBQSxNQUFBLElBQUEsQ0FBQSxTQUFzRCxDQUFDLE1BQXZEO0FBQUEsY0FBVSxJQUFBLEtBQUEsQ0FBTSxxQkFBTixDQUFWLENBQUE7T0FBQTtBQUNBLGFBQU8sSUFBQyxDQUFBLEtBQUQsQ0FBTyxPQUFQLEVBQWdCLElBQWhCLEVBQXNCLE9BQXRCLEVBQStCLEtBQS9CLENBQVAsQ0FGSTtJQUFBLENBQU47QUFBQSxJQUlBLFFBQUEsRUFBVSxTQUFD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

//# sourceURL=/Users/Kamilius/.atom/packages/linter-jscs/node_modules/atom-linter/lib/helpers.coffee
