(function() {
  var DOMStylesReader, Mixin, rotate,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  module.exports = DOMStylesReader = (function(_super) {
    __extends(DOMStylesReader, _super);

    function DOMStylesReader() {
      return DOMStylesReader.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    DOMStylesReader.prototype.retrieveStyleFromDom = function(scopes, property, shadowRoot, cache) {
      var filter, key, node, parent, scope, style, value, _base, _i, _len, _ref;
      if (shadowRoot == null) {
        shadowRoot = true;
      }
      if (cache == null) {
        cache = true;
      }
      this.ensureCache();
      key = scopes.join(' ');
      if (cache && (((_ref = this.constructor.domStylesCache[key]) != null ? _ref[property] : void 0) != null)) {
        return this.constructor.domStylesCache[key][property];
      }
      this.ensureDummyNodeExistence(shadowRoot);
      if ((_base = this.constructor.domStylesCache)[key] == null) {
        _base[key] = {};
      }
      parent = this.dummyNode;
      for (_i = 0, _len = scopes.length; _i < _len; _i++) {
        scope = scopes[_i];
        node = document.createElement('span');
        node.className = scope.replace(/\.+/g, ' ');
        if (parent != null) {
          parent.appendChild(node);
        }
        parent = node;
      }
      style = getComputedStyle(parent);
      filter = style.getPropertyValue('-webkit-filter');
      value = style.getPropertyValue(property);
      if (filter.indexOf('hue-rotate') !== -1) {
        value = this.rotateHue(value, filter);
      }
      this.dummyNode.innerHTML = '';
      if (value !== "") {
        this.constructor.domStylesCache[key][property] = value;
      }
      return value;
    };


    /* Internal */

    DOMStylesReader.prototype.ensureDummyNodeExistence = function(shadowRoot) {
      if (this.dummyNode == null) {
        this.dummyNode = document.createElement('span');
        this.dummyNode.style.visibility = 'hidden';
      }
      return this.getDummyDOMRoot(shadowRoot).appendChild(this.dummyNode);
    };

    DOMStylesReader.prototype.ensureCache = function() {
      var _base;
      return (_base = this.constructor).domStylesCache != null ? _base.domStylesCache : _base.domStylesCache = {};
    };

    DOMStylesReader.prototype.invalidateCache = function() {
      return this.constructor.domStylesCache = {};
    };

    DOMStylesReader.prototype.invalidateIfFirstTokenization = function() {
      if (this.constructor.hasTokenizedOnce) {
        return;
      }
      this.invalidateCache();
      return this.constructor.hasTokenizedOnce = true;
    };

    DOMStylesReader.prototype.rotateHue = function(value, filter) {
      var a, b, g, hue, r, _, _ref, _ref1, _ref2, _ref3;
      _ref = value.match(/rgb(a?)\((\d+), (\d+), (\d+)(, (\d+(\.\d+)?))?\)/), _ = _ref[0], _ = _ref[1], r = _ref[2], g = _ref[3], b = _ref[4], _ = _ref[5], a = _ref[6];
      _ref1 = filter.match(/hue-rotate\((\d+)deg\)/), _ = _ref1[0], hue = _ref1[1];
      _ref2 = [r, g, b, a, hue].map(Number), r = _ref2[0], g = _ref2[1], b = _ref2[2], a = _ref2[3], hue = _ref2[4];
      _ref3 = rotate(r, g, b, hue), r = _ref3[0], g = _ref3[1], b = _ref3[2];
      if (isNaN(a)) {
        return "rgb(" + r + ", " + g + ", " + b + ")";
      } else {
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
      }
    };

    return DOMStylesReader;

  })(Mixin);

  rotate = function(r, g, b, angle) {
    var B, G, R, clamp, cos, hueRotateB, hueRotateG, hueRotateR, lumB, lumG, lumR, matrix, sin;
    clamp = function(num) {
      return Math.ceil(Math.max(0, Math.min(255, num)));
    };
    matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    lumR = 0.2126;
    lumG = 0.7152;
    lumB = 0.0722;
    hueRotateR = 0.143;
    hueRotateG = 0.140;
    hueRotateB = 0.283;
    cos = Math.cos(angle * Math.PI / 180);
    sin = Math.sin(angle * Math.PI / 180);
    matrix[0] = lumR + (1 - lumR) * cos - (lumR * sin);
    matrix[1] = lumG - (lumG * cos) - (lumG * sin);
    matrix[2] = lumB - (lumB * cos) + (1 - lumB) * sin;
    matrix[3] = lumR - (lumR * cos) + hueRotateR * sin;
    matrix[4] = lumG + (1 - lumG) * cos + hueRotateG * sin;
    matrix[5] = lumB - (lumB * cos) - (hueRotateB * sin);
    matrix[6] = lumR - (lumR * cos) - ((1 - lumR) * sin);
    matrix[7] = lumG - (lumG * cos) + lumG * sin;
    matrix[8] = lumB + (1 - lumB) * cos + lumB * sin;
    R = clamp(matrix[0] * r + matrix[1] * g + matrix[2] * b);
    G = clamp(matrix[3] * r + matrix[4] * g + matrix[5] * b);
    B = clamp(matrix[6] * r + matrix[7] * g + matrix[8] * b);
    return [R, G, B];
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21peGlucy9kb20tc3R5bGVzLXJlYWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUFSLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osc0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBO0FBQUEsZ0JBQUE7O0FBQUEsOEJBYUEsb0JBQUEsR0FBc0IsU0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixVQUFuQixFQUFvQyxLQUFwQyxHQUFBO0FBQ3BCLFVBQUEscUVBQUE7O1FBRHVDLGFBQVc7T0FDbEQ7O1FBRHdELFFBQU07T0FDOUQ7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxHQUFBLEdBQU0sTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLENBRk4sQ0FBQTtBQUlBLE1BQUEsSUFBRyxLQUFBLElBQVUsMkZBQWI7QUFDRSxlQUFPLElBQUMsQ0FBQSxXQUFXLENBQUMsY0FBZSxDQUFBLEdBQUEsQ0FBSyxDQUFBLFFBQUEsQ0FBeEMsQ0FERjtPQUpBO0FBQUEsTUFPQSxJQUFDLENBQUEsd0JBQUQsQ0FBMEIsVUFBMUIsQ0FQQSxDQUFBOzthQVE0QixDQUFBLEdBQUEsSUFBUTtPQVJwQztBQUFBLE1BVUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxTQVZWLENBQUE7QUFXQSxXQUFBLDZDQUFBOzJCQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBUCxDQUFBO0FBQUEsUUFHQSxJQUFJLENBQUMsU0FBTCxHQUFpQixLQUFLLENBQUMsT0FB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

//# sourceURL=/Users/Kamilius/.atom/packages/minimap/lib/mixins/dom-styles-reader.coffee
