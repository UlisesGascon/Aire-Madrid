var fs = require('fs'),
    http = require('http'),
    config = require('../config'),
    Firebase = require("firebase"),
    logger = require("../logger");


var firebaseApp = new Firebase("https://" + config.firebaseApp + ".firebaseio.com/" + config.firebaseAppRuta);


/**
 * Función que renderiza el index con los datos Medios de la red (estación 99) en la ruta /.
 * @param {object} req - Representa la petición HTTP (Cuerpo, cabeceras, etc...)
 * @param {object} res - Representa la respuesta HTTP (Cuerpo, cabeceras, etc...)
 */
exports.mostrarIndex = function(req, res){
  logger.info("Nueva petición en / ");
  logger.warn("Renderizando index.jade");
  
    firebaseApp.orderByChild('estacion_numero')
        .equalTo(99)
        .once('value', function(snap) {
            logger.info("Estructurando los datos de contaminación relacionados...");
            var estacionEncontrada = snap.val();
            var datos = [];
                
            for (var elementos in estacionEncontrada) {
              datos.push(estacionEncontrada[elementos]);
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
            
            res.render('index', {datos: datos, hora: "hora"+rectificacionHoraria(hora)});
        });
};


/**
 * Función que renderiza agradecimientos.jade en ruta /agradecimientos.
 * @param {object} req - Representa la petición HTTP (Cuerpo, cabeceras, etc...)
 * @param {object} res - Representa la respuesta HTTP (Cuerpo, cabeceras, etc...)
 */
exports.mostrarAgradecimientos = function(req, res){
  logger.info("Nueva petición en /agradecimientos ");
  logger.warn("Renderizando agradecimientos.jade");
  res.render('agradecimientos');
};


/**
 * Función que renderiza sobre.jade en ruta /sobre.
 * @param {object} req - Representa la petición HTTP (Cuerpo, cabeceras, etc...)
 * @param {object} res - Representa la respuesta HTTP (Cuerpo, cabeceras, etc...)
 */
exports.mostrarSobre = function(req, res){
  logger.info("Nueva petición en /sobre ");
  logger.warn("Renderizando sobre.jade");
  res.render('sobre');
};

/**
 * Función que renderiza historico.jade en ruta /historico.
 * @param {object} req - Representa la petición HTTP (Cuerpo, cabeceras, etc...)
 * @param {object} res - Representa la respuesta HTTP (Cuerpo, cabeceras, etc...)
 */
exports.mostrarHistorico = function(req, res){
  logger.info("Nueva petición en /sobre ");
  logger.warn("Renderizando sobre.jade");
  res.render('historico');
};