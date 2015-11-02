(function() {
  var ParseLCOV;

  module.exports = ParseLCOV = (function() {
    function ParseLCOV(array) {
      this.data = array;
    }

    ParseLCOV.prototype.parse = function() {
      var count, coverage, currFc, header, headerLength, i, length, line, notTaken, position, record, value, values;
      i = 0;
      length = this.data.length;
      coverage = {};
      while (i < length) {
        record = this.data[i];
        headerLength = record.indexOf(':');
        if (headerLength > -1) {
          header = record.substr(0, headerLength);
          value = record.substr(headerLength + 1, record.length - headerLength);
          if (header === 'SF') {
            coverage[value] = {};
            currFc = coverage[value];
          }
          if (header === 'DA') {
            if (!currFc['coveredLines']) {
              currFc['coveredLines'] = [];
            }
            position = value.indexOf(',');
            line = value.substr(0, position);
            count = value.substr(position + 1, value.length - 1);
            currFc['coveredLines'].push({
              line: parseInt(line),
              count: parseInt(count)
            });
          }
          if (header === 'BRDA') {
            values = value.split(',');
            line = values[0];
            notTaken = values[3] === '0';
            if (notTaken) {
              if (!currFc['uncoveredBranches']) {
                currFc['uncoveredBranches'] = [];
              }
              currFc['uncoveredBranches'].push(parseInt(line));
            }
          }
        }
        i++;
      }
      return coverage;
    };

    return ParseLCOV;

  })();

}).call(this);
