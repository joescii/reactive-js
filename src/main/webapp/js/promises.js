angular.module('Promises', ['DemoServices'])

.controller('PromisesSlide', ['$scope', 'callbackHttp', function($scope, http){
  var success = function(quote) {
    $scope.ment = quote;
  };

  $scope.onQuote = function() {
    http.get("/quote/MENT", success);
  }

}])

;




