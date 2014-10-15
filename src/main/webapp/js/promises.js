angular.module('Promises', ['DemoServices'])

.controller('PromisesSlide', ['$scope', 'callbackHttp', function($scope, http){
  $scope.usd = 0;
  $scope.eur = 0;

  var withQuote = function(quote) {
    $scope.usd = quote;
    convert(quote);
  };
  var withConversion = function(converted) {
    $scope.eur = converted;
  };

  var convert = function(usd) {
    http.get("/convert/EUR/"+usd, withConversion);
  };

  $scope.onQuote = function() {
    http.get("/quote/MENT", withQuote);
  }

}])

;




