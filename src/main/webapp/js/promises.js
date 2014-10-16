angular.module('Promises', ['DemoServices'])

.controller('PromisesSlide', ['$scope', 'promiseHttp', function($scope, http){
  $scope.symbolChoices = ['AAPL', 'AMZN', 'GOOG', 'MENT', 'YHOO'];
  $scope.symbol = $scope.symbolChoices[0];
  $scope.sharesChoices = [1,2,3,4,5,6,7,8,9,10];
  $scope.shares = $scope.sharesChoices[0];
  $scope.graphics = ['$', '£', '€', '\u20B9', '$'];
  $scope.currencies = ['USD', 'GBP', 'EUR', 'INR', 'CLP'];
  $scope.currency = 0;
  $scope.graphic = $scope.graphics[0];
  $scope.quote = 0;

  var quote = function() {
    return http.get("/quote/"+$scope.symbol);
  };

  var convert = function(usd) {
    return http.get("/convert/"+$scope.currencies[$scope.currency]+"/"+usd);
  };

  $scope.onQuote = function() {
    $scope.graphic = $scope.graphics[$scope.currency];
    quote()
      .then(function(usd){return usd * $scope.shares})
      .then(function(usd){return convert(usd)})
      .then(function(price){$scope.quote = price})
      .catch(function(err){console.log("You can't get ye stocks!!!")})
  }

}])

;




