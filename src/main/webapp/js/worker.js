importScripts('/js/q.js', '/js/js-TA.js', '/js/stock-data.js');

var http = {
  get: function(url) {
    var defer = Q.defer();
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          defer.resolve(request.responseText);
        } else {
          defer.reject(request.status);
        }
      }
    };
    request.open("GET", url, true);
    request.send(null);
    return defer.promise;
  }
};

