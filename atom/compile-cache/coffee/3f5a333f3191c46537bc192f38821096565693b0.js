(function() {
  var BlendModes, Color, ColorExpression, ExpressionsRegistry, MAX_PER_COMPONENT, SVGColors, blendMethod, clamp, clampInt, comma, contrast, createVariableRegExpString, cssColor, float, floatOrPercent, hexadecimal, int, intOrPercent, isInvalid, mixColors, namePrefixes, notQuote, optionalPercent, pe, percent, ps, readParam, split, strip, variables, _ref, _ref1,
    __slice = [].slice;

  cssColor = require('css-color-function');

  _ref = require('./regexes'), int = _ref.int, float = _ref.float, percent = _ref.percent, optionalPercent = _ref.optionalPercent, intOrPercent = _ref.intOrPercent, floatOrPercent = _ref.floatOrPercent, comma = _ref.comma, notQuote = _ref.notQuote, hexadecimal = _ref.hexadecimal, ps = _ref.ps, pe = _ref.pe, variables = _ref.variables, namePrefixes = _ref.namePrefixes, createVariableRegExpString = _ref.createVariableRegExpString;

  _ref1 = require('./utils'), strip = _ref1.strip, split = _ref1.split, clamp = _ref1.clamp, clampInt = _ref1.clampInt;

  ExpressionsRegistry = require('./expressions-registry');

  ColorExpression = require('./color-expression');

  SVGColors = require('./svg-colors');

  Color = require('./color');

  BlendModes = require('./blend-modes');

  MAX_PER_COMPONENT = {
    red: 255,
    green: 255,
    blue: 255,
    alpha: 1,
    hue: 360,
    saturation: 100,
    lightness: 100
  };

  mixColors = function(color1, color2, amount) {
    var color, inverse;
    if (amount == null) {
      amount = 0.5;
    }
    inverse = 1 - amount;
    color = new Color;
    color.rgba = [Math.floor(color1.red * amount) + Math.floor(color2.red * inverse), Math.floor(color1.green * amount) + Math.floor(color2.green * inverse), Math.floor(color1.blue * amount) + Math.floor(color2.blue * inverse), color1.alpha * amount + color2.alpha * inverse];
    return color;
  };

  contrast = function(base, dark, light, threshold) {
    var _ref2;
    if (dark == null) {
      dark = new Color('black');
    }
    if (light == null) {
      light = new Color('white');
    }
    if (threshold == null) {
      threshold = 0.43;
    }
    if (dark.luma > light.luma) {
      _ref2 = [dark, light], light = _ref2[0], dark = _ref2[1];
    }
    if (base.luma > threshold) {
      return dark;
    } else {
      return light;
    }
  };

  blendMethod = function(registry, name, method) {
    return registry.createExpression(name, strip("" + name + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), function(match, expression, context) {
      var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
      _ = match[0], expr = match[1];
      _ref2 = split(expr), color1 = _ref2[0], color2 = _ref2[1];
      baseColor1 = context.readColor(color1);
      baseColor2 = context.readColor(color2);
      if (isInvalid(baseColor1) || isInvalid(baseColor2)) {
        return this.invalid = true;
      }
      return _ref3 = baseColor1.blend(baseColor2, method), this.rgba = _ref3.rgba, _ref3;
    });
  };

  readParam = function(param, block) {
    var name, re, value, _, _ref2;
    re = RegExp("\\$(\\w+):\\s*((-?" + float + ")|" + variables + ")");
    if (re.test(param)) {
      _ref2 = re.exec(param), _ = _ref2[0], name = _ref2[1], value = _ref2[2];
      return block(name, value);
    }
  };

  isInvalid = function(color) {
    return !(color != null ? color.isValid() : void 0);
  };

  module.exports = {
    getRegistry: function(context) {
      var colorRegexp, colors, elmAngle, elmDegreesRegexp, paletteRegexpString, registry;
      registry = new ExpressionsRegistry(ColorExpression);
      registry.createExpression('css_hexa_8', "#(" + hexadecimal + "{8})(?![\\d\\w])", function(match, expression, context) {
        var hexa, _;
        _ = match[0], hexa = match[1];
        return this.hexRGBA = hexa;
      });
      registry.createExpression('css_hexa_6', "#(" + hexadecimal + "{6})(?![\\d\\w])", function(match, expression, context) {
        var hexa, _;
        _ = match[0], hexa = match[1];
        return this.hex = hexa;
      });
      registry.createExpression('css_hexa_4', "(?:" + namePrefixes + ")#(" + hexadecimal + "{4})(?![\\d\\w])", function(match, expression, context) {
        var colorAsInt, hexa, _;
        _ = match[0], hexa = match[1];
        colorAsInt = context.readInt(hexa, 16);
        this.colorExpression = "#" + hexa;
        this.red = (colorAsInt >> 12 & 0xf) * 17;
        this.green = (colorAsInt >> 8 & 0xf) * 17;
        this.blue = (colorAsInt >> 4 & 0xf) * 17;
        return this.alpha = ((colorAsInt & 0xf) * 17) / 255;
      });
      registry.createExpression('css_hexa_3', "(?:" + namePrefixes + ")#(" + hexadecimal + "{3})(?![\\d\\w])", function(match, expression, context) {
        var colorAsInt, hexa, _;
        _ = match[0], hexa = match[1];
        colorAsInt = context.readInt(hexa, 16);
        this.colorExpression = "#" + hexa;
        this.red = (colorAsInt >> 8 & 0xf) * 17;
        this.green = (colorAsInt >> 4 & 0xf) * 17;
        return this.blue = (colorAsInt & 0xf) * 17;
      });
      registry.createExpression('int_hexa_8', "0x(" + hexadecimal + "{8})(?!" + hexadecimal + ")", function(match, expression, context) {
        var hexa, _;
        _ = match[0], hexa = match[1];
        return this.hexARGB = hexa;
      });
      registry.createExpression('int_hexa_6', "0x(" + hexadecimal + "{6})(?!" + hexadecimal + ")", function(match, expression, context) {
        var hexa, _;
        _ = match[0], hexa = match[1];
        return this.hex = hexa;
      });
      registry.createExpression('css_rgb', strip("rgb" + ps + "\\s* (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var b, g, r, _;
        _ = match[0], r = match[1], g = match[2], b = match[3];
        this.red = context.readIntOrPercent(r);
        this.green = context.readIntOrPercent(g);
        this.blue = context.readIntOrPercent(b);
        return this.alpha = 1;
      });
      registry.createExpression('css_rgba', strip("rgba" + ps + "\\s* (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), function(match, expression, context) {
        var a, b, g, r, _;
        _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
        this.red = context.readIntOrPercent(r);
        this.green = context.readIntOrPercent(g);
        this.blue = context.readIntOrPercent(b);
        return this.alpha = context.readFloat(a);
      });
      registry.createExpression('stylus_rgba', strip("rgba" + ps + "\\s* (" + notQuote + ") " + comma + " (" + float + "|" + variables + ") " + pe), function(match, expression, context) {
        var a, baseColor, subexpr, _;
        _ = match[0], subexpr = match[1], a = match[2];
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        this.rgb = baseColor.rgb;
        return this.alpha = context.readFloat(a);
      });
      registry.createExpression('css_hsl', strip("hsl" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var h, hsl, l, s, _;
        _ = match[0], h = match[1], s = match[2], l = match[3];
        hsl = [context.readInt(h), context.readFloat(s), context.readFloat(l)];
        if (hsl.some(function(v) {
          return (v == null) || isNaN(v);
        })) {
          return this.invalid = true;
        }
        this.hsl = hsl;
        return this.alpha = 1;
      });
      registry.createExpression('css_hsla', strip("hsla" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), function(match, expression, context) {
        var a, h, hsl, l, s, _;
        _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
        hsl = [context.readInt(h), context.readFloat(s), context.readFloat(l)];
        if (hsl.some(function(v) {
          return (v == null) || isNaN(v);
        })) {
          return this.invalid = true;
        }
        this.hsl = hsl;
        return this.alpha = context.readFloat(a);
      });
      registry.createExpression('hsv', strip("(?:hsv|hsb)" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var h, hsv, s, v, _;
        _ = match[0], h = match[1], s = match[2], v = match[3];
        hsv = [context.readInt(h), context.readFloat(s), context.readFloat(v)];
        if (hsv.some(function(v) {
          return (v == null) || isNaN(v);
        })) {
          return this.invalid = true;
        }
        this.hsv = hsv;
        return this.alpha = 1;
      });
      registry.createExpression('hsva', strip("(?:hsva|hsba)" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), function(match, expression, context) {
        var a, h, hsv, s, v, _;
        _ = match[0], h = match[1], s = match[2], v = match[3], a = match[4];
        hsv = [context.readInt(h), context.readFloat(s), context.readFloat(v)];
        if (hsv.some(function(v) {
          return (v == null) || isNaN(v);
        })) {
          return this.invalid = true;
        }
        this.hsv = hsv;
        return this.alpha = context.readFloat(a);
      });
      registry.createExpression('vec4', strip("vec4" + ps + "\\s* (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + pe), function(match, expression, context) {
        var a, h, l, s, _;
        _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
        return this.rgba = [context.readFloat(h) * 255, context.readFloat(s) * 255, context.readFloat(l) * 255, context.readFloat(a)];
      });
      registry.createExpression('hwb', strip("hwb" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") (?:" + comma + "(" + float + "|" + variables + "))? " + pe), function(match, expression, context) {
        var a, b, h, w, _;
        _ = match[0], h = match[1], w = match[2], b = match[3], a = match[4];
        this.hwb = [context.readInt(h), context.readFloat(w), context.readFloat(b)];
        return this.alpha = a != null ? context.readFloat(a) : 1;
      });
      registry.createExpression('gray', strip("gray" + ps + "\\s* (" + optionalPercent + "|" + variables + ") (?:" + comma + "(" + float + "|" + variables + "))? " + pe), 1, function(match, expression, context) {
        var a, p, _;
        _ = match[0], p = match[1], a = match[2];
        p = context.readFloat(p) / 100 * 255;
        this.rgb = [p, p, p];
        return this.alpha = a != null ? context.readFloat(a) : 1;
      });
      colors = Object.keys(SVGColors.allCases);
      colorRegexp = "(?:" + namePrefixes + ")(" + (colors.join('|')) + ")(?!\\s*[-\\.:=\\(])\\b";
      registry.createExpression('named_colors', colorRegexp, function(match, expression, context) {
        var name, _;
        _ = match[0], name = match[1];
        this.colorExpression = this.name = name;
        return this.hex = SVGColors.allCases[name].replace('#', '');
      });
      registry.createExpression('darken', strip("darken" + ps + " (" + notQuote + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloat(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [h, s, clampInt(l - amount)];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('lighten', strip("lighten" + ps + " (" + notQuote + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloat(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [h, s, clampInt(l + amount)];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('fade', strip("(?:fade|alpha)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, subexpr, _;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        this.rgb = baseColor.rgb;
        return this.alpha = amount;
      });
      registry.createExpression('transparentize', strip("(?:transparentize|fadeout|fade-out|fade_out)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, subexpr, _;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        this.rgb = baseColor.rgb;
        return this.alpha = clamp(baseColor.alpha - amount);
      });
      registry.createExpression('opacify', strip("(?:opacify|fadein|fade-in|fade_in)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, subexpr, _;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        this.rgb = baseColor.rgb;
        return this.alpha = clamp(baseColor.alpha + amount);
      });
      registry.createExpression('stylus_component_functions', strip("(red|green|blue)" + ps + " (" + notQuote + ") " + comma + " (" + int + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, channel, subexpr, _;
        _ = match[0], channel = match[1], subexpr = match[2], amount = match[3];
        amount = context.readInt(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        if (isNaN(amount)) {
          return this.invalid = true;
        }
        return this[channel] = amount;
      });
      registry.createExpression('transparentify', strip("transparentify" + ps + " (" + notQuote + ") " + pe), function(match, expression, context) {
        var alpha, bestAlpha, bottom, expr, processChannel, top, _, _ref2;
        _ = match[0], expr = match[1];
        _ref2 = split(expr), top = _ref2[0], bottom = _ref2[1], alpha = _ref2[2];
        top = context.readColor(top);
        bottom = context.readColor(bottom);
        alpha = context.readFloatOrPercent(alpha);
        if (isInvalid(top)) {
          return this.invalid = true;
        }
        if ((bottom != null) && isInvalid(bottom)) {
          return this.invalid = true;
        }
        if (bottom == null) {
          bottom = new Color(255, 255, 255, 1);
        }
        if (isNaN(alpha)) {
          alpha = void 0;
        }
        bestAlpha = ['red', 'green', 'blue'].map(function(channel) {
          var res;
          res = (top[channel] - bottom[channel]) / ((0 < top[channel] - bottom[channel] ? 255 : 0) - bottom[channel]);
          return res;
        }).sort(function(a, b) {
          return a < b;
        })[0];
        processChannel = function(channel) {
          if (bestAlpha === 0) {
            return bottom[channel];
          } else {
            return bottom[channel] + (top[channel] - bottom[channel]) / bestAlpha;
          }
        };
        if (alpha != null) {
          bestAlpha = alpha;
        }
        bestAlpha = Math.max(Math.min(bestAlpha, 1), 0);
        this.red = processChannel('red');
        this.green = processChannel('green');
        this.blue = processChannel('blue');
        return this.alpha = Math.round(bestAlpha * 100) / 100;
      });
      registry.createExpression('hue', strip("hue" + ps + " (" + notQuote + ") " + comma + " (" + int + "deg|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloat(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        if (isNaN(amount)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [amount % 360, s, l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('stylus_sl_component_functions', strip("(saturation|lightness)" + ps + " (" + notQuote + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, channel, subexpr, _;
        _ = match[0], channel = match[1], subexpr = match[2], amount = match[3];
        amount = context.readInt(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        if (isNaN(amount)) {
          return this.invalid = true;
        }
        baseColor[channel] = amount;
        return this.rgba = baseColor.rgba;
      });
      registry.createExpression('adjust-hue', strip("adjust-hue" + ps + " (" + notQuote + ") " + comma + " (-?" + int + "deg|" + variables + "|-?" + optionalPercent + ") " + pe), function(match, expression, context) {
        var amount, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloat(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [(h + amount) % 360, s, l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('mix', strip("mix" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " " + comma + " (" + floatOrPercent + "|" + variables + ") ) " + pe), function(match, expression, context) {
        var amount, baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
        _ = match[0], expr = match[1];
        _ref2 = split(expr), color1 = _ref2[0], color2 = _ref2[1], amount = _ref2[2];
        if (amount != null) {
          amount = context.readFloatOrPercent(amount);
        } else {
          amount = 0.5;
        }
        baseColor1 = context.readColor(color1);
        baseColor2 = context.readColor(color2);
        if (isInvalid(baseColor1) || isInvalid(baseColor2)) {
          return this.invalid = true;
        }
        return _ref3 = mixColors(baseColor1, baseColor2, amount), this.rgba = _ref3.rgba, _ref3;
      });
      registry.createExpression('tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, subexpr, white, _;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        white = new Color(255, 255, 255);
        return this.rgba = mixColors(white, baseColor, amount).rgba;
      });
      registry.createExpression('shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, black, subexpr, _;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        black = new Color(0, 0, 0);
        return this.rgba = mixColors(black, baseColor, amount).rgba;
      });
      registry.createExpression('desaturate', "desaturate" + ps + "(" + notQuote + ")" + comma + "(" + floatOrPercent + "|" + variables + ")" + pe, function(match, expression, context) {
        var amount, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [h, clampInt(s - amount * 100), l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('saturate', strip("saturate" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [h, clampInt(s + amount * 100), l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('grayscale', "gr(?:a|e)yscale" + ps + "(" + notQuote + ")" + pe, function(match, expression, context) {
        var baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1];
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [h, 0, l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('invert', "invert" + ps + "(" + notQuote + ")" + pe, function(match, expression, context) {
        var b, baseColor, g, r, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1];
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.rgb, r = _ref2[0], g = _ref2[1], b = _ref2[2];
        this.rgb = [255 - r, 255 - g, 255 - b];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('complement', "complement" + ps + "(" + notQuote + ")" + pe, function(match, expression, context) {
        var baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1];
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [(h + 180) % 360, s, l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('spin', strip("spin" + ps + " (" + notQuote + ") " + comma + " (-?(" + int + ")(deg)?|" + variables + ") " + pe), function(match, expression, context) {
        var angle, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], angle = match[2];
        baseColor = context.readColor(subexpr);
        angle = context.readInt(angle);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [(360 + h + angle) % 360, s, l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('contrast_n_arguments', strip("contrast" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), function(match, expression, context) {
        var base, baseColor, dark, expr, light, res, threshold, _, _ref2, _ref3;
        _ = match[0], expr = match[1];
        _ref2 = split(expr), base = _ref2[0], dark = _ref2[1], light = _ref2[2], threshold = _ref2[3];
        baseColor = context.readColor(base);
        dark = context.readColor(dark);
        light = context.readColor(light);
        if (threshold != null) {
          threshold = context.readPercent(threshold);
        }
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        if (dark != null ? dark.invalid : void 0) {
          return this.invalid = true;
        }
        if (light != null ? light.invalid : void 0) {
          return this.invalid = true;
        }
        res = contrast(baseColor, dark, light);
        if (isInvalid(res)) {
          return this.invalid = true;
        }
        return _ref3 = contrast(baseColor, dark, light, threshold), this.rgb = _ref3.rgb, _ref3;
      });
      registry.createExpression('contrast_1_argument', strip("contrast" + ps + " (" + notQuote + ") " + pe), function(match, expression, context) {
        var baseColor, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1];
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        return _ref2 = contrast(baseColor), this.rgb = _ref2.rgb, _ref2;
      });
      registry.createExpression('css_color_function', "(?:" + namePrefixes + ")(color" + ps + "(" + notQuote + ")" + pe + ")", function(match, expression, context) {
        var e, expr, rgba, _;
        try {
          _ = match[0], expr = match[1];
          rgba = cssColor.convert(expr);
          this.rgba = context.readColor(rgba).rgba;
          return this.colorExpression = expr;
        } catch (_error) {
          e = _error;
          return this.invalid = true;
        }
      });
      registry.createExpression('sass_adjust_color', "adjust-color" + ps + "(" + notQuote + ")" + pe, 1, function(match, expression, context) {
        var baseColor, param, params, subexpr, subject, _, _i, _len, _ref2;
        _ = match[0], subexpr = match[1];
        _ref2 = split(subexpr), subject = _ref2[0], params = 2 <= _ref2.length ? __slice.call(_ref2, 1) : [];
        baseColor = context.readColor(subject);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        for (_i = 0, _len = params.length; _i < _len; _i++) {
          param = params[_i];
          readParam(param, function(name, value) {
            return baseColor[name] += context.readFloat(value);
          });
        }
        return this.rgba = baseColor.rgba;
      });
      registry.createExpression('sass_scale_color', "scale-color" + ps + "(" + notQuote + ")" + pe, 1, function(match, expression, context) {
        var baseColor, param, params, subexpr, subject, _, _i, _len, _ref2;
        _ = match[0], subexpr = match[1];
        _ref2 = split(subexpr), subject = _ref2[0], params = 2 <= _ref2.length ? __slice.call(_ref2, 1) : [];
        baseColor = context.readColor(subject);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        for (_i = 0, _len = params.length; _i < _len; _i++) {
          param = params[_i];
          readParam(param, function(name, value) {
            var dif, result;
            value = context.readFloat(value) / 100;
            result = value > 0 ? (dif = MAX_PER_COMPONENT[name] - baseColor[name], result = baseColor[name] + dif * value) : result = baseColor[name] * (1 + value);
            return baseColor[name] = result;
          });
        }
        return this.rgba = baseColor.rgba;
      });
      registry.createExpression('sass_change_color', "change-color" + ps + "(" + notQuote + ")" + pe, 1, function(match, expression, context) {
        var baseColor, param, params, subexpr, subject, _, _i, _len, _ref2;
        _ = match[0], subexpr = match[1];
        _ref2 = split(subexpr), subject = _ref2[0], params = 2 <= _ref2.length ? __slice.call(_ref2, 1) : [];
        baseColor = context.readColor(subject);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        for (_i = 0, _len = params.length; _i < _len; _i++) {
          param = params[_i];
          readParam(param, function(name, value) {
            return baseColor[name] = context.readFloat(value);
          });
        }
        return this.rgba = baseColor.rgba;
      });
      registry.createExpression('stylus_blend', strip("blend" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), function(match, expression, context) {
        var baseColor1, baseColor2, color1, color2, expr, _, _ref2;
        _ = match[0], expr = match[1];
        _ref2 = split(expr), color1 = _ref2[0], color2 = _ref2[1];
        baseColor1 = context.readColor(color1);
        baseColor2 = context.readColor(color2);
        if (isInvalid(baseColor1) || isInvalid(baseColor2)) {
          return this.invalid = true;
        }
        return this.rgba = [baseColor1.red * baseColor1.alpha + baseColor2.red * (1 - baseColor1.alpha), baseColor1.green * baseColor1.alpha + baseColor2.green * (1 - baseColor1.alpha), baseColor1.blue * baseColor1.alpha + baseColor2.blue * (1 - baseColor1.alpha), baseColor1.alpha + baseColor2.alpha - baseColor1.alpha * baseColor2.alpha];
      });
      blendMethod(registry, 'multiply', BlendModes.MULTIPLY);
      blendMethod(registry, 'screen', BlendModes.SCREEN);
      blendMethod(registry, 'overlay', BlendModes.OVERLAY);
      blendMethod(registry, 'softlight', BlendModes.SOFT_LIGHT);
      blendMethod(registry, 'hardlight', BlendModes.HARD_LIGHT);
      blendMethod(registry, 'difference', BlendModes.DIFFERENCE);
      blendMethod(registry, 'exclusion', BlendModes.EXCLUSION);
      blendMethod(registry, 'average', BlendModes.AVERAGE);
      blendMethod(registry, 'negation', BlendModes.NEGATION);
      registry.createExpression('lua_rgba', strip("Color" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + pe), function(match, expression, context) {
        var a, b, g, r, _;
        _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
        this.red = context.readInt(r);
        this.green = context.readInt(g);
        this.blue = context.readInt(b);
        return this.alpha = context.readInt(a) / 255;
      });
      registry.createExpression('elm_rgba', strip("rgba\\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), function(match, expression, context) {
        var a, b, g, r, _;
        _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
        this.red = context.readInt(r);
        this.green = context.readInt(g);
        this.blue = context.readInt(b);
        return this.alpha = context.readFloat(a);
      });
      registry.createExpression('elm_rgb', strip("rgb\\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ")"), function(match, expression, context) {
        var b, g, r, _;
        _ = match[0], r = match[1], g = match[2], b = match[3];
        this.red = context.readInt(r);
        this.green = context.readInt(g);
        return this.blue = context.readInt(b);
      });
      elmAngle = "(?:" + float + "|\\(degrees\\s+(?:" + int + "|" + variables + ")\\))";
      elmDegreesRegexp = new RegExp("\\(degrees\\s+(" + int + "|" + variables + ")\\)");
      registry.createExpression('elm_hsl', strip("hsl\\s+ (" + elmAngle + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), function(match, expression, context) {
        var h, hsl, l, m, s, _;
        _ = match[0], h = match[1], s = match[2], l = match[3];
        if (m = elmDegreesRegexp.exec(h)) {
          h = context.readInt(m[1]);
        } else {
          h = context.readFloat(h) * 180 / Math.PI;
        }
        hsl = [h, context.readFloat(s), context.readFloat(l)];
        if (hsl.some(function(v) {
          return (v == null) || isNaN(v);
        })) {
          return this.invalid = true;
        }
        this.hsl = hsl;
        return this.alpha = 1;
      });
      registry.createExpression('elm_hsla', strip("hsla\\s+ (" + elmAngle + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), function(match, expression, context) {
        var a, h, hsl, l, m, s, _;
        _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
        if (m = elmDegreesRegexp.exec(h)) {
          h = context.readInt(m[1]);
        } else {
          h = context.readFloat(h) * 180 / Math.PI;
        }
        hsl = [h, context.readFloat(s), context.readFloat(l)];
        if (hsl.some(function(v) {
          return (v == null) || isNaN(v);
        })) {
          return this.invalid = true;
        }
        this.hsl = hsl;
        return this.alpha = context.readFloat(a);
      });
      registry.createExpression('elm_grayscale', "gr(?:a|e)yscale\\s+(" + float + "|" + variables + ")", function(match, expression, context) {
        var amount, _;
        _ = match[0], amount = match[1];
        amount = Math.floor(255 - context.readFloat(amount) * 255);
        return this.rgb = [amount, amount, amount];
      });
      registry.createExpression('elm_complement', strip("complement\\s+(" + notQuote + ")"), function(match, expression, context) {
        var baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1];
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [(h + 180) % 360, s, l];
        return this.alpha = baseColor.alpha;
      });
      if (context != null ? context.hasColorVariables() : void 0) {
        paletteRegexpString = createVariableRegExpString(context.getColorVariables());
        registry.createExpression('variables', paletteRegexpString, 1, function(match, expression, context) {
          var baseColor, name, _;
          _ = match[0], name = match[1];
          baseColor = context.readColor(name);
          this.colorExpression = name;
          this.variables = baseColor != null ? baseColor.variables : void 0;
          if (isInvalid(baseColor)) {
            return this.invalid = true;
          }
          return this.rgba = baseColor.rgba;
        });
      }
      return registry;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL0thbWlsaXVzLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1leHByZXNzaW9ucy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa1dBQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsb0JBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsT0FlSSxPQUFBLENBQVEsV0FBUixDQWZKLEVBQ0UsV0FBQSxHQURGLEVBRUUsYUFBQSxLQUZGLEVBR0UsZUFBQSxPQUhGLEVBSUUsdUJBQUEsZUFKRixFQUtFLG9CQUFBLFlBTEYsRUFNRSxzQkFBQSxjQU5GLEVBT0UsYUFBQSxLQVBGLEVBUUUsZ0JBQUEsUUFSRixFQVNFLG1CQUFBLFdBVEYsRUFVRSxVQUFBLEVBVkYsRUFXRSxVQUFBLEVBWEYsRUFZRSxpQkFBQSxTQVpGLEVBYUUsb0JBQUEsWUFiRixFQWNFLGtDQUFBLDBCQWhCRixDQUFBOztBQUFBLEVBbUJBLFFBS0ksT0FBQSxDQUFRLFNBQVIsQ0FMSixFQUNFLGNBQUEsS0FERixFQUVFLGNBQUEsS0FGRixFQUdFLGNBQUEsS0FIRixFQUlFLGlCQUFBLFFBdkJGLENBQUE7O0FBQUEsRUEwQkEsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHdCQUFSLENBMUJ0QixDQUFBOztBQUFBLEVBMkJBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSLENBM0JsQixDQUFBOztBQUFBLEVBNEJBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQTVCWixDQUFBOztBQUFBLEVBNkJBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQTdCUixDQUFBOztBQUFBLEVBOEJBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQTlCYixDQUFBOztBQUFBLEVBZ0NBLGlCQUFBLEdBQ0U7QUFBQSxJQUFB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

//# sourceURL=/Users/Kamilius/.atom/packages/pigments/lib/color-expressions.coffee
