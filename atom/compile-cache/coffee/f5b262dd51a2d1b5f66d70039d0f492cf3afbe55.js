(function() {
  var Minimap, fs;

  require('./helpers/workspace');

  fs = require('fs-plus');

  Minimap = require('../lib/minimap');

  describe('Minimap', function() {
    var editor, editorElement, largeSample, minimap, minimapHorizontalScaleFactor, minimapVerticalScaleFactor, smallSample, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], minimap = _ref[2], largeSample = _ref[3], smallSample = _ref[4], minimapVerticalScaleFactor = _ref[5], minimapHorizontalScaleFactor = _ref[6];
    beforeEach(function() {
      var dir;
      atom.config.set('minimap.charHeight', 4);
      atom.config.set('minimap.charWidth', 2);
      atom.config.set('minimap.interline', 1);
      editor = atom.workspace.buildTextEditor({});
      editorElement = atom.views.getView(editor);
      jasmine.attachToDOM(editorElement);
      editorElement.setHeight(50);
      editorElement.setWidth(200);
      minimapVerticalScaleFactor = 5 / editor.getLineHeightInPixels();
      minimapHorizontalScaleFactor = 2 / editor.getDefaultCharWidth();
      dir = atom.project.getDirectories()[0];
      minimap = new Minimap({
        textEditor: editor
      });
      largeSample = fs.readFileSync(dir.resolve('large-file.coffee')).toString();
      return smallSample = fs.readFileSync(dir.resolve('sample.coffee')).toString();
    });
    it('has an associated editor', function() {
      return expect(minimap.getTextEditor()).toEqual(editor);
    });
    it('returns false when asked if destroyed', function() {
      return expect(minimap.isDestroyed()).toBeFalsy();
    });
    it('raise an exception if created without a text editor', function() {
      return expect(function() {
        return new Minimap;
      }).toThrow();
    });
    it('measures the minimap size based on the current editor content', function() {
      editor.setText(smallSample);
      expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
      editor.setText(largeSample);
      return expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
    });
    it('measures the scaling factor between the editor and the minimap', function() {
      expect(minimap.getVerticalScaleFactor()).toEqual(minimapVerticalScaleFactor);
      return expect(minimap.getHorizontalScaleFactor()).toEqual(minimapHorizontalScaleFactor);
    });
    it('measures the editor visible area size at minimap scale', function() {
      editor.setText(largeSample);
      return expect(minimap.getTextEditorScaledHeight()).toEqual(50 * minimapVerticalScaleFactor);
    });
    it('measures the available minimap scroll', function() {
      var largeLineCount;
      editor.setText(largeSample);
      largeLineCount = editor.getScreenLineCount();
      expect(minimap.getMaxScrollTop()).toEqual(largeLineCount * 5 - 50);
      return expect(minimap.canScroll()).toBeTruthy();
    });
    it('computes the first visible row in the minimap', function() {
      return expect(minimap.getFirstVisibleScreenRow()).toEqual(0);
    });
    it('computes the last visible row in the minimap', function() {
      return expect(minimap.getLastVisibleScreenRow()).toEqual(10);
    });
    it('relays change events from the text editor', function() {
      var changeSpy;
      changeSpy = jasmine.createSpy('didChange');
      minimap.onDidChange(changeSpy);
      editor.setText('foo');
      return expect(changeSpy).toHaveBeenCalled();
    });
    it('relays scroll top events from the editor', function() {
      var scrollSpy;
      editor.setText(largeSample);
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollTop(scrollSpy);
      editorElement.setScrollTop(100);
      return expect(scrollSpy).toHaveBeenCalled();
    });
    it('relays scroll left events from the editor', function() {
      var scrollSpy;
      editor.setText(largeSample);
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollLeft(scrollSpy);
      spyOn(editorElement, 'getScrollWidth').andReturn(10000);
      editorElement.setScrollLeft(100);
      return expect(scrollSpy).toHaveBeenCalled();
    });
    describe('when scrols past end is enabled', function() {
      beforeEach(function() {
        editor.setText(largeSample);
        return atom.config.set('editor.scrollPastEnd', true);
      });
      it('adjust the scrolling ratio', function() {
        var maxScrollTop;
        editorElement.setScrollTop(editorElement.getScrollHeight());
        maxScrollTop = editorElement.getScrollHeight() - editorElement.getHeight() - (editorElement.getHeight() - 3 * editor.displayBuffer.getLineHeightInPixels());
        return expect(minimap.getTextEditorScrollRatio()).toEqual(editorElement.getScrollTop() / maxScrollTop);
      });
      it('lock the minimap scroll top to 1', function() {
        editorElement.setScrollTop(editorElement.getScrollHeight());
        return expect(minimap.getScrollTop()).toEqual(minimap.getMaxScrollTop());
      });
      return describe('getTextEditorScrollRatio(), when getScrollTop() and maxScrollTop both equal 0', function() {
        beforeEach(function() {
          editor.setText(smallSample);
          editorElement.setHeight(40);
          return atom.config.set('editor.scrollPastEnd', true);
        });
        return it('returns 0', function() {
          editorElement.setScrollTop(0);
          return expect(minimap.getTextEditorScrollRatio()).toEqual(0);
        });
      });
    });
    describe('when soft wrap is enabled', function() {
      beforeEach(function() {
        atom.config.set('editor.softWrap', true);
        atom.config.set('editor.softWrapAtPreferredLineLength', true);
        return atom.config.set('editor.preferredLineLength', 2);
      });
      return it('measures the minimap using screen lines', function() {
        editor.setText(smallSample);
        expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
        editor.setText(largeSample);
        return expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
      });
    });
    describe('when there is no scrolling needed to display the whole minimap', function() {
      it('returns 0 when computing the minimap scroll', function() {
        return expect(minimap.getScrollTop()).toEqual(0);
      });
      return it('returns 0 when measuring the available minimap scroll', function() {
        editor.setText(smallSample);
        expect(minimap.getMaxScrollTop()).toEqual(0);
        return expect(minimap.canScroll()).toBeFalsy();
      });
    });
    describe('when the editor is scrolled', function() {
      var editorHeight, editorScrollRatio, largeLineCount, _ref1;
      _ref1 = [], largeLineCount = _ref1[0], editorHeight = _ref1[1], editorScrollRatio = _ref1[2];
      beforeEach(function() {
        spyOn(editorElement, 'getScrollWidth').andReturn(10000);
        editor.setText(largeSample);
        editorElement.setScrollTop(1000);
        editorElement.setScrollLeft(200);
        largeLineCount = editor.getScreenLineCount();
        editorHeight = largeLineCount * editor.getLineHeightInPixels();
        return editorScrollRatio = editorElement.getScrollTop() / (editorElement.getScrollHeight() - editorElement.getHeight());
      });
      it('scales the editor scroll based on the minimap scale factor', function() {
        expect(minimap.getTextEditorScaledScrollTop()).toEqual(1000 * minimapVerticalScaleFactor);
        return expect(minimap.getTextEditorScaledScrollLeft()).toEqual(200 * minimapHorizontalScaleFactor);
      });
      it('computes the offset to apply based on the editor scroll top', function() {
        return expect(minimap.getScrollTop()).toEqual(editorScrollRatio * minimap.getMaxScrollTop());
      });
      it('computes the first visible row in the minimap', function() {
        return expect(minimap.getFirstVisibleScreenRow()).toEqual(58);
      });
      it('computes the last visible row in the minimap', function() {
        return expect(minimap.getLastVisibleScreenRow()).toEqual(69);
      });
      return describe('down to the bottom', function() {
        beforeEach(function() {
          editorElement.setScrollTop(editorElement.getScrollHeight());
          return editorScrollRatio = editorElement.getScrollTop() / editorElement.getScrollHeight();
        });
        it('computes an offset that scrolls the minimap to the bottom edge', function() {
          return expect(minimap.getScrollTop()).toEqual(minimap.getMaxScrollTop());
        });
        it('computes the first visible row in the minimap', function() {
          return expect(minimap.getFirstVisibleScreenRow()).toEqual(largeLineCount - 10);
        });
        return it('computes the last visible row in the minimap', function() {
          return expect(minimap.getLastVisibleScreenRow()).toEqual(largeLineCount);
        });
      });
    });
    describe('destroying the model', function() {
      it('emits a did-destroy event', function() {
        var spy;
        spy = jasmine.createSpy('destroy');
        minimap.onDidDestroy(spy);
        minimap.destroy();
        return expect(spy).toHaveBeenCalled();
      });
      return it('returns true when asked if destroyed', function() {
        minimap.destroy();
        return expect(minimap.isDestroyed()).toBeTruthy();
      });
    });
    describe('destroying the text editor', function() {
      return it('destroys the model', function() {
        spyOn(minimap, 'destroy');
        editor.destroy();
        return expect(minimap.destroy).toHaveBeenCalled();
      });
    });
    describe('::decorateMarker', function() {
      var changeSpy, decoration, marker, _ref1;
      _ref1 = [], marker = _ref1[0], decoration = _ref1[1], changeSpy = _ref1[2];
      beforeEach(function() {
        editor.setText(largeSample);
        changeSpy = jasmine.createSpy('didChange');
        minimap.onDidChange(changeSpy);
        marker = minimap.markBufferRange([[0, 6], [1, 11]]);
        return decoration = minimap.decorateMarker(marker, {
          type: 'highlight',
          "class": 'dummy'
        });
      });
      it('creates a decoration for the given marker', function() {
        return expect(minimap.decorationsByMarkerId[marker.id]).toBeDefined();
      });
      it('creates a change corresponding to the marker range', function() {
        expect(changeSpy).toHaveBeenCalled();
        expect(changeSpy.calls[0].args[0].start).toEqual(0);
        return expect(changeSpy.calls[0].args[0].end).toEqual(1);
      });
      describe('when the marker range changes', function() {
        beforeEach(function() {
          var markerChangeSpy;
          markerChangeSpy = jasmine.createSpy('marker-did-change');
          marker.onDidChange(markerChangeSpy);
          marker.setBufferRange([[0, 6], [3, 11]]);
          return waitsFor(function() {
            return markerChangeSpy.calls.length > 0;
          });
        });
        return it('creates a change only for the dif between the two ranges', function() {
          expect(changeSpy).toHaveBeenCalled();
          expect(changeSpy.calls[1].args[0].start).toEqual(1);
          return expect(changeSpy.calls[1].args[0].end).toEqual(3);
        });
      });
      describe('destroying the marker', function() {
        beforeEach(function() {
          return marker.destroy();
        });
        it('removes the decoration from the render view', function() {
          return expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
        });
        return it('creates a change corresponding to the marker range', function() {
          expect(changeSpy.calls[1].args[0].start).toEqual(0);
          return expect(changeSpy.calls[1].args[0].end).toEqual(1);
        });
      });
      describe('destroying the decoration', function() {
        beforeEach(function() {
          return decoration.destroy();
        });
        it('removes the decoration from the render view', function() {
          return expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
        });
        return it('creates a change corresponding to the marker range', function() {
          expect(changeSpy.calls[1].args[0].start).toEqual(0);
          return expect(changeSpy.calls[1].args[0].end).toEqual(1);
        });
      });
      describe('destroying all the decorations for the marker', function() {
        beforeEach(function() {
          return minimap.removeAllDecorationsForMarker(marker);
        });
        it('removes the decoration from the render view', function() {
          return expect(minimap.decorationsByMarkerId[marker.id]).toBeUndefined();
        });
        return it('creates a change corresponding to the marker range', function() {
          expect(changeSpy.calls[1].args[0].start).toEqual(0);
          return expect(changeSpy.calls[1].args[0].end).toEqual(1);
        });
      });
      return describe('destroying the minimap', function() {
        beforeEach(function() {
          return minimap.destroy();
        });
        it('removes all the previously added decorations', function() {
          expect(minimap.decorationsById).toEqual({});
          return expect(minimap.decorationsByMarkerId).toEqual({});
        });
        return it('prevents the creation of new decorations', function() {
          marker = editor.markBufferRange([[0, 6], [0, 11]]);
          decoration = minimap.decorateMarker(marker, {
            type: 'highlight',
            "class": 'dummy'
          });
          return expect(decoration).toBeUndefined();
        });
      });
    });
    return describe('::decorationsByTypeThenRows', function() {
      var decorations;
      decorations = [][0];
      beforeEach(function() {
        var createDecoration;
        editor.setText(largeSample);
        createDecoration = function(type, range) {
          var decoration, marker;
          marker = minimap.markBufferRange(range);
          return decoration = minimap.decorateMarker(marker, {
            type: type
          });
        };
        createDecoration('highlight', [[6, 0], [11, 0]]);
        createDecoration('highlight', [[7, 0], [8, 0]]);
        createDecoration('highlight-over', [[1, 0], [2, 0]]);
        createDecoration('line', [[3, 0], [4, 0]]);
        createDecoration('line', [[12, 0], [12, 0]]);
        createDecoration('highlight-under', [[0, 0], [10, 1]]);
        return decorations = minimap.decorationsByTypeThenRows(0, 12);
      });
      it('returns an object whose keys are the decorations types', function() {
        return expect(Object.keys(decorations).sort()).toEqual(['highlight-over', 'highlight-under', 'line']);
      });
      it('stores decorations by rows within each type objects', function() {
        expect(Object.keys(decorations['highlight-over']).sort()).toEqual('1 2 6 7 8 9 10 11'.split(' ').sort());
        expect(Object.keys(decorations['line']).sort()).toEqual('3 4 12'.split(' ').sort());
        return expect(Object.keys(decorations['highlight-under']).sort()).toEqual('0 1 2 3 4 5 6 7 8 9 10'.split(' ').sort());
      });
      return it('stores the decorations spanning a row in the corresponding row array', function() {
        expect(decorations['highlight-over']['7'].length).toEqual(2);
        expect(decorations['line']['3'].length).toEqual(1);
        return expect(decorations['highlight-under']['5'].length).toEqual(1);
      });
    });
  });

  describe('Stand alone minimap', function() {
    var editor, editorElement, largeSample, minimap, smallSample, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], minimap = _ref[2], largeSample = _ref[3], smallSample = _ref[4];
    beforeEach(function() {
      var dir;
      atom.config.set('minimap.charHeight', 4);
      atom.config.set('minimap.charWidth', 2);
      atom.config.set('minimap.interline', 1);
      editor = atom.workspace.buildTextEditor({});
      editorElement = atom.views.getView(editor);
      jasmine.attachToDOM(editorElement);
      editorElement.setHeight(50);
      editorElement.setWidth(200);
      editor.setLineHeightInPixels(10);
      dir = atom.project.getDirectories()[0];
      minimap = new Minimap({
        textEditor: editor,
        standAlone: true
      });
      largeSample = fs.readFileSync(dir.resolve('large-file.coffee')).toString();
      return smallSample = fs.readFileSync(dir.resolve('sample.coffee')).toString();
    });
    it('has an associated editor', function() {
      return expect(minimap.getTextEditor()).toEqual(editor);
    });
    it('measures the minimap size based on the current editor content', function() {
      editor.setText(smallSample);
      expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
      editor.setText(largeSample);
      return expect(minimap.getHeight()).toEqual(editor.getScreenLineCount() * 5);
    });
    it('measures the scaling factor between the editor and the minimap', function() {
      expect(minimap.getVerticalScaleFactor()).toEqual(0.5);
      return expect(minimap.getHorizontalScaleFactor()).toEqual(2 / editor.getDefaultCharWidth());
    });
    it('measures the editor visible area size at minimap scale', function() {
      editor.setText(largeSample);
      return expect(minimap.getTextEditorScaledHeight()).toEqual(25);
    });
    it('has a visible height based on the passed-in options', function() {
      expect(minimap.getVisibleHeight()).toEqual(5);
      editor.setText(smallSample);
      expect(minimap.getVisibleHeight()).toEqual(20);
      editor.setText(largeSample);
      expect(minimap.getVisibleHeight()).toEqual(editor.getScreenLineCount() * 5);
      minimap.height = 100;
      return expect(minimap.getVisibleHeight()).toEqual(100);
    });
    it('has a visible width based on the passed-in options', function() {
      expect(minimap.getVisibleWidth()).toEqual(0);
      editor.setText(smallSample);
      expect(minimap.getVisibleWidth()).toEqual(36);
      editor.setText(largeSample);
      expect(minimap.getVisibleWidth()).toEqual(editor.getMaxScreenLineLength() * 2);
      minimap.width = 50;
      return expect(minimap.getVisibleWidth()).toEqual(50);
    });
    it('measures the available minimap scroll', function() {
      var largeLineCount;
      editor.setText(largeSample);
      largeLineCount = editor.getScreenLineCount();
      expect(minimap.getMaxScrollTop()).toEqual(0);
      expect(minimap.canScroll()).toBeFalsy();
      minimap.height = 100;
      expect(minimap.getMaxScrollTop()).toEqual(largeLineCount * 5 - 100);
      return expect(minimap.canScroll()).toBeTruthy();
    });
    it('computes the first visible row in the minimap', function() {
      return expect(minimap.getFirstVisibleScreenRow()).toEqual(0);
    });
    it('computes the last visible row in the minimap', function() {
      editor.setText(largeSample);
      expect(minimap.getLastVisibleScreenRow()).toEqual(editor.getScreenLineCount());
      minimap.height = 100;
      return expect(minimap.getLastVisibleScreenRow()).toEqual(20);
    });
    it('does not relay scroll top events from the editor', function() {
      var scrollSpy;
      editor.setText(largeSample);
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollTop(scrollSpy);
      editorElement.setScrollTop(100);
      return expect(scrollSpy).not.toHaveBeenCalled();
    });
    it('does not relay scroll left events from the editor', function() {
      var scrollSpy;
      editor.setText(largeSample);
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollLeft(scrollSpy);
      spyOn(editorElement, 'getScrollWidth').andReturn(10000);
      editorElement.setScrollLeft(100);
      return expect(scrollSpy).not.toHaveBeenCalled();
    });
    it('has a scroll top that is not bound to the text editor', function() {
      var scrollSpy;
      scrollSpy = jasmine.createSpy('didScroll');
      minimap.onDidChangeScrollTop(scrollSpy);
      editor.setText(largeSample);
      editorElement.setScrollTop(1000);
      expect(minimap.getScrollTop()).toEqual(0);
      expect(scrollSpy).not.toHaveBeenCalled();
      minimap.setScrollTop(10);
      expect(minimap.getScrollTop()).toEqual(10);
      return expect(scrollSpy).toHaveBeenCalled();
    });
    it('has rendering properties that can overrides the config values', function() {
      minimap.setCharWidth(8.5);
      minimap.setCharHeight(10.2);
      minimap.setInterline(10.6);
      expect(minimap.getCharWidth()).toEqual(8);
      expect(minimap.getCharHeight()).toEqual(10);
      expect(minimap.getInterline()).toEqual(10);
      return expect(minimap.getLineHeight()).toEqual(20);
    });
    return it('emits a config change event when a value is changed', function() {
      var changeSpy;
      changeSpy = jasmine.createSpy('did-change');
      minimap.onDidChangeConfig(changeSpy);
      minimap.setCharWidth(8.5);
      minimap.setCharHeight(10.2);
      minimap.setInterline(10.6);
      return expect(changeSpy.callCount).toEqual(3);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9taW5pbWFwLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBQSxPQUFBLENBQVEscUJBQVIsQ0FBQSxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEsZ0JBQVIsQ0FIVixDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEsd0hBQUE7QUFBQSxJQUFBLE9BQXVILEVBQXZILEVBQUMsZ0JBQUQsRUFBUyx1QkFBVCxFQUF3QixpQkFBeEIsRUFBaUMscUJBQWpDLEVBQThDLHFCQUE5QyxFQUEyRCxvQ0FBM0QsRUFBdUYsc0NBQXZGLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLEdBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsRUFBc0MsQ0FBdEMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLEVBQXFDLENBQXJDLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFoQixFQUFxQyxDQUFyQyxDQUZBLENBQUE7QUFBQSxNQUlBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBK0IsRUFBL0IsQ0FKVCxDQUFBO0FBQUEsTUFNQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQU5oQixDQUFBO0FBQUEsTUFPQSxPQUFP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

//# sourceURL=/Users/Kamilius/.atom/packages/minimap/spec/minimap-spec.coffee
