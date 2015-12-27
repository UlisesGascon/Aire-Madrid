var fs = require('fs'),
    http = require('http'),
    config = require('../config'),
    Firebase = require("firebase"),
    logger = require('../logger');

var firebaseApp = new Firebase("https://" + config.firebaseApp + ".firebaseio.com/" + config.firebaseAppRuta);
var firebaseEstaciones = new Firebase("https://" + config.firebaseApp + ".firebaseio.com/" + config.firebaseEstacionesRuta);

/**
 * Función que redirecciona de /estaciones/ a /.
 * @param {object} req - Representa la petición HTTP (Cuerpo, cabeceras, etc...)
 * @param {object} res - Representa la respuesta HTTP (Cuerpo, cabeceras, etc...)
 */
exports.redireccion = function(req, res) {
    logger.info("Nueva peticion GET en /estaciones");
    return res.redirect('/');
};

/**
 * Función que resuelve y renderiza los datos de una estación en concreto partiendo de la ruta /estaciones/:id.
 * @param {object} req - Representa la petición HTTP (Cuerpo, cabeceras, etc...)
 * @param {object} res - Representa la respuesta HTTP (Cuerpo, cabeceras, etc...)
 */
exports.datosEstacion = function(req, res) {
    logger.info("Nueva peticion GET en /estaciones/" + req.params.id);

    firebaseApp.orderByChild('estacion_numero')
        .equalTo(parseInt(req.params.id))
        .once('value', function(snap) {
            var estacionEncontrada = snap.val();
            if (parseInt(req.params.id) === 99) {
                logger.info("Peticion GET en /estaciones/99, se redireccionará al index");
                return res.redirect('/');
            } else if (estacionEncontrada !== null && estacionEncontrada !== undefined) {
                logger.info("Estructurando los datos de contaminación relacionados...");
                var datos = [];
                for (var elementos in estacionEncontrada) {
                    datos.push(estacionEncontrada[elementos]);
                }

                firebaseEstaciones.orderByChild('numero_estacion')
                    .equalTo(parseInt(req.params.id))
                    .once('value', function(snap_datos) {
                        logger.info("Estructurando los datos de la estación...");
                        var datos_estaciones = snap_datos.val();
                        var datos_estacion = [];

                        for (var elementos in datos_estaciones) {
                            datos_estacion.push(datos_estaciones[elementos]);
                        }
                        
                        logger.info("Verificando ajustes horarios...");
                        // Determinando la hora
                        var fecha = new Date();
                        var UTC = fecha.getUTCHours();
                        var hora = UTC-1;
                        
                        function rectificacionHoraria(i){
                            if (i === -1){
                                i = "23";
                            }
                            return i;
                        }

                        logger.warn("Renderizando con éxito /estaciones/" + req.params.id);
                        res.render('estaciones', {
                            datos: datos,
                            datos_estacion: datos_estacion,
                            hora: "hora"+rectificacionHoraria(hora)
                        });

                    });
            } else {
                logger.info("La estación no existe, se renderizará el 404.jade");
                res.render('404');
            }
        });
};