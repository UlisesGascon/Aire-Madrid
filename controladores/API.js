var fs = require('fs'),
    http = require('http'),
    config = require('../config'),
    Firebase = require('firebase'),
    logger = require('../logger');

var myFirebaseRef = new Firebase("https://" + config.firebaseApp + ".firebaseio.com/" + config.firebaseAppRuta);

/**
 * Función que devuelve un .json con todos los datos en la ruta api/estacion/.
 * @param {object} req - Representa la petición HTTP (Cuerpo, cabeceras, etc...)
 * @param {object} res - Representa la respuesta HTTP (Cuerpo, cabeceras, etc...)
 */
exports.mostrarTodo = function(req, res){
    logger.info("Nueva peticion GET en api/estacion/");
    myFirebaseRef.once("value", function(snapshot) {
        logger.warn("Respuesta (200) - JSON Enviado");
        return res.status(200).jsonp(snapshot.val());
    }, function(errorObject) {
        if (errorObject) {
            logger.error("Respuesta (500) - Error en petición", {
                datos: errorObject
            });
            return res.status(500).send("Error en petición");
        }
    });

};

/**
 * Función que devuelve un .json específico en función de la estación pedida en la ruta api/estacion/:id.
 * @param {object} req - Representa la petición HTTP (Cuerpo, cabeceras, etc...)
 * @param {object} res - Representa la respuesta HTTP (Cuerpo, cabeceras, etc...)
 */
exports.mostrarEstacion = function(req, res){
    logger.info("Nueva peticion GET en api/estacion/" + req.params.id);
    myFirebaseRef.orderByChild('estacion_numero')
    .equalTo(parseInt(req.params.id, 10))
    .once('value', function(snap) {
        var estacionEncontrada = snap.val();
        if (estacionEncontrada !== null && estacionEncontrada !== undefined) {
          logger.warn("Respuesta (200) - JSON Enviado");
          return res.status(200).jsonp(snap.val());
        } else {
            logger.warn("La estación no existe");
            // Disparando un 404 Alternativo
            return res.status(404).send("No Existe! la estación. Error en petición");
        }
    });
};