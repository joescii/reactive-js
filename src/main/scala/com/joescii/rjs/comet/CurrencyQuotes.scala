package com.joescii.rjs
package comet

import quotes.YahooFinance._

import net.liftmodules.ng._
import net.liftweb.util.Schedule
import net.liftweb.util.Helpers._
import scala.concurrent.ExecutionContext.Implicits.global

class CurrencyQuotes extends AngularActor {
  override def lowPriority = {
    case (currency:String, quote:String) => {
      println(s"Quote: $currency == $quote")
      scope.emit(currency, quote)
    }
  }

  def schedule:Unit = Schedule(() => {
    exchange("EUR").foreach { quote =>
      this ! ("EUR", quote)
    }
    schedule
  }, 5.seconds)

  schedule
}
