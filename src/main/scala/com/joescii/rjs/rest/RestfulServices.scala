package com.joescii.rjs
package rest

import quotes.YahooFinance._

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

  def response(req:dispatch.Future[String], success: String => String = {s => s} ) = {
    val f:Future[LiftResponse] = req.either.map(_ match {
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
    case "quote" :: symbol :: Nil Get _ => response(stock(symbol))
    case "exchange" :: currency :: Nil Get _ => response(exchange(currency))
    case "convert" :: currency :: amount :: Nil Get _ => response(exchange(currency), quote => convert(quote, amount) )
  }
}
