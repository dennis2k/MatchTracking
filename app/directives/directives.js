(function() {
  this.Alert = function($timeout) {
    var directive;
    directive = {};
    directive.restrict = 'AE';
    directive.templateUrl = function(ele, attrs) {
      return attrs.templateUrl || 'templates/alert.tpl.html';
    };
    directive.link = function(scope, element, attrs) {
      var show;
      scope.alert = {
        "class": '',
        message: '',
        show: false
      };
      scope.timer = null;
      scope.delay = 10000;
      show = function() {
        scope.alert.show = true;
        $timeout.cancel(scope.timer);
        return scope.timer = $timeout(function() {
          return scope.alert.show = false;
        }, scope.delay);
      };
      scope.$on('alert', function(event, data) {
        scope.alert = data;
        return show();
      });
      return scope.remove = function() {
        return scope.alert = {
          "class": '',
          show: false,
          message: ''
        };
      };
    };
    return directive;
  };

}).call(this);

(function() {
  this.Enlarge = function() {
    var directive;
    directive = {};
    directive.restrict = 'A';
    directive.link = function(scope, element, attrs) {
      var originalHeight, originalWidth;
      originalHeight = element.css('height');
      originalWidth = element.css('width');
      element.on('mouseenter', function() {
        return element.css('width', '100px').css('height', '100px');
      });
      return element.on('mouseleave', function() {
        return element.css('width', originalWidth).css('height', originalHeight);
      });
    };
    return directive;
  };

}).call(this);

(function() {
  this.HistoryBack = function($window) {
    var directive;
    directive = {};
    directive.restrict = 'AE';
    directive.link = function(scope, element, attr) {
      return element.on('click', function() {
        return $window.history.back();
      });
    };
    return directive;
  };

}).call(this);
