angular.module('Promises', [])

.factory('callbackHttp', ['$rootScope', function($rootScope){
  var httpGet = function (url, success, fail) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          $rootScope.$apply(success(request.responseText));
        } else {
          if(fail != null) $rootScope.$apply(fail(request.status));
        }
      }
    };
    request.open("GET", url , true);
    request.send(null);
  };

  return {
    get: httpGet
  }

}])

.controller('PromisesSlide', ['$scope', 'callbackHttp', function($scope, http){
  var success = function(quote) {
    $scope.ment = quote;
  };

  $scope.onQuote = function() {
    http.get("/quote/MENT", success);
  }

}])

;



