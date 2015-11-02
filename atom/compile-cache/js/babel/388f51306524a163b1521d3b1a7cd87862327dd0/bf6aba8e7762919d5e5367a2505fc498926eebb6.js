var QuadraticCalculator = React.createClass({
  displayName: "QuadraticCalculator",

  getInitialState: function getInitialState() {
    console.log("test");
    return {
      a: 1,
      b: 3,
      c: -4
    };
  },

  /**
   * This function will be re-bound in render multiple times. Each .bind() will
   * create a new function that calls this with the appropriate key as well as
   * the event. The key is the key in the state object that the value should be
   * mapped from.
   */
  handleInputChange: function handleInputChange(key, event) {
    var partialState = {};
    partialState[key] = parseFloat(event.target.value);
    this.setState(partialState);
  },

  render: function render() {
    var a = this.state.a;
    var b = this.state.b;
    var c = this.state.c;
    var root = Math.sqrt(Math.pow(b, 2) - 4 * a * c);
    var denominator = 2 * a;
    var x1 = (-b + root) / denominator;
    var x2 = (-b - root) / denominator;
    return React.createElement(
      "div",
      null,
      React.createElement(
        "strong",
        null,
        React.createElement(
          "em",
          null,
          "ax"
        ),
        React.createElement(
          "sup",
          null,
          "2"
        ),
        " + ",
        React.createElement(
          "em",
          null,
          "bx"
        ),
        " + ",
        React.createElement(
          "em",
          null,
          "c"
        ),
        " = 0"
      ),
      React.createElement(
        "h4",
        null,
        "Solve for ",
        React.createElement(
          "em",
          null,
          "x"
        ),
        ":"
      ),
      React.createElement(
        "p",
        null,
        React.createElement(
          "label",
          null,
          "a: ",
          React.createElement("input", { type: "number", value: a, onChange: this.handleInputChange.bind(null, 'a') })
        ),
        React.createElement("br", null),
        React.createElement(
          "label",
          null,
          "b: ",
          React.createElement("input", { type: "number", value: b, onChange: this.handleInputChange.bind(null, 'b') })
        ),
        React.createElement("br", null),
        React.createElement(
          "label",
          null,
          "c: ",
          React.createElement("input", { type: "number", value: c, onChange: this.handleInputChange.bind(null, 'c') })
        ),
        React.createElement("br", null),
        "x: ",
        React.createElement(
          "strong",
          null,
          x1,
          ", ",
          x2
        )
      )
    );
  }
});

React.render(React.createElement(QuadraticCalculator, null), document.getElementById('container'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9zcGVjL2ZpeHR1cmVzL2RpcmIvZ29vZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMxQyxpQkFBZSxFQUFFLDJCQUFXO0FBQzFCLFdBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbkIsV0FBTztBQUNMLE9BQUMsRUFBRSxDQUFDO0FBQ0osT0FBQyxFQUFFLENBQUM7QUFDSixPQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ04sQ0FBQztHQUNIOzs7Ozs7OztBQVFELG1CQUFpQixFQUFFLDJCQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDdEMsUUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLGdCQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUM3Qjs7QUFFRCxRQUFNLEVBQUUsa0JBQVc7QUFDakIsUUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDckIsUUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDckIsUUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDckIsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pELFFBQUksV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEIsUUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUEsR0FBSSxXQUFXLENBQUM7QUFDbkMsUUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUEsR0FBSSxXQUFXLENBQUM7QUFDbkMsV0FDRTs7O01BQ0U7OztRQUNFOzs7O1NBQVc7UUFBQTs7OztTQUFZOztRQUFHOzs7O1NBQVc7O1FBQUc7Ozs7U0FBVTs7T0FDM0M7TUFDVDs7OztRQUFjOzs7O1NBQVU7O09BQU07TUFDOUI7OztRQUNFOzs7O1VBQ0ssK0JBQU8sSUFBSSxFQUFDLFFBQVEsRUFBQyxLQUFLLEVBQUUsQ0FBQyxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxBQUFDLEdBQUc7U0FDaEY7UUFDUiwrQkFBTTtRQUNOOzs7O1VBQ0ssK0JBQU8sSUFBSSxFQUFDLFFBQVEsRUFBQyxLQUFLLEVBQUUsQ0FBQyxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxBQUFDLEdBQUc7U0FDaEY7UUFDUiwrQkFBTTtRQUNOOzs7O1VBQ0ssK0JBQU8sSUFBSSxFQUFDLFFBQVEsRUFBQyxLQUFLLEVBQUUsQ0FBQyxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxBQUFDLEdBQUc7U0FDaEY7UUFDUiwrQkFBTTs7UUFDRDs7O1VBQVMsRUFBRTs7VUFBSSxFQUFFO1NBQVU7T0FDOUI7S0FDQSxDQUNOO0dBQ0g7Q0FDRixDQUFDLENBQUM7O0FBRUgsS0FBSyxDQUFDLE1BQU0sQ0FDVixvQkFBQyxtQkFBbUIsT0FBRyxFQUN2QixRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUNyQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9LYW1pbGl1cy8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9zcGVjL2ZpeHR1cmVzL2RpcmIvZ29vZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBRdWFkcmF0aWNDYWxjdWxhdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKFwidGVzdFwiKVxuICAgIHJldHVybiB7XG4gICAgICBhOiAxLFxuICAgICAgYjogMyxcbiAgICAgIGM6IC00XG4gICAgfTtcbiAgfSxcblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIHJlLWJvdW5kIGluIHJlbmRlciBtdWx0aXBsZSB0aW1lcy4gRWFjaCAuYmluZCgpIHdpbGxcbiAgICogY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhpcyB3aXRoIHRoZSBhcHByb3ByaWF0ZSBrZXkgYXMgd2VsbCBhc1xuICAgKiB0aGUgZXZlbnQuIFRoZSBrZXkgaXMgdGhlIGtleSBpbiB0aGUgc3RhdGUgb2JqZWN0IHRoYXQgdGhlIHZhbHVlIHNob3VsZCBiZVxuICAgKiBtYXBwZWQgZnJvbS5cbiAgICovXG4gIGhhbmRsZUlucHV0Q2hhbmdlOiBmdW5jdGlvbihrZXksIGV2ZW50KSB7XG4gICAgdmFyIHBhcnRpYWxTdGF0ZSA9IHt9O1xuICAgIHBhcnRpYWxTdGF0ZVtrZXldID0gcGFyc2VGbG9hdChldmVudC50YXJnZXQudmFsdWUpO1xuICAgIHRoaXMuc2V0U3RhdGUocGFydGlhbFN0YXRlKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhID0gdGhpcy5zdGF0ZS5hO1xuICAgIHZhciBiID0gdGhpcy5zdGF0ZS5iO1xuICAgIHZhciBjID0gdGhpcy5zdGF0ZS5jO1xuICAgIHZhciByb290ID0gTWF0aC5zcXJ0KE1hdGgucG93KGIsIDIpIC0gNCAqIGEgKiBjKTtcbiAgICB2YXIgZGVub21pbmF0b3IgPSAyICogYTtcbiAgICB2YXIgeDEgPSAoLWIgKyByb290KSAvIGRlbm9taW5hdG9yO1xuICAgIHZhciB4MiA9ICgtYiAtIHJvb3QpIC8gZGVub21pbmF0b3I7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxzdHJvbmc+XG4gICAgICAgICAgPGVtPmF4PC9lbT48c3VwPjI8L3N1cD4gKyA8ZW0+Yng8L2VtPiArIDxlbT5jPC9lbT4gPSAwXG4gICAgICAgIDwvc3Ryb25nPlxuICAgICAgICA8aDQ+U29sdmUgZm9yIDxlbT54PC9lbT46PC9oND5cbiAgICAgICAgPHA+XG4gICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgYTogPGlucHV0IHR5cGU9XCJudW1iZXJcIiB2YWx1ZT17YX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlSW5wdXRDaGFuZ2UuYmluZChudWxsLCAnYScpfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgYjogPGlucHV0IHR5cGU9XCJudW1iZXJcIiB2YWx1ZT17Yn0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlSW5wdXRDaGFuZ2UuYmluZChudWxsLCAnYicpfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgYzogPGlucHV0IHR5cGU9XCJudW1iZXJcIiB2YWx1ZT17Y30gb25DaGFuZ2U9e3RoaXMuaGFuZGxlSW5wdXRDaGFuZ2UuYmluZChudWxsLCAnYycpfSAvPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICB4OiA8c3Ryb25nPnt4MX0sIHt4Mn08L3N0cm9uZz5cbiAgICAgICAgPC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cblJlYWN0LnJlbmRlcihcbiAgPFF1YWRyYXRpY0NhbGN1bGF0b3IgLz4sXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKVxuKTtcbiJdfQ==