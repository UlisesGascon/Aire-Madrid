/*global ga, google, estaciones*/

// Analytics 
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-65618670-1', 'auto');
ga('send', 'pageview');

// App
(function() {

    // Fecha
    var fecha = new Date();
    
    function agregarCero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    function rectificacionHoraria(i){
        // Agregar Ceros
        if (i < 10 && i > 0) {
            i = "0" + i;
        }
        // Corrección negativa
        if (i === -1){
            i = "23";
        }
            return i;
    }
    
    var timestamp = rectificacionHoraria(fecha.getUTCHours()-1) + ":" + agregarCero(fecha.getUTCMinutes()) + ":" + agregarCero(fecha.getUTCSeconds());
    document.getElementById("timestamp").innerHTML = timestamp;

    // Geolocation
    /**
     * Based on http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula 
     */
    function getDistance(userlat, userlon) {
        var R = 6371;
        for (var i = 0; i < estaciones.length; i++) {

            var dLat = (estaciones[i].latitud_decimal - userlat) * (Math.PI / 180);
            var dLon = (estaciones[i].longitud_decimal - userlon) * (Math.PI / 180);

            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(userlat * (Math.PI / 180)) * Math.cos(estaciones[i].latitud_decimal * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            estaciones[i].distancia = R * c;
        }
    }

    function mapaAlternativo() {
        var puntos = [];
        var infoPuntos = [];

        // Posición Estaciones                          
        for (var i = 0; i < estaciones.length; i++) {
            puntos.push([estaciones[i].nombre_estacion, estaciones[i].longitud_decimal, estaciones[i].latitud_decimal, i]);
            infoPuntos.push(['<div class="info_content">' +
                '<h3>' + estaciones[i].nombre_estacion + '</h3>' +
                '<img src="img/foto-estacion' + estaciones[i].numero_estacion + '.jpg" class="img-info">' +
                '<p>Localización: ' + estaciones[i].direccion +
                '<br>Tipo: ' + estaciones[i].tipo +
                '</div>'
            ]);
        }
            // Ajustes mapa
            var map = new google.maps.Map(document.getElementById('mapa'), {
                zoom: 12,
                center: new google.maps.LatLng(40.418889, -3.691944),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            
            // Markers
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            for (i = 0; i < puntos.length; i++) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(puntos[i][2], puntos[i][1]),
                        map: map,
                        icon: "img/turbine.png"
                    });
                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infowindow.setContent(infoPuntos[i][0]);
                            infowindow.open(map, marker);
                        };
                    })(marker, i));
            }
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {


            getDistance(position.coords.latitude, position.coords.longitude);
            // Estaciones Info
            var puntos = [];
            var infoPuntos = [];
            // Posición usuario
            puntos.push(["usuario", position.coords.longitude, position.coords.latitude, 0]);
            infoPuntos.push(['<div class="info_content">' +
                '<h3>Aqui estás!</h3>' +
                '<p>Precisión: ' + position.coords.accuracy + 'm' +
                '<br>Longitud: ' + position.coords.longitude +
                '<br>Latitud: ' + position.coords.latitude + '</p>' +
                '</div>'
            ]);
            // Posición Cascos                          
            for (var i = 0; i < estaciones.length; i++) {
                puntos.push([estaciones[i].nombre_estacion, estaciones[i].longitud_decimal, estaciones[i].latitud_decimal, i]);
                infoPuntos.push(['<div class="info_content">' +
                    '<h3>' + estaciones[i].nombre_estacion + '</h3>' +
                    '<img src="img/foto-estacion' + estaciones[i].numero_estacion + '.jpg" class="img-info">' +
                    '<p>Localización: ' + estaciones[i].direccion +
                    '<br>Tipo: ' + estaciones[i].tipo +
                    '<br>Distancia: ' + estaciones[i].distancia.toFixed(3) + 'km</p>' +
                    '</div>'
                ]);
            }
            // Ajustes mapa
            var map = new google.maps.Map(document.getElementById('mapa'), {
                zoom: 15,
                center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            // Markers
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            for (i = 0; i < puntos.length; i++) {
                if (i === 0) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(puntos[0][2], puntos[0][1]),
                        map: map,
                        icon: "img/pin.png"
                    });
                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infowindow.setContent(infoPuntos[0][0]);
                            infowindow.open(map, marker);
                        };
                    })(marker, i));
                } else {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(puntos[i][2], puntos[i][1]),
                        map: map,
                        icon: "img/turbine.png"
                    });
                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infowindow.setContent(infoPuntos[i][0]);
                            infowindow.open(map, marker);
                        };
                    })(marker, i));
                }
            }
        }, function() {
            mapaAlternativo();
            //document.getElementById('mapa').innerHTML('<h1>Error: El Servicio de Geolocalización esta fallando.</h1>');
        });
    } else {
        mapaAlternativo();
        //document.getElementById('mapa').innerHTML('<h1>Error: Tu navegador no soporta la Geolocalización.</h1>');
    }
})();