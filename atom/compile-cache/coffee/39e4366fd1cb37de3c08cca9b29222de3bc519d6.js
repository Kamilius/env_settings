(function() {
  var $;

  $ = require("atom-space-pen-views").$;

  module.exports = {
    activate: function(state) {
      return atom.workspace.observeTextEditors(function(editor) {
        var _editor;
        _editor = editor;
        return editor.onDidChange(function() {
          var shadow, view;
          view = $(atom.views.getView(_editor));
          shadow = $(view[0].shadowRoot);
          shadow.find(".css.color, .rgb-value, .w3c-standard-color-name").each(function(i, el) {
            var type;
            type = $(this).prevAll(".support.function").text();
            if (type === "rgb" || type === "rgba") {
              return $(this)[0].style["border-bottom"] = "1px solid " + type + "(" + el.innerText + ")";
            } else {
              return $(this)[0].style["border-bottom"] = "1px solid " + el.innerText;
            }
          });
          shadow.find(".meta.property-value.css").each(function(i, el) {
            var cache, hslValues, type, values;
            type = $(this).find(".support.function, .misc.css").text();
            cache = $(this).find(".numeric.css");
            if (type === "hsl" || type === "hsla") {
              values = "";
              hslValues = cache.each(function() {
                return values += $(this).text() + ",";
              });
              if (values.length) {
                values = values.slice(0, values.length - 1);
                return cache.each(function() {
                  return $(this)[0].style["border-bottom"] = "1px solid " + type + "(" + values + ")";
                });
              }
            }
          });
          return shadow.find(".less").each(function() {
            var cache, rgbValues, type, values;
            type = $(this).find(".builtin").text();
            cache = $(this).find(".numeric.css");
            if (type === "rgb" || type === "rgba") {
              values = "";
              rgbValues = cache.each(function() {
                return values += $(this).text() + ",";
              });
              if (values.length) {
                values = values.slice(0, values.length - 1);
                return cache.each(function() {
                  return $(this)[0].style["border-bottom"] = "1px solid " + type + "(" + values + ")";
                });
              }
            }
          });
        });
      });
    }
  };

}).call(this);
