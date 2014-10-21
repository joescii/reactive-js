package com.joescii.rjs
package rest

import quotes.YahooFinance._

import net.liftweb.http.rest.RestHelper
import net.liftweb.http._
import dispatch._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.concurrent.Await
import net.liftweb.json.JsonAST.JValue
import net.liftweb.http.ServiceUnavailableResponse
import net.liftweb.common.Full

object RestfulServices extends RestHelper {
  def init() {
    LiftRules.statelessDispatch.append(RestfulServices)
  }

  def stringResponse(req:dispatch.Future[String], success: String => String = {s => s} ) =
    response(req, (res:String) => PlainTextResponse(success(res)))

  def jsonResponse(req:dispatch.Future[JValue], success: JValue => JValue = {v => v} ) =
    response(req, (res:JValue) => JsonResponse(success(res)))

  def response[T](req:dispatch.Future[T], success: T => LiftResponse ) = {
    val f:Future[LiftResponse] = req.either.map(_ match {
      case Right(res) => success(res)
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
    case "quote" :: symbol :: Nil Get _ => stringResponse(stock(symbol))
    case "exchange" :: currency :: Nil Get _ => stringResponse(exchange(currency))
    case "convert" :: currency :: amount :: Nil Get _ => stringResponse(exchange(currency), quote => convert(quote, amount) )
    case "suggest" :: query :: Nil Get _ => jsonResponse(suggest(query))
    case "history" :: symbol :: Nil Get _ => stringResponse(history(symbol))
  }
}
