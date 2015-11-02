Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _jshintSrcCli = require('jshint/src/cli');

var _jshintSrcCli2 = _interopRequireDefault(_jshintSrcCli);

var _userHome = require('user-home');

// from JSHint //
// Storage for memoized results from find file
// Should prevent lots of directory traversal &
// lookups when liniting an entire project

var _userHome2 = _interopRequireDefault(_userHome);

'use babel';

var findFileResults = {};

/**
 * Searches for a file with a specified name starting with
 * 'dir' and going all the way up either until it finds the file
 * or hits the root.
 *
 * @param {string} name filename to search for (e.g. .jshintrc)
 * @param {string} dir  directory to start search from
 *
 * @returns {string} normalized filename
 */
var findFile = function findFile(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var name = _x,
        dir = _x2;
    filename = parent = undefined;
    _again = false;

    var filename = _path2['default'].normalize(_path2['default'].join(dir, name));
    if (findFileResults[filename] !== undefined) {
      return findFileResults[filename];
    }

    var parent = _path2['default'].resolve(dir, '../');

    if (_shelljs2['default'].test('-e', filename)) {
      findFileResults[filename] = filename;
      return filename;
    }

    if (dir === parent) {
      findFileResults[filename] = null;
      return null;
    }

    _x = name;
    _x2 = parent;
    _again = true;
    continue _function;
  }
};

/**
 * Tries to find a configuration file in either project directory
 * or in the home directory. Configuration files are named
 * '.jshintrc'.
 *
 * @param {string} file path to the file to be linted
 * @returns {string} a path to the config file
 */
var findConfig = function findConfig(file) {
  var dir = _path2['default'].dirname(_path2['default'].resolve(file));
  var home = _path2['default'].normalize(_path2['default'].join(_userHome2['default'], '.jshintrc'));

  var proj = findFile('.jshintrc', dir);
  if (proj) {
    return proj;
  }

  if (_shelljs2['default'].test('-e', home)) {
    return home;
  }

  return null;
};

/**
 * Tries to find JSHint configuration within a package.json file
 * (if any). It search in the current directory and then goes up
 * all the way to the root just like findFile.
 *
 * @param   {string} file path to the file to be linted
 * @returns {object} config object
 */
var loadNpmConfig = function loadNpmConfig(file) {
  var dir = _path2['default'].dirname(_path2['default'].resolve(file));
  var fp = findFile('package.json', dir);

  if (!fp) {
    return null;
  }

  try {
    return require(fp).jshintConfig;
  } catch (e) {
    return null;
  }
};
// / //

var loadConfigIfValid = function loadConfigIfValid(filename) {
  var strip = require('strip-json-comments');
  try {
    JSON.parse(strip(_fs2['default'].readFileSync(filename, 'utf8')));
    return _jshintSrcCli2['default'].loadConfig(filename);
  } catch (e) {}
  return {};
};

var loadConfig = function loadConfig(file) {
  var config = loadNpmConfig(file) || loadConfigIfValid(findConfig(file));
  if (config && config.dirname) {
    delete config.dirname;
  }
  return config;
};

exports['default'] = loadConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9qc2hpbnQvbG9hZC1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7Ozt1QkFDTixTQUFTOzs7OzRCQUNWLGdCQUFnQjs7Ozt3QkFDWCxXQUFXOzs7Ozs7Ozs7QUFOaEMsV0FBVyxDQUFDOztBQVlaLElBQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7O0FBWTNCLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUTs7OzRCQUFrQjtRQUFkLElBQUk7UUFBRSxHQUFHO0FBQ25CLFlBQVEsR0FLUixNQUFNOzs7QUFMWixRQUFNLFFBQVEsR0FBRyxrQkFBSyxTQUFTLENBQUMsa0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3RELFFBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRTtBQUMzQyxhQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNsQzs7QUFFRCxRQUFNLE1BQU0sR0FBRyxrQkFBSyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUV4QyxRQUFJLHFCQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUU7QUFDN0IscUJBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUM7QUFDckMsYUFBTyxRQUFRLENBQUM7S0FDakI7O0FBRUQsUUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFO0FBQ2xCLHFCQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLGFBQU8sSUFBSSxDQUFDO0tBQ2I7O1NBRWUsSUFBSTtVQUFFLE1BQU07OztHQUM3QjtDQUFBLENBQUM7Ozs7Ozs7Ozs7QUFVRixJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBRyxJQUFJLEVBQUk7QUFDekIsTUFBTSxHQUFHLEdBQUksa0JBQUssT0FBTyxDQUFDLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sSUFBSSxHQUFHLGtCQUFLLFNBQVMsQ0FBQyxrQkFBSyxJQUFJLHdCQUFXLFdBQVcsQ0FBQyxDQUFDLENBQUM7O0FBRTlELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEMsTUFBSSxJQUFJLEVBQUU7QUFDUixXQUFPLElBQUksQ0FBQztHQUNiOztBQUVELE1BQUkscUJBQUssSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtBQUN6QixXQUFPLElBQUksQ0FBQztHQUNiOztBQUVELFNBQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQzs7Ozs7Ozs7OztBQVVGLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBRyxJQUFJLEVBQUk7QUFDNUIsTUFBTSxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzdDLE1BQU0sRUFBRSxHQUFJLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRTFDLE1BQUksQ0FBQyxFQUFFLEVBQUU7QUFDUCxXQUFPLElBQUksQ0FBQztHQUNiOztBQUVELE1BQUk7QUFDRixXQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUM7R0FDakMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLFdBQU8sSUFBSSxDQUFDO0dBQ2I7Q0FDRixDQUFDOzs7QUFHRixJQUFNLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFHLFFBQVEsRUFBSTtBQUNyQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM3QyxNQUFJO0FBQ0gsUUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZ0JBQUcsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQsV0FBTywwQkFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDaEMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNYO0FBQ0QsU0FBTyxFQUFFLENBQUM7Q0FDVixDQUFDOztBQUVGLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFHLElBQUksRUFBSTtBQUMxQixNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDMUUsTUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUM3QixXQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUM7R0FDdEI7QUFDRCxTQUFPLE1BQU0sQ0FBQztDQUNkLENBQUM7O3FCQUVhLFVBQVUiLCJmaWxlIjoiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2pzaGludC9sb2FkLWNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgc2hqcyBmcm9tICdzaGVsbGpzJztcbmltcG9ydCBjbGkgZnJvbSAnanNoaW50L3NyYy9jbGknO1xuaW1wb3J0IHVzZXJIb21lIGZyb20gJ3VzZXItaG9tZSc7XG5cbi8vIGZyb20gSlNIaW50IC8vXG4vLyBTdG9yYWdlIGZvciBtZW1vaXplZCByZXN1bHRzIGZyb20gZmluZCBmaWxlXG4vLyBTaG91bGQgcHJldmVudCBsb3RzIG9mIGRpcmVjdG9yeSB0cmF2ZXJzYWwgJlxuLy8gbG9va3VwcyB3aGVuIGxpbml0aW5nIGFuIGVudGlyZSBwcm9qZWN0XG5jb25zdCBmaW5kRmlsZVJlc3VsdHMgPSB7fTtcblxuLyoqXG4gKiBTZWFyY2hlcyBmb3IgYSBmaWxlIHdpdGggYSBzcGVjaWZpZWQgbmFtZSBzdGFydGluZyB3aXRoXG4gKiAnZGlyJyBhbmQgZ29pbmcgYWxsIHRoZSB3YXkgdXAgZWl0aGVyIHVudGlsIGl0IGZpbmRzIHRoZSBmaWxlXG4gKiBvciBoaXRzIHRoZSByb290LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIGZpbGVuYW1lIHRvIHNlYXJjaCBmb3IgKGUuZy4gLmpzaGludHJjKVxuICogQHBhcmFtIHtzdHJpbmd9IGRpciAgZGlyZWN0b3J5IHRvIHN0YXJ0IHNlYXJjaCBmcm9tXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gbm9ybWFsaXplZCBmaWxlbmFtZVxuICovXG5jb25zdCBmaW5kRmlsZSA9IChuYW1lLCBkaXIpID0+IHtcbiAgY29uc3QgZmlsZW5hbWUgPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4oZGlyLCBuYW1lKSk7XG4gIGlmIChmaW5kRmlsZVJlc3VsdHNbZmlsZW5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmluZEZpbGVSZXN1bHRzW2ZpbGVuYW1lXTtcbiAgfVxuXG4gIGNvbnN0IHBhcmVudCA9IHBhdGgucmVzb2x2ZShkaXIsICcuLi8nKTtcblxuICBpZiAoc2hqcy50ZXN0KCctZScsIGZpbGVuYW1lKSkge1xuICAgIGZpbmRGaWxlUmVzdWx0c1tmaWxlbmFtZV0gPSBmaWxlbmFtZTtcbiAgICByZXR1cm4gZmlsZW5hbWU7XG4gIH1cblxuICBpZiAoZGlyID09PSBwYXJlbnQpIHtcbiAgICBmaW5kRmlsZVJlc3VsdHNbZmlsZW5hbWVdID0gbnVsbDtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBmaW5kRmlsZShuYW1lLCBwYXJlbnQpO1xufTtcblxuLyoqXG4gKiBUcmllcyB0byBmaW5kIGEgY29uZmlndXJhdGlvbiBmaWxlIGluIGVpdGhlciBwcm9qZWN0IGRpcmVjdG9yeVxuICogb3IgaW4gdGhlIGhvbWUgZGlyZWN0b3J5LiBDb25maWd1cmF0aW9uIGZpbGVzIGFyZSBuYW1lZFxuICogJy5qc2hpbnRyYycuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGUgcGF0aCB0byB0aGUgZmlsZSB0byBiZSBsaW50ZWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGEgcGF0aCB0byB0aGUgY29uZmlnIGZpbGVcbiAqL1xuY29uc3QgZmluZENvbmZpZyA9IGZpbGUgPT4ge1xuICBjb25zdCBkaXIgID0gcGF0aC5kaXJuYW1lKHBhdGgucmVzb2x2ZShmaWxlKSk7XG4gIGNvbnN0IGhvbWUgPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4odXNlckhvbWUsICcuanNoaW50cmMnKSk7XG5cbiAgY29uc3QgcHJvaiA9IGZpbmRGaWxlKCcuanNoaW50cmMnLCBkaXIpO1xuICBpZiAocHJvaikge1xuICAgIHJldHVybiBwcm9qO1xuICB9XG5cbiAgaWYgKHNoanMudGVzdCgnLWUnLCBob21lKSkge1xuICAgIHJldHVybiBob21lO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIFRyaWVzIHRvIGZpbmQgSlNIaW50IGNvbmZpZ3VyYXRpb24gd2l0aGluIGEgcGFja2FnZS5qc29uIGZpbGVcbiAqIChpZiBhbnkpLiBJdCBzZWFyY2ggaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5IGFuZCB0aGVuIGdvZXMgdXBcbiAqIGFsbCB0aGUgd2F5IHRvIHRoZSByb290IGp1c3QgbGlrZSBmaW5kRmlsZS5cbiAqXG4gKiBAcGFyYW0gICB7c3RyaW5nfSBmaWxlIHBhdGggdG8gdGhlIGZpbGUgdG8gYmUgbGludGVkXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBjb25maWcgb2JqZWN0XG4gKi9cbmNvbnN0IGxvYWROcG1Db25maWcgPSBmaWxlID0+IHtcbiAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKHBhdGgucmVzb2x2ZShmaWxlKSk7XG4gIGNvbnN0IGZwICA9IGZpbmRGaWxlKCdwYWNrYWdlLmpzb24nLCBkaXIpO1xuXG4gIGlmICghZnApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoZnApLmpzaGludENvbmZpZztcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59O1xuLy8gLyAvL1xuXG5jb25zdCBsb2FkQ29uZmlnSWZWYWxpZCA9IGZpbGVuYW1lID0+IHtcblx0Y29uc3Qgc3RyaXAgPSByZXF1aXJlKCdzdHJpcC1qc29uLWNvbW1lbnRzJyk7XG5cdHRyeSB7XG5cdFx0SlNPTi5wYXJzZShzdHJpcChmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JykpKTtcblx0XHRyZXR1cm4gY2xpLmxvYWRDb25maWcoZmlsZW5hbWUpO1xuXHR9IGNhdGNoIChlKSB7XG5cdH1cblx0cmV0dXJuIHt9O1xufTtcblxuY29uc3QgbG9hZENvbmZpZyA9IGZpbGUgPT4ge1xuXHRjb25zdCBjb25maWcgPSBsb2FkTnBtQ29uZmlnKGZpbGUpIHx8IGxvYWRDb25maWdJZlZhbGlkKGZpbmRDb25maWcoZmlsZSkpO1xuXHRpZiAoY29uZmlnICYmIGNvbmZpZy5kaXJuYW1lKSB7XG5cdFx0ZGVsZXRlIGNvbmZpZy5kaXJuYW1lO1xuXHR9XG5cdHJldHVybiBjb25maWc7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBsb2FkQ29uZmlnO1xuIl19