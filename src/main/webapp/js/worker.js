importScripts('/js/q.js');

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

const parse = function(csv) {
  const lines = csv.split(/\n/);
  const objs = [];
  for(var i = 1; i < lines.length; i++){
    const arr = lines[i].split(/,/);
    const obj = {
      date: arr[0],
      open: arr[1],
      high: arr[2],
      low:  arr[3],
      close: arr[4],
      volume: arr[5],
      adjClose: arr[6]
    };
    objs.push(obj);
  }
  return objs;
};

const log = function(obj){
  console.log(obj);
};

httpGet('/history/AAPL')
  .then(parse)
  .then(log)
  .catch(function(status){
    console.log('Errored with status '+status);
  });