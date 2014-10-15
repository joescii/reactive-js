angular.module('Promises', ['DemoServices'])

.controller('PromisesSlide', ['$scope', '$http', function($scope, http){
  $scope.usd = 0;
  $scope.eur = 0;

  var withQuote = function(quote) {
    $scope.usd = quote;
    return convert(quote);
  };
  var withConversion = function(converted) {
    $scope.eur = converted;
  };

  var convert = function(usd) {
    return http.get("/convert/EUR/"+usd);
  };

  var quote = function() {
    return http.get("/quote/MENT");
  };

  $scope.onQuote = function() {
    quote()
      .then(function(usd){return withQuote(usd.data)})
      .then(function(eur){return withConversion(eur.data)})
      .catch(function(err){console.log("You can't get ye stocks!!!")})
  }

}])

;




