document.addEventListener("DOMContentLoaded", function(event) {
  // Is this browser sufficiently modern to continue?
  if ( !( "querySelector" in document && "addEventListener" in window && "getComputedStyle" in window) ) {
    () => {return}
  }

  window.document.documentElement.className += " enhanced"

  var nav = document.querySelector( "#nav" ),
      navToggle = document.querySelector( ".nav a[href='#menu']" )

  if ( navToggle ) {
    navToggle.addEventListener( "click",
      function( e ) {
        if ( nav.className == "nav is-open" ) {
          nav.className = "nav"
        } else {
          nav.className = "nav is-open"
        }
        e.preventDefault()
      }, false)
  }

  load()

});

function loadJSON(file, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
 }

function load() {
  loadJSON("/api/inmuebles.json", function(response) {
    localSession.setItem("pisos", JSON.stringify(response))
  });
}
