package com.joescii.rjs.snippet

import scala.xml.{ Text => T }
import net.liftweb.http.{LiftRules, S}

object JavaScript {
  def render = {
    val srcBox = for {
      name <- S.param("src")
      code <- LiftRules.loadResourceAsString(s"/js/$name.js")
    } yield { code }

    T(srcBox.openOr("JS not found!"))
  }
}
