Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.install = install;
exports.installPackage = installPackage;

var _helper = require('./helper');

'use babel';
var FS = require('fs');
var Path = require('path');
var View = require('./view');

window.__sb_package_deps = window.__sb_package_deps || [];

function install(packageName) {
  var enablePackages = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  if (!packageName) throw new Error('packageName is required');

  var packageDeps = atom.packages.getLoadedPackage(packageName).metadata['package-deps'] || [];
  var packagesToInstall = [];
  packageDeps.forEach(function (name) {
    if (__sb_package_deps.indexOf(name) === -1) {
      __sb_package_deps.push(name);
      if (!atom.packages.resolvePackagePath(name)) {
        packagesToInstall.push(name);
      } else if (!atom.packages.getActivePackage(name) && enablePackages) {
        atom.packages.enablePackage(name);
        atom.packages.activatePackage(name);
      }
    }
  });
  if (packagesToInstall.length) {
    return installPackage(packageName, packagesToInstall);
  } else return Promise.resolve();
}

function installPackage(packageName, packageNames) {
  var view = new View(packageName, packageNames);
  return view.createNotification().then(function () {
    return (0, _helper.installPackages)(packageNames, function (name) {
      view.markFinished();
      atom.packages.enablePackage(name);
      atom.packages.activatePackage(name);
    }, function (detail) {
      view.notification.dismiss();
      atom.notifications.addError('Error installing ' + packageName + ' dependencies', { detail: detail });
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNjcy9ub2RlX21vZHVsZXMvYXRvbS1wYWNrYWdlLWRlcHMvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3NCQUk4QixVQUFVOztBQUp4QyxXQUFXLENBQUE7QUFDWCxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDeEIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzVCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFHOUIsTUFBTSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLENBQUE7O0FBRWxELFNBQVMsT0FBTyxDQUFDLFdBQVcsRUFBeUI7TUFBdkIsY0FBYyx5REFBRyxJQUFJOztBQUN4RCxNQUFJLENBQUMsV0FBVyxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQTs7QUFFNUQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQzlGLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFBO0FBQzVCLGFBQVcsQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJLEVBQUU7QUFDakMsUUFBSSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDMUMsdUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzVCLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzNDLHlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUM3QixNQUFNLElBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsRUFBRTtBQUNqRSxZQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNqQyxZQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtPQUNwQztLQUNGO0dBQ0YsQ0FBQyxDQUFBO0FBQ0YsTUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUU7QUFDNUIsV0FBTyxjQUFjLENBQUMsV0FBVyxFQUFFLGlCQUFpQixDQUFDLENBQUE7R0FDdEQsTUFBTSxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtDQUNoQzs7QUFFTSxTQUFTLGNBQWMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFO0FBQ3hELE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQTtBQUNoRCxTQUFPLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksQ0FBQztXQUNwQyw2QkFBZ0IsWUFBWSxFQUFFLFVBQVMsSUFBSSxFQUFFO0FBQzNDLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtBQUNuQixVQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNqQyxVQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNwQyxFQUFFLFVBQVMsTUFBTSxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDM0IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLHVCQUFxQixXQUFXLG9CQUFpQixFQUFDLE1BQU0sRUFBTixNQUFNLEVBQUMsQ0FBQyxDQUFBO0tBQ3RGLENBQUM7R0FBQSxDQUNILENBQUE7Q0FDRiIsImZpbGUiOiIvVXNlcnMvS2FtaWxpdXMvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvbm9kZV9tb2R1bGVzL2F0b20tcGFja2FnZS1kZXBzL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbmNvbnN0IEZTID0gcmVxdWlyZSgnZnMnKVxuY29uc3QgUGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpXG5pbXBvcnQge2luc3RhbGxQYWNrYWdlc30gZnJvbSAnLi9oZWxwZXInXG5cbndpbmRvdy5fX3NiX3BhY2thZ2VfZGVwcyA9IHdpbmRvdy5fX3NiX3BhY2thZ2VfZGVwcyB8fCBbXVxuXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFsbChwYWNrYWdlTmFtZSwgZW5hYmxlUGFja2FnZXMgPSB0cnVlKSB7XG4gIGlmICghcGFja2FnZU5hbWUpIHRocm93IG5ldyBFcnJvcigncGFja2FnZU5hbWUgaXMgcmVxdWlyZWQnKVxuXG4gIGNvbnN0IHBhY2thZ2VEZXBzID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKHBhY2thZ2VOYW1lKS5tZXRhZGF0YVsncGFja2FnZS1kZXBzJ10gfHwgW11cbiAgY29uc3QgcGFja2FnZXNUb0luc3RhbGwgPSBbXVxuICBwYWNrYWdlRGVwcy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoX19zYl9wYWNrYWdlX2RlcHMuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHtcbiAgICAgIF9fc2JfcGFja2FnZV9kZXBzLnB1c2gobmFtZSlcbiAgICAgIGlmICghYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgobmFtZSkpIHtcbiAgICAgICAgcGFja2FnZXNUb0luc3RhbGwucHVzaChuYW1lKVxuICAgICAgfSBlbHNlIGlmKCFhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UobmFtZSkgJiYgZW5hYmxlUGFja2FnZXMpIHtcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5lbmFibGVQYWNrYWdlKG5hbWUpXG4gICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKG5hbWUpXG4gICAgICB9XG4gICAgfVxuICB9KVxuICBpZiAocGFja2FnZXNUb0luc3RhbGwubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGluc3RhbGxQYWNrYWdlKHBhY2thZ2VOYW1lLCBwYWNrYWdlc1RvSW5zdGFsbClcbiAgfSBlbHNlIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFsbFBhY2thZ2UocGFja2FnZU5hbWUsIHBhY2thZ2VOYW1lcykge1xuICBjb25zdCB2aWV3ID0gbmV3IFZpZXcocGFja2FnZU5hbWUsIHBhY2thZ2VOYW1lcylcbiAgcmV0dXJuIHZpZXcuY3JlYXRlTm90aWZpY2F0aW9uKCkudGhlbigoKSA9PlxuICAgIGluc3RhbGxQYWNrYWdlcyhwYWNrYWdlTmFtZXMsIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZpZXcubWFya0ZpbmlzaGVkKClcbiAgICAgIGF0b20ucGFja2FnZXMuZW5hYmxlUGFja2FnZShuYW1lKVxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UobmFtZSlcbiAgICB9LCBmdW5jdGlvbihkZXRhaWwpIHtcbiAgICAgIHZpZXcubm90aWZpY2F0aW9uLmRpc21pc3MoKVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBFcnJvciBpbnN0YWxsaW5nICR7cGFja2FnZU5hbWV9IGRlcGVuZGVuY2llc2AsIHtkZXRhaWx9KVxuICAgIH0pXG4gIClcbn1cbiJdfQ==
//# sourceURL=/Users/Kamilius/.atom/packages/linter-jscs/node_modules/atom-package-deps/lib/main.js