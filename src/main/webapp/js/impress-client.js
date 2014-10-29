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

  var indexOfSlide = function(id) { return window.impress().ids.indexOf(id) };

  // Called by server to go to a given slide
  presentation.goto = function(id) {
    presentation.current = id;
    if(!presentation.isPaused) {
      presentation.local = id;
    }
    presentation.updateWidgets();
  };

  // Pauses the presentation
  presentation.togglePause = function(pauseIt) {
    var newState;
    if(typeof pauseIt !== 'boolean')
      newState = !presentation.isPaused;
    else
      newState = pauseIt;

    if(!newState) { // un-pausing
      presentation.local = presentation.current;
    }

    presentation.isPaused = newState;
  };

  // Goes back one slide
  presentation.toggleBack = function() {
    presentation.togglePause(true);
    var index = indexOfSlide(presentation.local) - 1;
    presentation.local = window.impress().ids[index];
  };

  // Goes forward one slide
  presentation.toggleForward = function() {
    var index = indexOfSlide(presentation.local) + 1;
    presentation.local = window.impress().ids[index];
  };

  document.getElementById("slide-play-pause").addEventListener('click', function(event){
    presentation.togglePause();
    presentation.updateWidgets();
  });
  document.getElementById("slide-back").addEventListener('click', function(event){
    presentation.toggleBack();
    presentation.updateWidgets();
  });
  document.getElementById("slide-forward").addEventListener('click', function(event){
    presentation.toggleForward();
    presentation.updateWidgets();
  });

  // Updates the widgets to match the state of presentation and impress model data
  presentation.updateWidgets = function() {
    if(presentation.isPaused) {
      $("#slide-play-pause").removeClass("pause");
      $("#slide-play-pause").addClass("play");
    } else {
      $("#slide-play-pause").addClass("pause");
      $("#slide-play-pause").removeClass("play");
    }

    if(indexOfSlide(presentation.local) === 0) {
      $("#slide-back").removeClass("enabled");
    } else {
      $("#slide-back").addClass("enabled");
    }

    if(presentation.local === presentation.current) {
      $("#slide-forward").removeClass("enabled");
    } else {
      $("#slide-forward").addClass("enabled");
    }

    window.impress().goto(presentation.local);
  };

  window.Presentation = presentation;

})(document, window, jQuery);
