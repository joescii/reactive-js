angular.module('DemoControllers', ['DemoServices', 'rx'])

.factory('PromisesController', ['convertedHttp', '$q', function(http, $q) {
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
      doQuote();
    };




    const symbol = function(){ return $scope.symbol };
    const shares = function(){ return $scope.shares };
    const currency = function(){ return $scope.currencies[$scope.currency] };

    // /quote/<symbol>
    // /exchange/<currency>
    // /convert/<currency>/<usd>

    const getQuote = function(){ return http.get("/quote/"+symbol()) };
    const getExchange = function(){ return http.get("/exchange/"+currency()) };
    const multiplyIt = function(v){ return v * shares() };
    const convertIt = function(usd){ return http.get("/convert/"+currency()+"/"+usd) };
    const setQuote = function(q){ $scope.quote = q };
    const logIt = function(err){ console.log(err) };

    const doQuote = function() {
      console.log("Symbol is "+symbol());
      console.log("Shares is "+shares());
      console.log("Currency is "+currency());

      http.get("/history/"+symbol())
        .then()

      $q.all([getQuote(), getExchange()])
        .then(function(both){
          setQuote(both[0] * both[1] * shares())
        })
        .catch(logIt);

      // I promise it can be better. :)
//      getQuote()
//        .then(multiplyIt)
//        .then(convertIt)
//        .then(setQuote)
//        .catch(logIt)
    };

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

    const toNewValue = function(event) { return event.newValue };
    const isDefined = function(v){ return v };
    const longerThan2 = function(text){ return text.length > 2 };
    const getSuggestions = function(text){
      http.get("/suggest/"+encodeURIComponent(text))
        .then(function(suggestions) {
          $scope.suggestions = suggestions;
        })
    };

    observe($scope, 'symSearch')
      .map(toNewValue)
      .filter(isDefined)
      .filter(longerThan2)
      .throttle(500)
      .distinctUntilChanged()
      .subscribe(getSuggestions);

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

      $scope.onQuote = function() {
        http.get('/history/'+$scope.symbol)
          .then(StockData.parse)
          .then(StockData.addSmavg)
          .then(StockData.addEmavg)
          .then(StockData.addLinearReg)
          .then(updateGraph)
          .catch(function (err) {
            console.log(err)
          });
      }
    };

    return {
      forScope: construct
    }
  }])

;