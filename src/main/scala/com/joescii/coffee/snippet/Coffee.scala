package com.joescii.coffee.snippet

import scala.xml.{ Text => T }
import net.liftweb.http.{LiftRules, S}

object Coffee {
  def render = {
    val srcBox = for {
      name <- S.param("src")
      code <- LiftRules.loadResourceAsString(s"/coffee/$name.coffee")
    } yield { code }

    T(srcBox.openOr("Coffee not found!"))
  }
}
