importScripts('/js/q.js', '/js/js-TA.js', '/js/stock-data.js');

const httpGet = function(url) {
  const defer = Q.defer();
  const request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        defer.resolve(request.responseText);
      } else {
        defer.reject(request.status);
      }
    }
  };
  request.open("GET", url , true);
  request.send(null);
  return defer.promise;
};

const postData = function(data) {
  postMessage(data);
  return data;
};

const log = function(obj){
  console.log(obj);
  return obj;
};

onmessage = function(event) {
  if(event.data) {
    httpGet('/history/'+event.data)
      .then(StockData.parse)
      .then(StockData.addSmavg)
      .then(StockData.addEmavg)
      .then(StockData.addLinearReg)
  //  .then(log)
      .then(postData)
      .catch(function (status) {
        console.log('Errored with status ' + status);
      });
  }
};