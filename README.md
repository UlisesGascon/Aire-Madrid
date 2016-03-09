![shieldsIO](https://img.shields.io/github/issues/UlisesGascon/Aire-Madrid.svg)
![shieldsIO](https://img.shields.io/github/release/UlisesGascon/Aire-Madrid.svg)
![shieldsIO](https://img.shields.io/crates/l/rustc-serialize.svg)
![shieldsIO](https://img.shields.io/david/UlisesGascon/Aire-Madrid.svg)
# Aire-Madrid

[Aire Madrid](http://airemadrid.herokuapp.com/) es una aplicación para poder ver los datos de la calidad del Aire de Madrid en tiempo real.

Este proyecto es una extensión de un post que publique hace unos meses en [mi blog](http://www.blog.ulisesgascon.com/) sobre la [posibilidad de utilizar datos abiertos](http://www.blog.ulisesgascon.com/la-iniciativa-del-open-data/) facilitados por parte de las diversas instituciones en España.

![AireMadrid Captura](http://airemadrid.herokuapp.com//img/airemadrid_captura.png)
        
## Objetivo:
El objetivo de esta web es mostrar los datos que ofrece el ayuntamiento de Madrid a través de su portal de datos abiertos sobre la calidad del aire en tiempo real de una manera fácil y comprensible por un usuario no técnico.

### Obtención de datos

Los datos en los que se basa esta aplicación son obtenidos directamente de un archivo .txt totalmente plano. 
[La última versión oficial](http://datos.madrid.es/egob/catalogo/212531-7916318-calidad-aire-tiempo-real.txt)

### Análisis y enriquecimiento de datos

Los datos en el estado original no son de gran utilidad para el público en general. 

La información es descargada y se enriquece de manera transparente. 
[Detalles sobre el enriquecimiento](https://github.com/UlisesGascon/Aire-Madrid/tree/master/datos.js)

Una vez los datos están listos, cada hora se suben a [esta base de datos en Firebase](https://airemadrid.firebaseio.com/).

### Lectura de datos

Los datos de la base de datos son descargados en [este portal](http://airemadrid.herokuapp.com/) donde se muestran al público divido entre el resumen (datos media de la red) y las estaciones:

- [Media de la Red](http://airemadrid.herokuapp.com/)
- [Plaza de España](http://airemadrid.herokuapp.com/estacion/4)
- [Escuelas Aguirre](http://airemadrid.herokuapp.com/estacion/8)
- [Ramón y Cajal](http://airemadrid.herokuapp.com/estacion/11)
- [Arturo Soria](http://airemadrid.herokuapp.com/estacion/16)
- [Villaverde](http://airemadrid.herokuapp.com/estacion/17)
- [Farolillo](http://airemadrid.herokuapp.com/estacion/18)
- [Casa de Campo](http://airemadrid.herokuapp.com/estacion/24)
- [Barajas](http://airemadrid.herokuapp.com/estacion/27)
- [Plaza del Carmen](http://airemadrid.herokuapp.com/estacion/35)
- [Moratalaz](http://airemadrid.herokuapp.com/estacion/36)
- [Cuatro Caminos](http://airemadrid.herokuapp.com/estacion/38)
- [Barrio del Pilar](http://airemadrid.herokuapp.com/estacion/39)
- [Vallecas](http://airemadrid.herokuapp.com/estacion/40)
- [Méndez Álvaro](http://airemadrid.herokuapp.com/estacion/47)
- [Castellana](http://airemadrid.herokuapp.com/estacion/48)
- [Parque del Retiro](http://airemadrid.herokuapp.com/estacion/49)
- [Plaza Castilla](http://airemadrid.herokuapp.com/estacion/50)
- [Ensanche de Vallecas](http://airemadrid.herokuapp.com/estacion/54)
- [Urbanización Embajada](http://airemadrid.herokuapp.com/estacion/55)
- [Plaza Fernández Ladreda](http://airemadrid.herokuapp.com/estacion/56)
- [Sanchinarro](http://airemadrid.herokuapp.com/estacion/57)
- [El Pardo](http://airemadrid.herokuapp.com/estacion/58)
- [Parque Juan Carlos I](http://airemadrid.herokuapp.com/estacion/59)
- [Tres Olivos](http://airemadrid.herokuapp.com/estacion/60)

*Nota:* Algunas estaciones presentan pocos datos, y algunos datos clave de la media como la temperatura máxima no están presentes.        


### Geolocalización

Desde esta versión (2.0.0) ya está disponible un sistema de geolocalización que se ejecuta en aquellas rutas que lo requieran.
- [soporte](http://caniuse.com/#search=geolocation)

### API 

Desde esta versión (2.0.0) ya están disponibles las rutas para el uso de AJAX. Todos los datos están provistos en formato .json, CORS esta habilitiado con lo que se pueden hacer peticiones desde cualquier dominio.

**Rutas**

- Todos los datos disponibles de todas las estaciones:
	- [Todas estaciones](http://airemadrid.herokuapp.com/api/estacion)

- Todos los datos de una estación determinada:
	- [Media de la Red](http://airemadrid.herokuapp.com/api/estacion/99)
	- [Plaza de España](http://airemadrid.herokuapp.com/api/estacion/4)
	- [Escuelas Aguirre](http://airemadrid.herokuapp.com/api/estacion/8)
	- [Ramón y Cajal](http://airemadrid.herokuapp.com/api/estacion/11)
	- [Arturo Soria](http://airemadrid.herokuapp.com/api/estacion/16)
	- [Villaverde](http://airemadrid.herokuapp.com/api/estacion/17)
	- [Farolillo](http://airemadrid.herokuapp.com/api/estacion/18)
	- [Casa de Campo](http://airemadrid.herokuapp.com/api/estacion/24)
	- [Barajas](http://airemadrid.herokuapp.com/api/estacion/27)
	- [Plaza del Carmen](http://airemadrid.herokuapp.com/api/estacion/35)
	- [Moratalaz](http://airemadrid.herokuapp.com/api/estacion/36)
	- [Cuatro Caminos](http://airemadrid.herokuapp.com/api/estacion/38)
	- [Barrio del Pilar](http://airemadrid.herokuapp.com/api/estacion/39)
	- [Vallecas](http://airemadrid.herokuapp.com/api/estacion/40)
	- [Méndez Álvaro](http://airemadrid.herokuapp.com/api/estacion/47)
	- [Castellana](http://airemadrid.herokuapp.com/api/estacion/48)
	- [Parque del Retiro](http://airemadrid.herokuapp.com/api/estacion/49)
	- [Plaza Castilla](http://airemadrid.herokuapp.com/api/estacion/50)
	- [Ensanche de Vallecas](http://airemadrid.herokuapp.com/api/estacion/54)
	- [Urbanización Embajada](http://airemadrid.herokuapp.com/api/estacion/55)
	- [Plaza Fernández Ladreda](http://airemadrid.herokuapp.com/api/estacion/56)
	- [Sanchinarro](http://airemadrid.herokuapp.com/api/estacion/57)
	- [El Pardo](http://airemadrid.herokuapp.com/api/estacion/58)
	- [Parque Juan Carlos I](http://airemadrid.herokuapp.com/api/estacion/59)
	- [Tres Olivos](http://airemadrid.herokuapp.com/api/estacion/60)

**Ejemplo**

- [Vanillajs](http://vanilla-js.com/):

```javascript
    function peticionAjax(url) {
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function() {

            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                console.info(JSON.parse(xmlHttp.responseText));
            } else if (xmlHttp.readyState === 4 && xmlHttp.status === 404) {
                console.error("ERROR! 404");
                console.info(JSON.parse(xmlHttp.responseText));
            }
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send();
    }

    peticionAjax("http://airemadrid.herokuapp.com/api/estacion/99");
```

- Jquery:

```javascript
    function peticionJqueryAjax (url) {

	    $.ajax({
	        dataType: "json",
	        url: url,
	    })
	     .done(function( data, textStatus, jqXHR ) {
	         if ( console && console.log ) {
	             console.log( "La solicitud se ha completado correctamente." );
	             console.log( data );
	         }
	     })
	     .fail(function( jqXHR, textStatus, errorThrown ) {
	         if ( console && console.log ) {
	             console.log( "La solicitud a fallado: " +  textStatus);
	         }
	    });
	
	}
	
	peticionJqueryAjax ("http://airemadrid.herokuapp.com/api/estacion/99");
```

### Histórico 

Estoy trabajando para lograr transformar los datos de años anteriores, por el momento he centralizado todos los detalles [aqui](http://airemadrid.herokuapp.com/historico). 

También puedes descargarte los datos en bruto desde 2003 hasta 20015.

### Colaboración
Este proyecto está abierto a colaboración y mejora por parte de cualquier persona interesada. No dudes en ponerte en contacto conmigo a través de este repositorio o mi [cuenta de Twitter](https://twitter.com/kom_256).
        
        
## Anécdotas
Todo el backend desde la versión Beta hasta la versión 2.0.0 se ejecutaba (descargar, enriquecimiento y subida de datos a Firebase) desde [una Raspberry Pi dentro de un grifo de Murphy's](https://twitter.com/kom_256/status/625895707845771264)
![El grifo](http://airemadrid.herokuapp.com/img/server.png)
