(function() {
  this.RangeFilter = function() {
    var filter;
    filter = function(input, max) {
      var i, _i;
      max = parseInt(max);
      for (i = _i = 1; _i <= max; i = _i += 1) {
        input.push(i);
      }
      return input;
    };
    return filter;
  };

}).call(this);
