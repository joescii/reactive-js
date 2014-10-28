(function (document, window) {
  'use strict';

  document.getElementById("slide-back").addEventListener('click', function(event){
    window.impress().prev();
  });
})(document, window);
