(function() {
  var AtomReact, CompositeDisposable, Disposable, autoCompleteTagCloseRegex, autoCompleteTagStartRegex, contentCheckRegex, decreaseIndentForNextLinePattern, defaultDetectReactFilePattern, jsxComplexAttributePattern, jsxTagStartPattern, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  contentCheckRegex = null;

  defaultDetectReactFilePattern = '/((require\\([\'"]react(?:(-native|\\/addons))?[\'"]\\)))|(import\\s+[\\w{},\\s]+\\s+from\\s+[\'"]react(?:(-native|\\/addons))?[\'"])/';

  autoCompleteTagStartRegex = /(<)([a-zA-Z0-9\.:$_]+)/g;

  autoCompleteTagCloseRegex = /(<\/)([^>]+)(>)/g;

  jsxTagStartPattern = '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))';

  jsxComplexAttributePattern = '(?x)\\{ [^}"\']* $|\\( [^)"\']* $';

  decreaseIndentForNextLinePattern = '(?x) />\\s*(,|;)?\\s*$ | ^\\s*\\S+.*</[-_\\.A-Za-z0-9]+>$';

  AtomReact = (function() {
    AtomReact.prototype.config = {
      enabledForAllJavascriptFiles: {
        type: 'boolean',
        "default": false,
        description: 'Enable grammar, snippets and other features automatically for all .js files.'
      },
      disableAutoClose: {
        type: 'boolean',
        "default": false,
        description: 'Disabled tag autocompletion'
      },
      detectReactFilePattern: {
        type: 'string',
        "default": defaultDetectReactFilePattern
      },
      jsxTagStartPattern: {
        type: 'string',
        "default": jsxTagStartPattern
      },
      jsxComplexAttributePattern: {
        type: 'string',
        "default": jsxComplexAttributePattern
      },
      decreaseIndentForNextLinePattern: {
        type: 'string',
        "default": decreaseIndentForNextLinePattern
      }
    };

    function AtomReact() {}

    AtomReact.prototype.patchEditorLangModeAutoDecreaseIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.languageMode.autoDecreaseIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.languageMode.autoDecreaseIndentForBufferRow = function(bufferRow, options) {
        var currentIndentLevel, decreaseIndentRegex, decreaseNextLineIndentRegex, desiredIndentLevel, increaseIndentRegex, line, precedingLine, precedingRow, scopeDescriptor;
        if (editor.getGrammar().scopeName !== "source.js.jsx") {
          return fn.call(editor.languageMode, bufferRow, options);
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.getRegexForProperty(scopeDescriptor, 'react.decreaseIndentForNextLinePattern');
        decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return;
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        line = this.buffer.lineForRow(bufferRow);
        if (precedingLine && decreaseNextLineIndentRegex.testSync(precedingLine) && !(increaseIndentRegex && increaseIndentRegex.testSync(precedingLine)) && !this.editor.isBufferRowCommented(precedingRow)) {
          currentIndentLevel = this.editor.indentationForBufferRow(precedingRow);
          if (decreaseIndentRegex && decreaseIndentRegex.testSync(line)) {
            currentIndentLevel -= 1;
          }
          desiredIndentLevel = currentIndentLevel - 1;
          if (desiredIndentLevel >= 0 && desiredIndentLevel < currentIndentLevel) {
            return this.editor.setIndentationForBufferRow(bufferRow, desiredIndentLevel);
          }
        } else if (!this.editor.isBufferRowCommented(bufferRow)) {
          return fn.call(editor.languageMode, bufferRow, options);
        }
      };
    };

    AtomReact.prototype.patchEditorLangModeSuggestedIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.languageMode.suggestedIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.languageMode.suggestedIndentForBufferRow = function(bufferRow, options) {
        var complexAttributeRegex, decreaseIndentRegex, decreaseIndentTest, decreaseNextLineIndentRegex, increaseIndentRegex, indent, precedingLine, precedingRow, scopeDescriptor, tagStartRegex, tagStartTest;
        indent = fn.call(editor.languageMode, bufferRow, options);
        if (!(editor.getGrammar().scopeName === "source.js.jsx" && bufferRow > 1)) {
          return indent;
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.getRegexForProperty(scopeDescriptor, 'react.decreaseIndentForNextLinePattern');
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        tagStartRegex = this.getRegexForProperty(scopeDescriptor, 'react.jsxTagStartPattern');
        complexAttributeRegex = this.getRegexForProperty(scopeDescriptor, 'react.jsxComplexAttributePattern');
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return indent;
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        if (precedingLine == null) {
          return indent;
        }
        if (this.editor.isBufferRowCommented(bufferRow) && this.editor.isBufferRowCommented(precedingRow)) {
          return this.editor.indentationForBufferRow(precedingRow);
        }
        tagStartTest = tagStartRegex.testSync(precedingLine);
        decreaseIndentTest = decreaseIndentRegex.testSync(precedingLine);
        if (tagStartTest && complexAttributeRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent += 1;
        }
        if (precedingLine && !decreaseIndentTest && decreaseNextLineIndentRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent -= 1;
        }
        return Math.max(indent, 0);
      };
    };

    AtomReact.prototype.patchEditorLangMode = function(editor) {
      var _ref1, _ref2;
      if ((_ref1 = this.patchEditorLangModeSuggestedIndentForBufferRow(editor)) != null) {
        _ref1.jsxPatch = true;
      }
      return (_ref2 = this.patchEditorLangModeAutoDecreaseIndentForBufferRow(editor)) != null ? _ref2.jsxPatch = true : void 0;
    };

    AtomReact.prototype.isReact = function(text) {
      var match;
      if (atom.config.get('react.enabledForAllJavascriptFiles')) {
        return true;
      }
      if (contentCheckRegex == null) {
        match = (atom.config.get('react.detectReactFilePattern') || defaultDetectReactFilePattern).match(new RegExp('^/(.*?)/([gimy]*)$'));
        contentCheckRegex = new RegExp(match[1], match[2]);
      }
      return text.match(contentCheckRegex) != null;
    };

    AtomReact.prototype.isReactEnabledForEditor = function(editor) {
      var _ref1;
      return (editor != null) && ((_ref1 = editor.getGrammar().scopeName) === "source.js.jsx" || _ref1 === "source.coffee.jsx");
    };

    AtomReact.prototype.autoSetGrammar = function(editor) {
      var extName, jsxGrammar, path;
      if (this.isReactEnabledForEditor(editor)) {
        return;
      }
      path = require('path');
      extName = path.extname(editor.getPath());
      if (extName === ".jsx" || ((extName === ".js" || extName === ".es6") && this.isReact(editor.getText()))) {
        jsxGrammar = atom.grammars.grammarsByScopeName["source.js.jsx"];
        if (jsxGrammar) {
          return editor.setGrammar(jsxGrammar);
        }
      }
    };

    AtomReact.prototype.onHTMLToJSX = function() {
      var HTMLtoJSX, converter, editor, jsxformat, selections;
      jsxformat = require('jsxformat');
      HTMLtoJSX = require('./htmltojsx');
      converter = new HTMLtoJSX({
        createClass: false
      });
      editor = atom.workspace.getActiveTextEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var jsxOutput, range, selection, selectionText, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selections.length; _i < _len; _i++) {
            selection = selections[_i];
            try {
              selectionText = selection.getText();
              jsxOutput = converter.convert(selectionText);
              try {
                jsxformat.setOptions({});
                jsxOutput = jsxformat.format(jsxOutput);
              } catch (_error) {}
              selection.insertText(jsxOutput);
              range = selection.getBufferRange();
              _results.push(editor.autoIndentBufferRows(range.start.row, range.end.row));
            } catch (_error) {}
          }
          return _results;
        };
      })(this));
    };

    AtomReact.prototype.onReformat = function() {
      var editor, jsxformat, selections, _;
      jsxformat = require('jsxformat');
      _ = require('lodash');
      editor = atom.workspace.getActiveTextEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var bufEnd, bufStart, err, firstChangedLine, lastChangedLine, newLineCount, original, originalLineCount, range, result, selection, serializedRange, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selections.length; _i < _len; _i++) {
            selection = selections[_i];
            try {
              range = selection.getBufferRange();
              serializedRange = range.serialize();
              bufStart = serializedRange[0];
              bufEnd = serializedRange[1];
              jsxformat.setOptions({});
              result = jsxformat.format(selection.getText());
              originalLineCount = editor.getLineCount();
              selection.insertText(result);
              newLineCount = editor.getLineCount();
              editor.autoIndentBufferRows(bufStart[0], bufEnd[0] + (newLineCount - originalLineCount));
              _results.push(editor.setCursorBufferPosition(bufStart));
            } catch (_error) {
              err = _error;
              range = selection.getBufferRange().serialize();
              range[0][0]++;
              range[1][0]++;
              jsxformat.setOptions({
                range: range
              });
              original = editor.getText();
              try {
                result = jsxformat.format(original);
                selection.clear();
                originalLineCount = editor.getLineCount();
                editor.setText(result);
                newLineCount = editor.getLineCount();
                firstChangedLine = range[0][0] - 1;
                lastChangedLine = range[1][0] - 1 + (newLineCount - originalLineCount);
                editor.autoIndentBufferRows(firstChangedLine, lastChangedLine);
                _results.push(editor.setCursorBufferPosition([firstChangedLine, range[0][1]]));
              } catch (_error) {}
            }
          }
          return _results;
        };
      })(this));
    };

    AtomReact.prototype.autoCloseTag = function(eventObj, editor) {
      var fullLine, lastLine, lastLineSpaces, line, lines, match, rest, row, serializedEndPoint, tagName, token, tokenizedLine, _ref1, _ref2, _ref3, _ref4;
      if (atom.config.get('react.disableAutoClose')) {
        return;
      }
      if (!this.isReactEnabledForEditor(editor) || editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      if ((eventObj != null ? eventObj.newText : void 0) === '>' && !eventObj.oldText) {
        if (editor.getCursorBufferPositions().length > 1) {
          return;
        }
        tokenizedLine = (_ref1 = editor.displayBuffer) != null ? (_ref2 = _ref1.tokenizedBuffer) != null ? _ref2.tokenizedLineForRow(eventObj.newRange.end.row) : void 0 : void 0;
        if (tokenizedLine == null) {
          return;
        }
        token = tokenizedLine.tokenAtBufferColumn(eventObj.newRange.end.column - 1);
        if ((token == null) || token.scopes.indexOf('tag.open.js') === -1 || token.scopes.indexOf('punctuation.definition.tag.end.js') === -1) {
          return;
        }
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        line = lines[row];
        line = line.substr(0, eventObj.newRange.end.column);
        if (line.substr(line.length - 2, 1) === '/') {
          return;
        }
        tagName = null;
        while ((line != null) && (tagName == null)) {
          match = line.match(autoCompleteTagStartRegex);
          if ((match != null) && match.length > 0) {
            tagName = match.pop().substr(1);
          }
          row--;
          line = lines[row];
        }
        if (tagName != null) {
          editor.insertText('</' + tagName + '>', {
            undo: 'skip'
          });
          return editor.setCursorBufferPosition(eventObj.newRange.end);
        }
      } else if ((eventObj != null ? eventObj.oldText : void 0) === '>' && (eventObj != null ? eventObj.newText : void 0) === '') {
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        fullLine = lines[row];
        tokenizedLine = (_ref3 = editor.displayBuffer) != null ? (_ref4 = _ref3.tokenizedBuffer) != null ? _ref4.tokenizedLineForRow(eventObj.newRange.end.row) : void 0 : void 0;
        if (tokenizedLine == null) {
          return;
        }
        token = tokenizedLine.tokenAtBufferColumn(eventObj.newRange.end.column - 1);
        if ((token == null) || token.scopes.indexOf('tag.open.js') === -1) {
          return;
        }
        line = fullLine.substr(0, eventObj.newRange.end.column);
        if (line.substr(line.length - 1, 1) === '/') {
          return;
        }
        tagName = null;
        while ((line != null) && (tagName == null)) {
          match = line.match(autoCompleteTagStartRegex);
          if ((match != null) && match.length > 0) {
            tagName = match.pop().substr(1);
          }
          row--;
          line = lines[row];
        }
        if (tagName != null) {
          rest = fullLine.substr(eventObj.newRange.end.column);
          if (rest.indexOf('</' + tagName + '>') === 0) {
            serializedEndPoint = [eventObj.newRange.end.row, eventObj.newRange.end.column];
            return editor.setTextInBufferRange([serializedEndPoint, [serializedEndPoint[0], serializedEndPoint[1] + tagName.length + 3]], '', {
              undo: 'skip'
            });
          }
        }
      } else if ((eventObj != null ? eventObj.newText : void 0) === '\n') {
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        lastLine = lines[row - 1];
        fullLine = lines[row];
        if (/>$/.test(lastLine) && fullLine.search(autoCompleteTagCloseRegex) === 0) {
          while (lastLine != null) {
            match = lastLine.match(autoCompleteTagStartRegex);
            if ((match != null) && match.length > 0) {
              break;
            }
            row--;
            lastLine = lines[row];
          }
          lastLineSpaces = lastLine.match(/^\s*/);
          lastLineSpaces = lastLineSpaces != null ? lastLineSpaces[0] : '';
          editor.insertText('\n' + lastLineSpaces);
          return editor.setCursorBufferPosition(eventObj.newRange.end);
        }
      }
    };

    AtomReact.prototype.processEditor = function(editor) {
      var disposableBufferEvent;
      this.patchEditorLangMode(editor);
      this.autoSetGrammar(editor);
      disposableBufferEvent = editor.buffer.onDidChange((function(_this) {
        return function(e) {
          return _this.autoCloseTag(e, editor);
        };
      })(this));
      this.disposables.add(editor.onDidDestroy((function(_this) {
        return function() {
          return disposableBufferEvent.dispose();
        };
      })(this)));
      return this.disposables.add(disposableBufferEvent);
    };

    AtomReact.prototype.deactivate = function() {
      return this.disposables.dispose();
    };

    AtomReact.prototype.activate = function() {
      var disposableConfigListener, disposableHTMLTOJSX, disposableProcessEditor, disposableReformat;
      this.disposables = new CompositeDisposable();
      jsxTagStartPattern = '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))';
      jsxComplexAttributePattern = '(?x)\\{ [^}"\']* $|\\( [^)"\']* $';
      decreaseIndentForNextLinePattern = '(?x) />\\s*(,|;)?\\s*$ | ^\\s*\\S+.*</[-_\\.A-Za-z0-9]+>$';
      atom.config.set("react.jsxTagStartPattern", jsxTagStartPattern);
      atom.config.set("react.jsxComplexAttributePattern", jsxComplexAttributePattern);
      atom.config.set("react.decreaseIndentForNextLinePattern", decreaseIndentForNextLinePattern);
      disposableConfigListener = atom.config.observe('react.detectReactFilePattern', function(newValue) {
        return contentCheckRegex = null;
      });
      disposableReformat = atom.commands.add('atom-workspace', 'react:reformat-JSX', (function(_this) {
        return function() {
          return _this.onReformat();
        };
      })(this));
      disposableHTMLTOJSX = atom.commands.add('atom-workspace', 'react:HTML-to-JSX', (function(_this) {
        return function() {
          return _this.onHTMLToJSX();
        };
      })(this));
      disposableProcessEditor = atom.workspace.observeTextEditors(this.processEditor.bind(this));
      this.disposables.add(disposableConfigListener);
      this.disposables.add(disposableReformat);
      this.disposables.add(disposableHTMLTOJSX);
      return this.disposables.add(disposableProcessEditor);
    };

    return AtomReact;

  })();

  module.exports = AtomReact;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL3JlYWN0L2xpYi9hdG9tLXJlYWN0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwT0FBQTs7QUFBQSxFQUFBLE9BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0Isa0JBQUEsVUFBdEIsQ0FBQTs7QUFBQSxFQUVBLGlCQUFBLEdBQW9CLElBRnBCLENBQUE7O0FBQUEsRUFHQSw2QkFBQSxHQUFnQyx3SUFIaEMsQ0FBQTs7QUFBQSxFQUlBLHlCQUFBLEdBQTRCLHlCQUo1QixDQUFBOztBQUFBLEVBS0EseUJBQUEsR0FBNEIsa0JBTDVCLENBQUE7O0FBQUEsRUFPQSxrQkFBQSxHQUFxQixnREFQckIsQ0FBQTs7QUFBQSxFQVFBLDBCQUFBLEdBQTZCLG1DQVI3QixDQUFBOztBQUFBLEVBU0EsZ0NBQUEsR0FBbUMsMkRBVG5DLENBQUE7O0FBQUEsRUFhTTtBQUNKLHdCQUFBLE1BQUEsR0FDRTtBQUFBLE1BQUEsNEJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsOEVBRmI7T0FERjtBQUFBLE1BSUEsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsNkJBRmI7T0FMRjtBQUFBLE1BUUEsc0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyw2QkFEVDtPQVRGO0FBQUEsTUFXQSxrQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLGtCQURUO09BWkY7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

//# sourceURL=/Users/Kamilius/.atom/packages/react/lib/atom-react.coffee
