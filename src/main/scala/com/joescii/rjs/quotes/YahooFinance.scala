package com.joescii.rjs
package quotes

import dispatch._
import scala.concurrent.ExecutionContext.Implicits.global
import net.liftweb.json.{JsonParser, DefaultFormats}
import java.util.{GregorianCalendar, Calendar}

object YahooFinance {
  private def get(params:String) = Http(url(s"http://download.finance.yahoo.com/d/quotes.csv?$params").GET OK as.String)

  def stock(symbol:String) = get(s"s=$symbol&f=l1")
  def exchange(currency:String) = get(s"s=USD$currency=X&f=l1")
  def suggest(query:String) =
    Http(url(s"http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=$query&callback=YAHOO.Finance.SymbolSuggest.ssCallback").GET OK as.String).map { res =>
      // This stuff needs to be stripped from the response
      val regex = """\QYAHOO.Finance.SymbolSuggest.ssCallback(\E(.*)\)""".r
      val regex(json) = res
      implicit val formats = DefaultFormats
      val parsed = JsonParser parse json
      parsed \\ "ResultSet" \\ "Result"
    }
  def history(symbol:String) = {
    val today = new GregorianCalendar()
    val month = today.get(Calendar.MONTH)
    val day = today.get(Calendar.DAY_OF_MONTH)
    val toYear = today.get(Calendar.YEAR)
    val fromYear = toYear - 10

    Http(url(s"http://ichart.finance.yahoo.com/table.csv?s=$symbol&d=$month&e=$day&f=$toYear&g=d&a=$month&b=$day&c=$fromYear&ignore=.csv").GET OK as.String)

  }
}
