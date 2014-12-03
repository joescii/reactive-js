angular.module('DemoControllers', ['DemoServices', 'rx'])

.factory('PromisesController', ['promiseHttp', '$q', '$filter', function(http, $q, $filter) {
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

    var fetchQuote = function(){
      return http.get('/quote/'+symbol());
    };
    var fetchExchange = function(){
      return http.get('/exchange/'+currency());
    };
    var fetchBoth = function(){
      return $q.all([fetchQuote(), fetchExchange()])
    };
    var multiplyIt = function(quote){
      return quote * shares();
    };
    var multiplyThem = function(arr){
      return arr[0] * arr[1];
    };

    var convertIt = function(product){
      return http.get('/convert/'+currency()+'/'+product);
    };
    var setIt = function(total){
      $scope.setQuote(total);
      return total;
    };
    var logIt = function(it){ console.log(it); return it };

    var doQuote = function() {
//      fetchQuote()
//        .then(multiplyIt)
//        .then(logIt)
//        .then(convertIt)
//        .then(setIt)
//        ;
      fetchBoth()
        .then(logIt)
        .then(multiplyThem)
        .then(multiplyIt)
        .then(setIt)
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

      var toNewValue = function(event) { return event.newValue; };
      var isDefined = function(v) { return v };
      var longerThan2 = function(str) { return str.length > 2 };
      var getSuggestions = function(query){
        http.get("/suggest/"+encodeURIComponent(query))
          .then(function(suggestions){
            $scope.suggestions = suggestions;
          });
      };

      observe($scope, 'symSearch')
        .map(toNewValue)
        .filter(isDefined)
        .filter(longerThan2)
        .throttle(750)
        .distinctUntilChanged()
        .subscribe(getSuggestions);
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