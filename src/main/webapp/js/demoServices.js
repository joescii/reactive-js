angular.module('DemoServices', [])

.factory('formatter', function(){
  const monetary = function(n) {
    return n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  return {
    toCurrency: monetary
  }
})

.factory('callbackHttp', ['$rootScope', function($rootScope){
  var httpGet = function (url, success, fail) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          $rootScope.$apply(success(request.responseText));
        } else {
          if(fail != null) $rootScope.$apply(fail(request.status));
        }
      }
    };
    request.open("GET", url , true);
    request.send(null);
  };

  return {
    get: httpGet
  }

}])

.factory('promiseHttp', ['$http', function($http){
  var httpGet = function(url) {
    return $http.get(url).then(function(res){return res.data});
  };

  return {
    get: httpGet
  }

}])

.factory('convertedHttp', ['callbackHttp', '$q',
  function(http, $q){
    const httpGet = function(url){
      const defer = $q.defer();

      http.get(url,function(response){
        defer.resolve(response);
      },function(err){
        defer.reject(err);
      });

      return defer.promise;
    };

    return {
      get: httpGet
    }
}])

;