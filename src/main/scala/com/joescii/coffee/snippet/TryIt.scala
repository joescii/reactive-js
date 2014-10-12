package com.joescii.coffee.snippet

import net.liftweb.http.S
import net.liftweb.common.Full

object TryIt {
  def render = S.param("bare") match {
    case Full("false") => <script type="text/javascript" src="js/try-it-no-bare.js"></script>
    case _ =>             <script type="text/javascript" src="js/try-it.js"></script>
  }
}
