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

  serve {
    case "quote" :: symbol :: Nil Get _ => {
      val f:Future[LiftResponse] = Http(url("http://download.finance.yahoo.com/d/quotes.csv?s=MENT&f=l1").GET OK as.String).either.map(_ match {
        case Right(quote) => PlainTextResponse(quote, List(), 200)
        case Left(err) => err.printStackTrace(); ServiceUnavailableResponse(1000)
      })

//      Http(url("http://download.finance.yahoo.com/d/quotes.csv?s=MENT&f=l1").GET).map(res =>
//        println(res.getHeaders)
//      )

      val b = Full(Await.result(f, 5.seconds))
//      val b = Full(ServiceUnavailableResponse(1000))
      b
    }
  }
}
