(function() {
  var TstpackageView;

  TstpackageView = require('../lib/tstpackage-view');

  describe("TstpackageView", function() {
    return it("has one valid test", function() {
      return expect("life").toBe("easy");
    });
  });

}).call(this);
