package com.joescii.rjs.rest

import net.liftweb.http.rest.RestHelper
import net.liftweb.http.{LiftResponse, ServiceUnavailableResponse, PlainTextResponse, LiftRules}
import dispatch._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.concurrent.Await
import net.liftweb.common.Full

object RestfulServices extends RestHelper {
  def init() {
    LiftRules.statelessDispatch.append(RestfulServices)
  }

  def response(params:String, success: String => String = {s => s} ) = {
    val f:Future[LiftResponse] = Http(url(s"http://download.finance.yahoo.com/d/quotes.csv?$params").GET OK as.String).either.map(_ match {
      case Right(quote) => PlainTextResponse(success(quote))
      case Left(err) => err.printStackTrace(); ServiceUnavailableResponse(1000)
    })

    val b = Full(Await.result(f, 5.seconds))
    b
  }

  def convert(quote:String, amount:String):String = {
    val rate = quote.trim.toFloat
    val amt = amount.trim.toFloat
    (rate * amt).toString
  }

  serve {
    case "quote" :: symbol :: Nil Get _ => response(s"s=$symbol&f=l1" )
    case "exchange" :: currency :: Nil Get _ => response(s"s=USD$currency=X&f=l1" )
    case "convert" :: currency :: amount :: Nil Get _ => response(s"s=USD$currency=X&f=l1", quote => convert(quote, amount) )
  }
}
