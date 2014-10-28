package com.joescii.rjs.comet

import net.liftweb.actor._
import net.liftweb.http._
import js._
import JsCmds._
import JE._

import scala.xml.NodeSeq

object Presentation extends LiftActor with ListenerManager {
  var currentStep:String = "title"

  def createUpdate = currentStep

  override def lowPriority = {
    case id:String => currentStep = id; updateListeners()
  }
}

class PresentationComet extends CometActor with CometListener {
  override def render = NodeSeq.Empty
  override def registerWith = Presentation

  override def lowPriority = {
    case id:String => partialUpdate(
      Call("window.Presentation.goto", id)
    )
  }
}