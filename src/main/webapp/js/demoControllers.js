angular.module('DemoControllers', ['DemoServices', 'rx'])

.factory('PromisesController', ['callbackHttp', '$q', '$filter', function(http, $q, $filter) {
  var construct = function($scope) {
    $scope.symbolChoices = ['AAPL', 'AMZN', 'GOOG', 'MENT', 'YHOO'];
    $scope.symbol = $scope.symbolChoices[0];
    $scope.sharesChoices = [1,2,3,4,5,6,7,8,9,10];
    $scope.shares = $scope.sharesChoices[0];
    $scope.graphics = ['$', '£', '€', '₹', '$'];
    $scope.currencies = ['USD', 'GBP', 'EUR', 'INR', 'CLP'];
    $scope.currency = 0;
    $scope.graphic = $scope.graphics[0];

    $scope.setQuote = function(quote) {
      $scope.quote = $filter('currency')(quote, $scope.graphic);
    };

    $scope.setQuote(0);

    $scope.onQuote = function() {
      $scope.graphic = $scope.graphics[$scope.currency];
      doQuote();
    };




    var symbol = function(){ return $scope.symbol };
    var shares = function(){ return $scope.shares };
    var currency = function(){ return $scope.currencies[$scope.currency] };

    // /quote/<symbol>
    // /convert/<currency>/<usd>
    // /exchange/<currency>

    var doQuote = function() {
      $scope.quote = "Implement me!";
    }

  };

  return {
    forScope: construct
  }
}])

.factory('StreamsController', ['PromisesController', 'observeOnScope', 'promiseHttp',
  function(ctrl, observe, http){
    var construct = function($scope){
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
    var construct = function($scope) {
      ctrl.forScope($scope);

      var updateGraph = function(data) {
        var graph = new Dygraph(document.getElementById("chart"),
          data.data,
          {
            labels: data.labels,
            width: 700
          }
        );
      };
      var symbol = function(){ return $scope.symbol };


      // /history/<symbol>

    };

    return {
      forScope: construct
    }
  }])

;