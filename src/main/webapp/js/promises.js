angular.module('Promises', ['DemoServices'])

.controller('PromisesSlide', ['$scope', '$http', function($scope, http){
  $scope.graphics = ['£', '€', '\u20B9', '$'];
  $scope.currencies = ['GBP', 'EUR', 'INR', 'CLP'];
  $scope.currency = 0;
  $scope.graphic = $scope.graphics[0];
  $scope.quote = 0;

  var quote = function() {
    return http.get("/quote/MENT");
  };

  var convert = function(usd) {
    return http.get("/convert/"+$scope.currencies[$scope.currency]+"/"+usd);
  };

  $scope.onQuote = function() {
    $scope.graphic = $scope.graphics[$scope.currency];
    quote()
      .then(function(usd){return convert(usd.data)})
      .then(function(price){$scope.quote = price.data})
      .catch(function(err){console.log("You can't get ye stocks!!!")})
  }

}])

;




