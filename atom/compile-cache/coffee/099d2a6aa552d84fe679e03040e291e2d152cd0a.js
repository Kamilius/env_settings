(function() {
  describe('Bottom Container', function() {
    var BottomContainer, bottomContainer, trigger;
    BottomContainer = require('../../lib/ui/bottom-container');
    bottomContainer = null;
    trigger = require('../common').trigger;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          if (bottomContainer != null) {
            bottomContainer.dispose();
          }
          return bottomContainer = BottomContainer.create('File');
        });
      });
    });
    describe('::getTab', function() {
      return it('returns HTMLElements of tabs', function() {
        expect(bottomContainer.getTab('File') instanceof HTMLElement).toBe(true);
        expect(bottomContainer.getTab('Line') instanceof HTMLElement).toBe(true);
        expect(bottomContainer.getTab('Project') instanceof HTMLElement).toBe(true);
        return expect(bottomContainer.getTab('a') instanceof HTMLElement).toBe(false);
      });
    });
    describe('::setCount', function() {
      return it('updates count on underlying HTMLElements', function() {
        bottomContainer.setCount({
          Project: 1,
          File: 2,
          Line: 3
        });
        bottomContainer.iconScope = 'File';
        expect(bottomContainer.getTab('Project').count).toBe(1);
        expect(bottomContainer.getTab('File').count).toBe(2);
        return expect(bottomContainer.getTab('Line').count).toBe(3);
      });
    });
    describe('::{set, get}ActiveTab', function() {
      return it('works', function() {
        expect(bottomContainer.getTab('File').active).toBe(true);
        expect(bottomContainer.getTab('Line').active).toBe(false);
        expect(bottomContainer.getTab('Project').active).toBe(false);
        expect(bottomContainer.activeTab).toBe('File');
        bottomContainer.activeTab = 'Line';
        expect(bottomContainer.getTab('File').active).toBe(false);
        expect(bottomContainer.getTab('Line').active).toBe(true);
        expect(bottomContainer.getTab('Project').active).toBe(false);
        expect(bottomContainer.activeTab).toBe('Line');
        bottomContainer.activeTab = 'Project';
        expect(bottomContainer.getTab('File').active).toBe(false);
        expect(bottomContainer.getTab('Line').active).toBe(false);
        expect(bottomContainer.getTab('Project').active).toBe(true);
        expect(bottomContainer.activeTab).toBe('Project');
        bottomContainer.activeTab = 'File';
        expect(bottomContainer.activeTab).toBe('File');
        expect(bottomContainer.getTab('File').active).toBe(true);
        expect(bottomContainer.getTab('Line').active).toBe(false);
        return expect(bottomContainer.getTab('Project').active).toBe(false);
      });
    });
    describe('::{get, set}Visibility', function() {
      return it('manages element visibility', function() {
        bottomContainer.visibility = false;
        expect(bottomContainer.visibility).toBe(false);
        expect(bottomContainer.hasAttribute('hidden')).toBe(true);
        bottomContainer.visibility = true;
        expect(bottomContainer.visibility).toBe(true);
        return expect(bottomContainer.hasAttribute('hidden')).toBe(false);
      });
    });
    describe('::onDidChangeTab', function() {
      return it('is triggered when tab is changed', function() {
        var listener;
        listener = jasmine.createSpy('onDidChangeTab');
        bottomContainer.onDidChangeTab(listener);
        trigger(bottomContainer.getTab('File'), 'click');
        expect(listener).not.toHaveBeenCalled();
        trigger(bottomContainer.getTab('Project'), 'click');
        expect(listener).toHaveBeenCalledWith('Project');
        trigger(bottomContainer.getTab('File'), 'click');
        expect(listener).toHaveBeenCalledWith('File');
        trigger(bottomContainer.getTab('Line'), 'click');
        return expect(listener).toHaveBeenCalledWith('Line');
      });
    });
    return describe('::onShouldTogglePanel', function() {
      return it('is triggered when active tab is clicked', function() {
        var listener;
        listener = jasmine.createSpy('onShouldTogglePanel');
        bottomContainer.onShouldTogglePanel(listener);
        trigger(bottomContainer.getTab('Project'), 'click');
        expect(listener).not.toHaveBeenCalled();
        trigger(bottomContainer.getTab('Project'), 'click');
        return expect(listener).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3VpL2JvdHRvbS1jb250YWluZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixRQUFBLHlDQUFBO0FBQUEsSUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSwrQkFBUixDQUFsQixDQUFBO0FBQUEsSUFDQSxlQUFBLEdBQWtCLElBRGxCLENBQUE7QUFBQSxJQUdDLFVBQVcsT0FBQSxDQUFRLFdBQVIsRUFBWCxPQUhELENBQUE7QUFBQSxJQUtBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixRQUE5QixDQUF1QyxDQUFDLElBQXhDLENBQTZDLFNBQUEsR0FBQTs7WUFDM0MsZUFBZSxDQUFFLE9BQWpCLENBQUE7V0FBQTtpQkFDQSxlQUFBLEdBQWtCLGVBQWUsQ0FBQyxNQUFoQixDQUF1QixNQUF2QixFQUZ5QjtRQUFBLENBQTdDLEVBRGM7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUxBLENBQUE7QUFBQSxJQVdBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTthQUNuQixFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFFBQUEsTUFBQSxDQUFPLGVBQWUsQ0FBQyxNQUFoQixDQUF1QixNQUF2QixDQUFBLFlBQTBDLFdBQWpELENBQTZELENBQUMsSUFBOUQsQ0FBbUUsSUFBbkUsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sZUFBZSxDQUFDLE1BQWhCLENBQXVCLE1BQXZCLENBQUEsWUFBMEMsV0FBakQsQ0FBNkQsQ0FBQyxJ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

//# sourceURL=/Users/Kamilius/.atom/packages/linter/spec/ui/bottom-container-spec.coffee
