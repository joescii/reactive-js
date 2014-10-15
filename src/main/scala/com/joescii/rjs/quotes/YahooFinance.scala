package com.joescii.rjs.quotes

import dispatch._
import scala.concurrent.ExecutionContext.Implicits.global

object YahooFinance {
  private def get(params:String) = Http(url(s"http://download.finance.yahoo.com/d/quotes.csv?$params").GET OK as.String)

  def stock(symbol:String) = get(s"s=$symbol&f=l1")
  def exchange(currency:String) = get(s"s=USD$currency=X&f=l1")
}
