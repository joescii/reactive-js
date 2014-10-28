(function (document, window, $) {
  'use strict';

  // Presentation state from the server
  var presentation = {};

  // The presenter's current slide
  presentation.current = 'title';

  // The current slide locally (can be different if paused, etc)
  presentation.local = presentation.current;

  // The state of our pause button
  presentation.isPaused = false;

  // Called by server to go to a given slide
  presentation.goto = function(id) {
    presentation.current = id;
    if(!presentation.isPaused) {
      window.impress().goto(id);
      presentation.local = id;
    }
  };

  // Pauses the presentation
  presentation.togglePause = function() {
    if(presentation.isPaused) {
      presentation.local = presentation.current;
      window.impress().goto(presentation.current);
    }

    presentation.isPaused = !presentation.isPaused;
    $("#slide-play-pause").toggleClass("pause");
    $("#slide-play-pause").toggleClass("play");
  };

  document.getElementById("slide-play-pause").addEventListener('click', function(event){
    presentation.togglePause();
  });

  window.Presentation = presentation;

})(document, window, jQuery);
