#!/usr/bin/jjs

//load('require.js');

load('env.nashorn.1.2.js');

var httpGet = function (url, success, fail) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        success(request.responseText);
      } else {
        if(fail != null) fail(request.status);
      }
    }
  };
  request.open("GET", url , true);
  request.send(null);
};

var success = function(quote) {
  print(quote);
};

httpGet("http://finance.yahoo.com/d/quotes.csv?s=ADTN&f=l1", success);