(function() {
  var Helpers, XRegExp, child_process, fs, path, xcache;

  child_process = require('child_process');

  path = require('path');

  fs = require('fs');

  path = require('path');

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
      if (options.stream == null) {
        options.stream = 'stdout';
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      return new Promise(function(resolve, reject) {
        var data, spawnedProcess;
        spawnedProcess = child_process.spawn(command, args, options);
        data = [];
        if (options.stream === 'stdout') {
          spawnedProcess.stdout.on('data', function(d) {
            return data.push(d.toString());
          });
        } else if (options.stream === 'stderr') {
          spawnedProcess.stderr.on('data', function(d) {
            return data.push(d.toString());
          });
        }
        if (options.stdin) {
          spawnedProcess.stdin.write(options.stdin.toString());
          spawnedProcess.stdin.end();
        }
        spawnedProcess.on('error', function(err) {
          return reject(err);
        });
        return spawnedProcess.on('close', function() {
          return resolve(data.join(''));
        });
      });
    },
    execFilePath: function(command, args, filePath, options) {
      if (args == null) {
        args = [];
      }
      if (options == null) {
        options = {};
      }
      if (!arguments.length) {
        throw new Error("Nothing to execute.");
      }
      if (!filePath) {
        throw new Error("No File Path to work with.");
      }
      return new Promise(function(resolve) {
        if (!options.cwd) {
          options.cwd = path.dirname(filePath);
        }
        args.push(filePath);
        return resolve(Helpers.exec(command, args, options));
      });
    },
    parse: function(data, rawRegex, options) {
      var colEnd, colStart, filePath, line, lineEnd, lineStart, match, regex, toReturn, _i, _len;
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
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        line = data[_i];
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
      while (startDir.length) {
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
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlEQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUixDQUFoQixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLEdBQUEsQ0FBQSxHQUpULENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsSUFMVixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBQSxHQUlmO0FBQUEsSUFBQSxJQUFBLEVBQU0sU0FBQyxPQUFELEVBQVUsSUFBVixFQUFxQixPQUFyQixHQUFBOztRQUFVLE9BQU87T0FDckI7O1FBRHlCLFVBQVU7T0FDbkM7O1FBQUEsT0FBTyxDQUFDLFNBQVU7T0FBbEI7QUFDQSxNQUFBLElBQUEsQ0FBQSxTQUFzRCxDQUFDLE1BQXZEO0FBQUEsY0FBVSxJQUFBLEtBQUEsQ0FBTSxxQkFBTixDQUFWLENBQUE7T0FEQTtBQUVBLGFBQVcsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ2pCLFlBQUEsb0JBQUE7QUFBQSxRQUFBLGNBQUEsR0FBaUIsYUFBYSxDQUFDLEtBQWQsQ0FBb0IsT0FBcEIsRUFBNkIsSUFBN0IsRUFBbUMsT0FBbkMsQ0FBakIsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLEVBRFAsQ0FBQTtBQUVBLFFBQUEsSUFBRyxPQUFPLENBQUMsTUFBUixLQUFrQixRQUFyQjtBQUNFLFVBQUEsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUF0QixDQUF5QixNQUF6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
//# sourceURL=/Users/Kamilius/.atom/packages/linter-jshint/node_modules/atom-linter/lib/helpers.coffee