package com.joescii.rjs.snippet

import net.liftweb.http._
import js._
import JsCmds._
import JE._
import net.liftweb.util.Helpers._
import net.liftweb.util.ClearNodes

/**
 * Created by jbarnes on 10/27/2014.
 */
object Presenter {
  def render = if(Host.isLocal) "*" #> Script(
    JsCrVar("PresenterApi", JsObj()) &
    SetExp(JsVar("PresenterApi.goto"), AnonFunc("id", SHtml.ajaxCall(JsVar("id"), {(id:String) =>
      println(s"goto($id)")
      Call("console.log", id)
    })))
  ) else ClearNodes
}
