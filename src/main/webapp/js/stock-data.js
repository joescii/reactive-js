var StockData = {
  parse: function(csv) {
    var lines = csv.split(/\n/);
    var data = [];
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
  },

  addCalculation: function(data, calc, label) {
    var values = data.data.map(function(datum) { return datum[1] });
    var calculated = calc(values);
    var dataArr = [];
    for(var i = 0; i < data.data.length; i++) {
      dataArr.push(data.data[i].concat(calculated[i]))
    }
    return {
      data: dataArr,
      labels: data.labels.concat(label)
    }
  },

  addSmavg: function(data) {
    var fn = function(values) { return TA.SMAverage(values, 100) };
    return StockData.addCalculation(data, fn, "SMA")
  },

  addEmavg: function(data) {
    var fn = function(values) { return TA.EMAverage(values, 100) };
    return StockData.addCalculation(data, fn, "EMA")
  },

  addLinearReg: function(data) {
    var fn = function(values) { return TA.LinearReg(values, 20) };
    return StockData.addCalculation(data, fn, "LinearReg");
  }

};