// Is this browser sufficiently modern to continue?
if ( !( "querySelector" in document && "addEventListener" in window && "getComputedStyle" in window) ) {
  () => {return}
}

window.document.documentElement.className += " enhanced"

var nav = document.querySelector( ".nav ul" ),
    navToggle = document.querySelector( ".nav .skip" )

if ( navToggle ) {
  navToggle.addEventListener( "click",
    function( e ) {
      if ( nav.className == "open" ) {
        nav.className = ""
      } else {
        nav.className = "open"
      }
      e.preventDefault()
    }, false)
}
