angular.module('Streams', ['rx'])

.controller('StreamsSlide', ['$scope', 'observeOnScope', 'promiseHttp', function($scope, observe, http){
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
}])

;