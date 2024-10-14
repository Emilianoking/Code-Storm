document.addEventListener('DOMContentLoaded', function () {
    var modeSwitch = document.querySelector('.mode-switch');
    modeSwitch.addEventListener('click', function () {
        document.documentElement.classList.toggle('dark');
        modeSwitch.classList.toggle('active');
    });
    var listView = document.querySelector('.list-view');
    var gridView = document.querySelector('.grid-view');
    var projectsList = document.querySelector('.project-boxes');
    listView.addEventListener('click', function () {
        gridView.classList.remove('active');
        listView.classList.add('active');
        projectsList.classList.remove('jsGridView');
        projectsList.classList.add('jsListView');
    });
    gridView.addEventListener('click', function () {
        gridView.classList.add('active');
        listView.classList.remove('active');
        projectsList.classList.remove('jsListView');
        projectsList.classList.add('jsGridView');
    });
    document.querySelector('.messages-btn').addEventListener('click', function () {
        document.querySelector('.messages-section').classList.add('show');
    });
    document.querySelector('.messages-close').addEventListener('click', function () {
        document.querySelector('.messages-section').classList.remove('show');
    });
});            

/* hora local */
const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Bogota' };
const currentDate = new Intl.DateTimeFormat('es-CO', options).format(new Date());
document.getElementById('current-date').textContent = currentDate;


// Mapa
// contraseña api mapa (6XWBg7$mhdH2Z_V)
// ID org85094137.
// calve api MD2rVWWIAbKQsDym4z0z9lNF0EECPkFvATkWSjJVhvA
// identificardor de la api kHjZGaXjSXiTYJOVQK9E

//contraseña del clima: 981b94264e5a54fe9a8ab90332271550
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el mapa
    var map = L.map('map').setView([4.1433, -73.6376], 13); // Coordenadas de Villavicencio

    // Capa de mapas de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Marcador
    L.marker([4.1433, -73.6376]).addTo(map)
        .bindPopup('Un marcador en Villavicencio, Meta!')
        .openPopup();

    // Añadir capa de tráfico de HERE Maps
    var apiKey = 'MD2rVWWIAbKQsDym4z0z9lNF0EECPkFvATkWSjJVhvA';
    var trafficLayer = L.tileLayer(`https://traffic.ls.hereapi.com/traffic/6.2/flowtile/{z}/{x}/{y}/256/png8?apiKey=${apiKey}&ppi=72`, {
        attribution: 'Datos de tráfico proporcionados por <a href="https://here.com">HERE</a>',
        maxZoom: 19
    });
    trafficLayer.addTo(map);

    // Llamada a la API del clima de OpenWeather
    var weatherApiKey = '981b94264e5a54fe9a8ab90332271550'; 
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=4.1433&lon=-73.6376&units=metric&appid=${weatherApiKey}&lang=es`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Guardar los datos del clima para usarlos en el switch
            var weatherData = {
                description: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
                temp: data.main.temp,
                humidity: data.main.humidity,
                wind: data.wind.speed
            };

            // Añadir evento change al switch
            document.getElementById('weather-switch').addEventListener('change', function() {
                var weatherWidget = document.getElementById('weather');
                // Mostrar u ocultar el contenedor del clima según el estado del switch
                weatherWidget.style.display = this.checked ? 'block' : 'none';

                // Actualizar el contenido del clima solo cuando se muestra
                if (this.checked) {
                    document.getElementById('description').textContent = weatherData.description;
                    document.getElementById('temp').textContent = weatherData.temp;
                    document.getElementById('humidity').textContent = weatherData.humidity;
                    document.getElementById('wind').textContent = weatherData.wind;
                }

                // Mover el sol y la nube según el estado del interruptor
                var sun = document.querySelector('.sun');
                var cloud = document.querySelector('.cloud');

                if (this.checked) {
                    sun.style.opacity = '1'; 
                    sun.style.visibility = 'visible'; 
                    cloud.style.opacity = '0'; 
                    cloud.style.visibility = 'hidden'; 
                } else {
                    sun.style.opacity = '0'; 
                    sun.style.visibility = 'hidden'; 
                    cloud.style.opacity = '1'; 
                    cloud.style.visibility = 'visible';
                }
            });
        })
        .catch(error => {
            console.error(error);
            document.getElementById('description').textContent = 'Error al obtener el clima';
        });
});




// Barra de busqueda
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
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
