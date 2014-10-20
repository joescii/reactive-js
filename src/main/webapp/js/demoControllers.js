angular.module('DemoControllers', ['DemoServices', 'rx'])

.factory('PromisesController', ['promiseHttp', function(http) {
  var construct = function($scope) {
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
      setQuote();
    };




    const symbol = function(){ return $scope.symbol };
    const shares = function(){ return $scope.shares };
    const currency = function(){ return $scope.currencies[$scope.currency] };

    // /quote/<symbol>
    // /convert/<currency>/<usd>

    const quote = function(){ return http.get("/quote/"+symbol()) };
    const convert = function(usd){ return http.get("/convert/"+currency()+"/"+usd) };

    const setQuote = function() {
      console.log("Symbol is "+symbol());
      console.log("Shares is "+shares());
      console.log("Currency is "+currency());

      // I promise it can be better. :)
      quote()
        .then(function(quote){ return quote * shares() })
        .then(convert)
        .then(function(total){ $scope.quote = total })
        .catch(function(err){ console.log(err) })
    };

  };

  return {
    forScope: construct
  }
}])

.factory('StreamsController', ['PromisesController', 'observeOnScope', 'promiseHttp', function(ctrl, observe, http){
  var construct = function($scope){
    ctrl.forScope($scope);
    observe($scope, 'symSearch')
      .map(function(e){return e.newValue})
      .filter(function(v){return v})
      .throttle(1000)
      .distinctUntilChanged()
      .subscribe(function(v){
        http.get("/suggest/"+encodeURIComponent(v))
          .then(function(suggestions) {
            $scope.symChoices = suggestions;
          })
          .catch(function(err) {
            console.log('well, damn');
            console.log(err);
          })
      });

    $scope.selectSuggestion = function(index) {
      $scope.symbol = $scope.symChoices[index].symbol;
    };
  };

  return {
    forScope: construct
  }
}])

;