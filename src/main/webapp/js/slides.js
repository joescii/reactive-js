angular.module('Slides', ['DemoControllers'])

.controller('PromisesSlide', ['$scope', 'PromisesController', function($scope, ctrl){
  ctrl.forScope($scope);
}])

.controller('StreamsSlide', ['$scope', 'StreamsController', function($scope, ctrl){
  ctrl.forScope($scope);
}])

;




