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
  }

  if (sessionStorage.getItem("sitetime") !== sitetime) {
    sessionStorage.setItem("sitetime", sitetime)
    loadApi("/api/inmuebles.json")
  }

  if (!sessionStorage.hasOwnProperty("pisos")) {
    sessionStorage.setItem("sitetime", sitetime)
    loadApi("/api/inmuebles.json")
  }

  if (document.querySelector('#form-busqueda')) {
    updateSerachForm()
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

  let pisos = JSON.parse(sessionStorage.getItem("pisos"))

  let ventasSpan = document.querySelector("label[for='form-venta'] span")
  ventasSpan.innerHTML = "(" + pisos.filter((piso) => piso.status === 'Venta').length +")"

  let alquilerSpan = document.querySelector("label[for='form-alquiler'] span")
  alquilerSpan.innerHTML = "(" + pisos.filter((piso) => piso.status === 'Alquiler').length +")"

  let citiesList = document.querySelector("#form-cities")
  while (citiesList.firstChild) {
    citiesList.removeChild(citiesList.firstChild);
  }
  let cities = []
  for (p in pisos) { cities.push(pisos[p].city) }
  let citiesUniq = cities.filter( onlyUnique )
  citiesUniq.sort()
  for (c in citiesUniq) {
    let op = document.createElement("option")
    op.value = citiesUniq[c]
    citiesList.appendChild(op)
  }

  updateFormPrice()

}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function updateFormPrice() {

  let pisos = JSON.parse(sessionStorage.getItem("pisos"))
  let tipo = document.querySelector('#form-tipo input:checked').value
  let prices = [];
  let pisosFilter = pisos.filter((item) => item.status.toLowerCase() == tipo )

  for (p in pisosFilter) { prices.push(pisosFilter[p].precio) }
  prices.sort((a,b) => a - b)
  let minPrice = prices[0]
  let maxPrice = prices[prices.length - 1]
  let price = document.querySelector('#form-price')
  price.setAttribute("min", minPrice)
  price.setAttribute("max", maxPrice)
  price.setAttribute("value", maxPrice)
  updateFormPriceValue(maxPrice)
}

function updateFormPriceValue(vol) {
	document.querySelector('#form-price-output').value = vol;
}
