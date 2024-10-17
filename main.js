document.addEventListener("DOMContentLoaded", function () {
  var modeSwitch = document.querySelector(".mode-switch");
  modeSwitch.addEventListener("click", function () {
    document.documentElement.classList.toggle("dark");
    modeSwitch.classList.toggle("active");
  });
  var listView = document.querySelector(".list-view");
  var gridView = document.querySelector(".grid-view");
  var projectsList = document.querySelector(".project-boxes");
  listView.addEventListener("click", function () {
    gridView.classList.remove("active");
    listView.classList.add("active");
    projectsList.classList.remove("jsGridView");
    projectsList.classList.add("jsListView");
  });
  gridView.addEventListener("click", function () {
    gridView.classList.add("active");
    listView.classList.remove("active");
    projectsList.classList.remove("jsListView");
    projectsList.classList.add("jsGridView");
  });
  document
    .querySelector(".messages-btn")
    .addEventListener("click", function () {
      document.querySelector(".messages-section").classList.add("show");
    });
  document
    .querySelector(".messages-close")
    .addEventListener("click", function () {
      document.querySelector(".messages-section").classList.remove("show");
    });
});

// Mapa
// contraseña api mapa (6XWBg7$mhdH2Z_V)
// ID org85094137.
// calve api MD2rVWWIAbKQsDym4z0z9lNF0EECPkFvATkWSjJVhvA
// identificardor de la api kHjZGaXjSXiTYJOVQK9E

//contraseña del clima: 981b94264e5a54fe9a8ab90332271550

document.addEventListener("DOMContentLoaded", function () {
  // Inicializar el mapa
  var map = L.map("map").setView([4.1433, -73.6376], 13); // Coordenadas de Villavicencio

  // Capa de mapas de OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  // Marcador
  L.marker([4.1433, -73.6376])
    .addTo(map)
    .bindPopup("Un marcador en Villavicencio, Meta!")
    .openPopup();

  // Añadir capa de tráfico de HERE Maps
  var apiKey = "MD2rVWWIAbKQsDym4z0z9lNF0EECPkFvATkWSjJVhvA";
  var trafficLayer = L.tileLayer(
    `https://traffic.ls.hereapi.com/traffic/6.2/flowtile/{z}/{x}/{y}/256/png8?apiKey=${apiKey}&ppi=72`,
    {
      attribution:
        'Datos de tráfico proporcionados por <a href="https://here.com">HERE</a>',
      maxZoom: 19,
    }
  );
  trafficLayer.addTo(map);

  // Llamada a la API del clima de OpenWeather
  var weatherApiKey = "981b94264e5a54fe9a8ab90332271550";
  var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=4.1433&lon=-73.6376&units=metric&appid=${weatherApiKey}&lang=es`;

  fetch(weatherUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      // Guardar los datos del clima para usarlos en el switch
      var weatherData = {
        description:
          data.weather[0].description.charAt(0).toUpperCase() +
          data.weather[0].description.slice(1),
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      };

      // Añadir evento change al switch
      document
        .getElementById("weather-switch")
        .addEventListener("change", function () {
          var weatherWidget = document.getElementById("weather");
          // Mostrar u ocultar el contenedor del clima según el estado del switch
          weatherWidget.style.display = this.checked ? "block" : "none";

          // Actualizar el contenido del clima solo cuando se muestra
          if (this.checked) {
            document.getElementById("description").textContent =
              weatherData.description;
            document.getElementById("temp").textContent = weatherData.temp;
            document.getElementById("humidity").textContent =
              weatherData.humidity;
            document.getElementById("wind").textContent = weatherData.wind;
          }

          // Mover el sol y la nube según el estado del interruptor
          var sun = document.querySelector(".sun");
          var cloud = document.querySelector(".cloud");

          if (this.checked) {
            sun.style.opacity = "1";
            sun.style.visibility = "visible";
            cloud.style.opacity = "0";
            cloud.style.visibility = "hidden";
          } else {
            sun.style.opacity = "0";
            sun.style.visibility = "hidden";
            cloud.style.opacity = "1";
            cloud.style.visibility = "visible";
          }
        });
    })
    .catch((error) => {
      console.error(error);
      document.getElementById("description").textContent =
        "Error al obtener el clima";
    });

document.addEventListener('DOMContentLoaded', function () {
    // Inicializar HERE Platform
    var platform = new H.service.Platform({
        apikey: 'MD2rVWWIAbKQsDym4z0z9lNF0EECPkFvATkWSjJVhvA'
    });
    var defaultLayers = platform.createDefaultLayers();

    // Crear mapa y centrarlo en Villavicencio
    var map = new H.Map(
        document.getElementById('map'),
        defaultLayers.vector.normal.map,
        {
            center: {lat: 4.1433, lng: -73.6376},
            zoom: 13,
            pixelRatio: window.devicePixelRatio || 1
        }
    );
    window.addEventListener('resize', () => map.getViewPort().resize());

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    // Cargar capa de tráfico
    var trafficLayer = platform.getMapTileService({ type: 'traffic' });
    trafficLayer = trafficLayer.createTileLayer('flow');
    map.addLayer(trafficLayer);

    // Función para calcular la ruta entre dos puntos
    function calculateRouteFromAtoB() {
        var router = platform.getRoutingService(null, 8);
        var routeRequestParams = {
            routingMode: 'fast',
            transportMode: 'pedestrian',
            origin: '4.1533,-73.6376',
            destination: '4.1355,-73.6299',
            return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
        };

        router.calculateRoute(routeRequestParams, onSuccess, onError);
    }

    function onSuccess(result) {
        var route = result.routes[0];
        addRouteShapeToMap(route);
        addManueversToMap(route);
    }

    function onError(error) {
        alert('No se pudo calcular la ruta');
    }

    function addRouteShapeToMap(route) {
        route.sections.forEach((section) => {
            let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
            let polyline = new H.map.Polyline(linestring, {
                style: { strokeColor: 'blue', lineWidth: 5 }
            });
            map.addObject(polyline);
            map.getViewModel().setLookAtData({ bounds: polyline.getBoundingBox() });
        });
    }

    function addManueversToMap(route) {
        var group = new H.map.Group();
        route.sections.forEach((section) => {
            let actions = section.actions;
            actions.forEach((action) => {
                var marker = new H.map.Marker({ lat: action.position.lat, lng: action.position.lng });
                group.addObject(marker);
            });
        });
        map.addObject(group);
    }

    calculateRouteFromAtoB();

    // Obtener datos del clima
    var weatherApiKey = '981b94264e5a54fe9a8ab90332271550'; 
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=4.1433&lon=-73.6376&units=metric&appid=${weatherApiKey}&lang=es`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('description').textContent = data.weather[0].description;
            document.getElementById('temp').textContent = data.main.temp;
            document.getElementById('humidity').textContent = data.main.humidity;
            document.getElementById('wind').textContent = data.wind.speed;
        })
        .catch(error => console.error('Error al obtener el clima:', error));
});

          
// Barra de búsqueda
document.getElementById('search-input').addEventListener('input', function() { 
  const searchValue = this.value.toLowerCase().trim();  
  const projectSection = document.querySelector('.projects-section');  
  const elementsToSearch = projectSection.querySelectorAll('p, h1, h2'); 

  // Variable para guardar la primera coincidencia
  let firstMatch = null;

  elementsToSearch.forEach(element => {
      const originalText = element.textContent; 
      element.innerHTML = originalText; 

      if (searchValue !== '') {
          const regex = new RegExp(`(${searchValue})`, 'gi');  
          const highlightedText = originalText.replace(regex, '<mark>$1</mark>');  
          element.innerHTML = highlightedText; 

          // Comprobar si hay coincidencias
          if (highlightedText.includes('<mark>')) {
              if (!firstMatch) {
                  firstMatch = element; 
              }
          }
      }
  });

  // Mover la vista hacia la primera coincidencia, si existe
  if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});


/* SECCION CALENDARIO */

/*SECCION UTILIZADA PARA LA FECHA ENCIMA DE LAS IMAGENES */

const currentDate = new Date();
const day = String(currentDate.getDate()).padStart(2, "0"); // Asegura que siempre tenga 2 dígitos
const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript van de 0 a 11
const year = currentDate.getFullYear();

// Formato personalizado: dd-mm-yyyy
const formattedDate = `${day}/${month}/${year}`;

document.getElementById("current-date").textContent = formattedDate;

/*SECCION PARA EL CALENDARIO Y BOTONES */
const calendarDays = document.getElementById("calendarDays");
const monthAndYear = document.getElementById("monthAndYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const currentDateDisplay = document.getElementById("current-date2"); // Para mostrar la fecha seleccionada
const placaElement = document.querySelector(".placa"); // Elemento para mostrar la placa
const dayElement = document.getElementById("day"); // Elemento para mostrar el día en letras

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDayElement = null; // Almacena el día seleccionado

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const weekdays = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

// Mapeo de horarios y restricciones de placas
const horarios = {
  Lunes: "9 - 0",
  Martes: "1 - 2",
  Miércoles: "1 - 2",
  Jueves: "1 - 2",
  Viernes: "1 - 2",
  Sábado: "No aplica",
  Domingo: "No aplica",
};

// Función para mostrar el día actual y su horario
function showDayInfo(selectedDate) {
  const dayOfWeek = weekdays[selectedDate.getDay()];
  const day = selectedDate.getDate();
  const month = months[selectedDate.getMonth()];
  const year = selectedDate.getFullYear();

  const formattedDate = ` ${day} de ${month} del ${year}`;
  currentDateDisplay.textContent = formattedDate; // Actualizar la etiqueta con el formato de fecha
  dayElement.textContent = dayOfWeek; // Actualizar el día en letras

  // Actualizar la placa (horario) según el día seleccionado
  placaElement.textContent = horarios[dayOfWeek] || "No aplica";
}

// Función para seleccionar automáticamente el día actual
function selectToday() {
  renderCalendar(currentMonth, currentYear); // Renderizar el calendario actual

  const dayCells = document.querySelectorAll(".calendar-body .days div");
  dayCells.forEach((dayCell) => {
    if (dayCell.textContent == today.getDate()) {
      dayCell.classList.add("selected");
      selectedDayElement = dayCell;
    }
  });

  showDayInfo(today); // Mostrar la información del día actual
}

// Función para renderizar el calendario
function renderCalendar(month, year) {
  const firstDay = new Date(year, month).getDay();
  const daysInMonth = 32 - new Date(year, month, 32).getDate();

  calendarDays.innerHTML = "";
  monthAndYear.textContent = `${months[month]} ${year}`;

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    calendarDays.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.textContent = day;

    // Marcar el día actual
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayCell.classList.add("today");
    }

    // Agregar evento para seleccionar el día
    dayCell.addEventListener("click", function () {
      if (selectedDayElement) {
        selectedDayElement.classList.remove("selected");
      }
      dayCell.classList.add("selected");
      selectedDayElement = dayCell; // Actualizar el día seleccionado

      // Crear una nueva fecha basada en el día seleccionado
      const selectedDate = new Date(year, month, day);
      showDayInfo(selectedDate); // Actualizar la información del día seleccionado
    });

    calendarDays.appendChild(dayCell);
  }
}

prevMonthBtn.addEventListener("click", () => {
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
  renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener("click", () => {
  currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
  renderCalendar(currentMonth, currentYear);
});

// Inicializar el calendario y seleccionar el día actual
renderCalendar(currentMonth, currentYear);
selectToday(); // Llamar a la función para seleccionar el día actual
});
