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
