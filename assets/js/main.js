// Is this browser sufficiently modern to continue?
if ( !( "querySelector" in document && "addEventListener" in window && "getComputedStyle" in window) ) {
  return;
}
window.document.documentElement.className += " enhanced";
