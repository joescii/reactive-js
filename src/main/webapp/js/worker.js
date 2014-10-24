importScripts('/js/q.js', '/js/js-TA.js');

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
  const data = [];
  for(var i = lines.length-2; i > 0; i--){
    var arr = lines[i].split(/,/);
    var datum = [
      new Date(arr[0]), // date:
//      parseFloat(arr[1]), // open:
//      parseFloat(arr[2]), // high:
//      parseFloat(arr[3]), // low:
      parseFloat(arr[4]) // close:
//      parseFloat(arr[5]), // volume:
//      parseFloat(arr[6]) // adjClose:
    ];
    data.push(datum);
  }
  return {
    data: data,
    labels: ["Date", "Price"]
  };
};

const addCalculation = function(data, calc, label) {
  const values = data.data.map(function(datum) { return datum[1] });
  const calculated = calc(values);
  const dataArr = [];
  for(var i = 0; i < data.data.length; i++) {
    dataArr.push(data.data[i].concat(calculated[i]))
  }
  return {
    data: dataArr,
    labels: data.labels.concat(label)
  }
};

const addSmavg = function(data) {
  const fn = function(values) { return TA.SMAverage(values, 100) };
  return addCalculation(data, fn, "SMA")
};

const addEmavg = function(data) {
  const fn = function(values) { return TA.EMAverage(values, 100) };
  return addCalculation(data, fn, "EMA")
};

const addLinearReg = function(data) {
  const fn = function(values) { return TA.LinearReg(values, 20) };
  return addCalculation(data, fn, "LinearReg");
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
      .then(parse)
      .then(addSmavg)
      .then(addEmavg)
      .then(addLinearReg)
  //  .then(log)
      .then(postData)
      .catch(function (status) {
        console.log('Errored with status ' + status);
      });
  }
};