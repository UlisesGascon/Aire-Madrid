var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    path = require('path'),
    logger = require("./logger"),
    datos = require("./datos"),
    config = require('./config'),
    // Controladores
    controlIndex = require('./controladores/index'),
    controlEstaciones = require('./controladores/estaciones'),
    controlAPI = require('./controladores/API');

logger.info('Bienvenido! Esto es Aire-Madrid', config.version);
logger.info('Arrancando las tareas automáticas...');

datos.getData();

logger.info('Tareas automáticas cargadas con éxito...');

// Middlewares  
// Vistas y plantillas
logger.info('Cargando configuración de vistas y plantillas...');
app.set('views', path.join(__dirname, 'vistas'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'publico')));

logger.info('Habilitando CORS...');
// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

logger.info('Cargando Parseadores...');
// Parseadores
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

logger.info('Todo el Middleware cargado con éxito');

logger.info('Controladores cargados...');

logger.info('Cargando Rutas...');
// Rutas Front
var router = express.Router();

router.route("/")
    .get(controlIndex.mostrarIndex);

router.route("/agradecimientos")
    .get(controlIndex.mostrarAgradecimientos);

router.route("/sobre")
    .get(controlIndex.mostrarSobre);

router.route("/historico")
    .get(controlIndex.mostrarHistorico);

app.use(router);

logger.info('Rutas base (/, agradecimientos y sobre) cargadas con éxito');


var estaciones = express.Router();

estaciones.route('/')
  .get(controlEstaciones.redireccion);
  
estaciones.route('/:id')
  .get(controlEstaciones.datosEstacion);
  
app.use('/estacion', estaciones);

logger.info('Rutas /estacion/ (/  y :id) cargadas con éxito');


// Rutas API
var rutasAPI = express.Router();

rutasAPI.route('/estacion')
    .get(controlAPI.mostrarTodo);
  
rutasAPI.route('/estacion/:id')
  .get(controlAPI.mostrarEstacion);
  
app.use('/api', rutasAPI);

logger.info('Rutas cargadas...');

logger.info('Rutas API /api/estacion (/ y :id) cargadas con éxito');

// 404
app.get('*', function(req, res){
  res.render('404');
});

logger.info('Ruta 404 cargada con éxito');
logger.info('Todas las rutas cargadas con éxito');

logger.info('Arrancando servidor HTTP');
// Arrancando Servidor
app.listen(process.env.PORT, process.env.IP, function() {
  logger.info("Servidor HTTP arrancado con éxito en http://"+process.env.IP+":"+process.env.PORT);
});