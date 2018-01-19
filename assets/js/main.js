// Is this browser sufficiently modern to continue?
if ( !( "querySelector" in document && "addEventListener" in window && "getComputedStyle" in window) ) {
  () => {return}
}

window.document.documentElement.className += " enhanced"

var nav = document.querySelector( ".nav ul" ),
    navToggle = document.querySelector( ".nav a[href='#menu']" )

if ( navToggle ) {
  navToggle.addEventListener( "click",
    function( e ) {
      if ( nav.className == "icon-nav-open" ) {
        nav.className = "icon-nav-close"
      } else {
        nav.className = "icon-nav-open"
      }
      e.preventDefault()
    }, false)
}
