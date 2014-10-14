
var success = function(quote) {
  print(quote);
};

httpGet("http://finance.yahoo.com/d/quotes.csv?s=MENT&f=l1", success);
