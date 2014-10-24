angular.module('DemoControllers', ['DemoServices', 'rx'])

.factory('PromisesController', ['callbackHttp', '$q', function(http, $q) {
  const construct = function($scope) {
    $scope.symbolChoices = ['AAPL', 'AMZN', 'GOOG', 'MENT', 'YHOO'];
    $scope.symbol = $scope.symbolChoices[0];
    $scope.sharesChoices = [1,2,3,4,5,6,7,8,9,10];
    $scope.shares = $scope.sharesChoices[0];
    $scope.graphics = ['$', '£', '€', '₹', '$'];
    $scope.currencies = ['USD', 'GBP', 'EUR', 'INR', 'CLP'];
    $scope.currency = 0;
    $scope.graphic = $scope.graphics[0];
    $scope.quote = 0;

    $scope.onQuote = function() {
      $scope.graphic = $scope.graphics[$scope.currency];
      doQuote();
    };




    const symbol = function(){ return $scope.symbol };
    const shares = function(){ return $scope.shares };
    const currency = function(){ return $scope.currencies[$scope.currency] };

    // /quote/<symbol>
    // /exchange/<currency>
    // /convert/<currency>/<usd>

    const doQuote = function() {
      $scope.quote = "Implement me!";
    }

  };

  return {
    forScope: construct
  }
}])

.factory('StreamsController', ['PromisesController', 'observeOnScope', 'promiseHttp',
  function(ctrl, observe, http){
    const construct = function($scope){
      ctrl.forScope($scope);
      $scope.symbol = "";

      // Click handler
      $scope.selectSuggestion = function(index) {
        $scope.symbol = $scope.suggestions[index].symbol;
      };



      // /suggest/<query>

    };

    return {
      forScope: construct
    }
}])

.factory('WorkersController', ['PromisesController', 'promiseHttp',
  function(ctrl, http){
    const construct = function($scope) {
      ctrl.forScope($scope);

      const updateGraph = function(data) {
        var graph = new Dygraph(document.getElementById("chart"),
          data.data,
          {
            labels: data.labels,
            width: 700
          }
        );
      };

      // /history/<query>

    };

    return {
      forScope: construct
    }
  }])

;