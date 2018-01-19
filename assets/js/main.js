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
      if ( nav.className == "nav icon-nav-open" ) {
        nav.className = "nav icon-nav-close"
      } else {
        nav.className = "nav icon-nav-open"
      }
      e.preventDefault()
    }, false)
}
