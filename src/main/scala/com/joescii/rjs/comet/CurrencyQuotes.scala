package com.joescii.rjs
package comet

import quotes.YahooFinance._

import net.liftmodules.ng._
import net.liftweb.util.Schedule
import net.liftweb.util.Helpers._
import scala.concurrent.ExecutionContext.Implicits.global
import java.util.Date

case class CurrencyQuote(currency:String, quote:String)

class CurrencyQuotes extends AngularActor {
  val currencies =
    "CLP" ::
    "CNY" ::
    "CRC" ::
    "CUP" ::
    "EUR" ::
    "GBP" ::
    "INR" ::
    "ILS" ::
    "IRR" ::
    "KGS" ::
    "KRW" ::
    "LAK" ::
    "MNT" ::
    "UAH" ::
    "VND" ::
      Nil

  override def lowPriority = {
    case q:CurrencyQuote => scope.emit("CurrencyQuote", q)
    case t:Date => scope.emit("CurrentTime", t.toString)
  }

  def schedule:Unit = Schedule(() => {
    currencies.foreach( currency =>
      exchange(currency).foreach( quote => this ! CurrencyQuote(currency, quote) )
    )
    this ! new Date()
    schedule
  }, 500 millis)

  schedule
}
