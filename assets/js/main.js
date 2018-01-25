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

  let sitetime = document.querySelector('body').getAttribute("data-sitetime")

  if (!sessionStorage.getItem("sitetime")) {
    sessionStorage.setItem("sitetime", sitetime)
    loadApi("/api/inmuebles.json")
    console.log("no sitetime")
  }

  if (sessionStorage.getItem("sitetime") !== sitetime) {
    sessionStorage.setItem("sitetime", sitetime)
    loadApi("/api/inmuebles.json")
    console.log("sitetime diferentes")
  }

  if (!sessionStorage.hasOwnProperty("pisos")) {
    sessionStorage.setItem("sitetime", sitetime)
    loadApi("/api/inmuebles.json")
    console.log("no pisos")
  }

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

function loadApi(file) {
  loadJSON(file, function(response) {
    sessionStorage.setItem("pisos", JSON.stringify(JSON.parse(response)))
    updateSerachForm()
  })
}

function updateSerachForm() {
  var pisos = JSON.parse(sessionStorage.getItem("pisos"))
  let ventasSpan = document.querySelector("label[for='form-venta'] span")
  ventasSpan.innerHTML = "(" + pisos.filter((piso) => piso.status === 'Venta').lenght +")"
  let alquilerSpan = document.querySelector("label[for='form-alquiler'] span")
  alquilerSpan.innerHTML = "(" + pisos.filter((piso) => piso.status === 'Alquiler').lenght +")"
}
