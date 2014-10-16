angular.module('Streams', [])

.controller('StreamsSlide', ['$scope', function($scope){
  $scope.$on('EUR', function(event, data){
    console.log('yo??');
    $scope.eur = data;
  });

}])

;