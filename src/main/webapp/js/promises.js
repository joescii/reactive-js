angular.module('Promises', [])

.factory('callbackHttp', function(){
  var httpGet = function (url, success, fail) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          success(request.responseText);
        } else {
          if(fail != null) fail(request.status);
        }
      }
    };
    request.open("GET", url , true);
    request.send(null);
  };

  return {
    get: httpGet
  }

})

.controller('PromisesSlide', ['$scope', 'callbackHttp', function($scope, http){
  var success = function(quote) {
    $scope.ment = quote;
  };

  $scope.onQuote = function() {
    http.get("http://finance.yahoo.com/d/quotes.csv?s=MENT&f=l1", success);
  }

}])

;




