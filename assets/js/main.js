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

  bannerInit()

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
    if (document.querySelector('#form-busqueda')) {
      updateSerachForm()
    }
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

  let divPrecio = document.querySelector("#form-precio")
  while (divPrecio.firstChild) {
    divPrecio.removeChild(divPrecio.firstChild);
  }

  let label = document.createElement("label")
  label.setAttribute("for","#form-price-slider")
  divPrecio.appendChild(label)

  let pisos = JSON.parse(sessionStorage.getItem("pisos"))
  let tipo = document.querySelector('#form-tipo input:checked').value
  let prices = [];
  let pisosFilter = pisos.filter((item) => item.status.toLowerCase() == tipo )

  for (p in pisosFilter) { prices.push(pisosFilter[p].precio) }
  prices.sort((a,b) => a - b)
  let minPrice = prices[0]
  let maxPrice = prices[prices.length - 1]

  let input = document.createElement("input")
  input.setAttribute("id","form-price-slider")
  input.setAttribute("type","range")
  input.setAttribute("name", "price")
  input.setAttribute("min",0)
  input.setAttribute("min", minPrice)
  input.setAttribute("max", maxPrice)
  input.setAttribute("value", minPrice)
  input.setAttribute("oninput","updateFormPriceValue(value)")
  divPrecio.appendChild(input)

  let output = document.createElement("output")
  output.setAttribute("for", "#form-price-slider")
  output.setAttribute("id", "form-price-output")
  divPrecio.appendChild(output)

  updateFormPriceValue(minPrice)
}

function updateFormPriceValue(vol) {
  let tipo = document.querySelector('#form-tipo input:checked').value
  let unidad = (tipo == 'venta') ? ' €' : ' €/mes'
	document.querySelector('#form-price-output').value = Number(vol).toLocaleString('es-ES', {minimumFractionDigits: 0}) + unidad
}

function bannerInit() {
  var banner = document.querySelector('.frontpage article header h1')
  var bannerNumImages = window.getComputedStyle(banner).backgroundImage.split(',').length
  var bannerCurrentImage = 0
  var bannerNextImage = 1
  var bannerSteps = ['-100vw 0', '-100vw -150vh', '100vw -150vh', '100vw 0']
  var bannerBgPosition = []

  for (let i = 0; i < bannerNumImages; i++) {
    if (i != bannerCurrentImage) {
      bannerBgPosition[i] = bannerSteps[3]
    }
  }
  bannerBgPosition[0] = '0'
  banner.style.backgroundPosition = bannerBgPosition.join(',')

  var timer = setInterval(() => {
    for (let i = 0; i < bannerSteps.length; i++) {
      bannerBgPosition[bannerCurrentImage] = bannerSteps[i]
      bannerBgPosition[bannerNextImage] = '0'
      banner.style.transition = '0.8s ease-in'
      banner.style.backgroundPosition = bannerBgPosition.join(',')
    }
    bannerCurrentImage++
    bannerNextImage++
    if (bannerCurrentImage > bannerNumImages - 1) {
      bannerCurrentImage = 0
    }
    if (bannerNextImage > bannerNumImages - 1) {
      bannerNextImage = 0
    }
  }, 5000)
}
