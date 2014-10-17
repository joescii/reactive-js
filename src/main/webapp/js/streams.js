angular.module('Streams', [])

.controller('StreamsSlide', ['$scope', function($scope){
  var events = function(topic) {
    return Rx.Observable.create(function(observer){
      return $scope.$on(topic, function(event, data){
        observer.onNext(data);
      })
  })};
  var quotes = events('CurrencyQuote');
  var time = events('CurrentTime');

  time.subscribe(function(data){
    $scope.time = data;
  });

  var currencyIs = function(currency) {
    return function(quote) {
      return quote.currency === currency;
    }
  };
  var toQuote = function(data) { return data.quote };
  quotes.where(currencyIs('EUR')).map(toQuote).forEach(function(eur){ $scope.eur = eur })
}])

;