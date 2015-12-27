var lineReader = require('line-reader'),
	http = require('http'),
	fs = require('fs'),
	project = require('pillars'),
	Scheduled = require('scheduled'),
	Firebase = require("firebase"),
	logger = require("./logger"),
	config = require('./config');

/** Función que se exporta para lanzar todas las tareas automáticas desde server.js */
exports.getData = function (){

var myFirebaseRef = new Firebase("https://"+config.firebaseApp+".firebaseio.com/last");

// Variables Globales
var All=[{}],
lastKnownVal = 0;

// Configuración de Pillarsjs
project.config.cors = true;
project.config.cacheMaxSize = 25*1024*1024;


/** Tarea para subir datos a Firebase cada hora (hh:52). */
var actualizarFBJob = new Scheduled({
    id: "actualizarFB",
    pattern: "52 * * * * *",
    task: function(){
    	logger.info('[TAREA PROGRAMADA] INFO - Subiendo los datos previamente enriquecidos a Firebase');
    	actualizarFB ();
    }
}).start();


/** Tarea para convertir y enriquecer los datos de aire.txt a aire.json cada hora (hh:51). */
var ConversionDatosJob = new Scheduled({
    id: "ConversionDatos",
    pattern: "51 * * * * *",
    task: function(){
    	logger.info('[TAREA PROGRAMADA] INFO - Enriqueciendo los datos y sobreescribiendo aire.json');
    	enriquecerDatos(); 
    }
}).start();

/** Tarea para descargar los datos del portal y almacenarlos como datos/aire.txt cada hora (hh:50). */
var BajarDatosJob = new Scheduled({
    id: "BajarDatos",
    pattern: "50 * * * * *",
    task: function(){
    	logger.info('[TAREA PROGRAMADA] INFO - Descargando aire.txt');
    	descargar(); 
    }
}).start();


/**
 * Función para verificar que los datos que se subiran a Firebase no estan repetidos, además gestionará la subida usando el token.
 */
function actualizarFB () {
    if(All != lastKnownVal) {
    	lastKnownVal = All;
    	myFirebaseRef.authWithCustomToken(config.token, function(error, authData) {
			  if (error) {
			  	logger.warn('[FIREBASE] ERROR - Identificación erronea. Revisa la configuración del Token', error);
			  } else {
			  	logger.info('[FIREBASE] INFO - Identificación realizada con éxito');
			    	logger.info('Iniciando la subida de datos a Firebase');
			        myFirebaseRef.set(All, function(){
			          if (error) {
							logger.warn('[FIREBASE] ERROR - Sincronización fallida');
					  } else {
							logger.info('[FIREBASE] INFO - Sincronizado con éxito');
					  }
			        });
			  }
		});
    } else {
    	logger.warn('[FIREBASE] Error - No se actualiza porque los datos son idénticos a los anteriores.');
    }
}

/**
 * Función para guardar los datos enriquecidos en aire.json
 */
function saveJsonToFile () {
	fs.writeFile("datos/aire.json", JSON.stringify(All, null, 4), function(err) {
	    if(err) {
	        return logger.warn('ERROR al guardar los datos actualizados en aire.json', err);
	    }
	    logger.info('aire.json actualizado y guardado!');
	});  
}

/** 
 * Función para descargar los datos de OpenData. 
 */
function descargar () {
	var file = fs.createWriteStream("datos/aire.txt");
	var request = http.get("http://www.mambiente.munimadrid.es/opendata/horario.txt", function(response) {
	  response.pipe(file);
	});
	logger.info('Iniciada la descarga de aire.txt de Internet');
};

/** 
 * Función para enriquecer los datos descargados de OpenData
 */
function enriquecerDatos () {
	  logger.info('Iniciando el enriqueciendo y guardado posterior para su exportación');
      saveJsonToFile();
	  var AllRes = [];	
	  
	  lineReader.eachLine("datos/aire.txt", function(line) {
		  var res = line.split(",");
		  
		  // Comunidad Autonoma
		  if (res[0] == 28) {
		  	res[0] = "Comunidad de Madrid";
		  };
	
		  // Ciudad
		  if (res[1] == 79) {
		  	res[1] = "Madrid";
		  };

		  // Número Estación
		  if (res[2] == 99) {
		  	res[2] = {
		  		nombre: "Media de la red",
		  		numero: 99
		  	};
		  } else if(res[2] == 4) {
		  	res[2] = {
		  		nombre: "Pza. de España",
		  		numero: 4
		  	};
		  } else if(res[2] == 8) {
		  	res[2] = {
		  		nombre: "Escuelas Aguirre",
		  		numero: 8
		  	};	  
		  } else if(res[2] == 11){
		  	res[2] = {
		  		nombre: "Av. Ramón y Cajal",
		  		numero: 11
		  	};
		  } else if(res[2] == 16){
		  	res[2] = {
		  		nombre: "Arturo Soria",
		  		numero: 16
		  	};
		  } else if(res[2] == 17){
		  	res[2] = {
		  		nombre: "Villaverde Alto",
		  		numero: 17
		  	};
		  } else if(res[2] == 18){
		  	res[2] = {
		  		nombre: "Farolillo",
		  		numero: 18
		  	};
		  } else if(res[2] == 24){
		  	res[2] = {
		  		nombre: "Casa de Campo",
		  		numero: 24
		  	};
		  } else if(res[2] == 27){
		  	res[2] = {
		  		nombre: "Barajas",
		  		numero: 27
		  	};	  	  		  	  		  
		  } else if(res[2] == 35){
		  	res[2] = {
		  		nombre: "Pza. del Carmen",
		  		numero: 35
		  	};
		  } else if(res[2] == 36){
		  	res[2] = {
		  		nombre: "Moratalaz",
		  		numero: 36
		  	};
		  } else if(res[2] == 38){
		  	res[2] = {
		  		nombre: "Cuatro Caminos",
		  		numero: 38
		  	};
		  } else if(res[2] == 39){
		  	res[2] = {
		  		nombre: "Barrio del Pilar",
		  		numero: 39
		  	};
		  } else if(res[2] == 40){
		  	res[2] = {
		  		nombre: "Vallecas",
		  		numero: 40
		  	};	  		  		  	 		  
		  } else if(res[2] == 47){
		  	res[2] = {
		  		nombre: "Méndez Álvaro",
		  		numero: 47
		  	};	  
		  } else if(res[2] == 48){
		  	res[2] = {
		  		nombre: "Castellana",
		  		numero: 48
		  	};
		  } else if(res[2] == 49){
		  	res[2] = {
		  		nombre: "Retiro",
		  		numero: 49
		  	};
		  } else if(res[2] == 50){
		  	res[2] = {
		  		nombre: "Pza. Castilla",
		  		numero: 50
		  	};
		  } else if(res[2] == 54){
		  	res[2] = {
		  		nombre: "Ensanche Vallecas",
		  		numero: 54
		  	};	
		  } else if(res[2] == 55){
		  	res[2] = {
		  		nombre: "Urb. Embajada",
		  		numero: 55
		  	};	  
		  } else if(res[2] == 56){
		  	res[2] = {
		  		nombre: "Pza. Fdez. Ladreda",
		  		numero: 56
		  	};	 
		  } else if(res[2] == 57){
		  	res[2] = {
		  		nombre: "Sanchinarro",
		  		numero: 57
		  	};	  	
		  } else if(res[2] == 58){
		  	res[2] = {
		  		nombre: "El Pardo",
		  		numero: 58
		  	};	
		  } else if(res[2] == 59){
		  	res[2] = {
		  		nombre: "Parque Juan Carlos I",
		  		numero: 59
		  	};
		  } else if(res[2] == 60){
		  	res[2] = {
		  		nombre: "Tres Olivos",
		  		numero: 60
		  	};	  		  	  			  	 	
		  }

		  // Código de Parámetros
		  if (res[3] == 1) {
		  	res[3] = "Dióxido de Azufre (S02)";
		  } else if(res[3] == 6) {
		  	res[3] = "Monóxido de Cabono (CO)";
		  } else if(res[3] == 7) {
		  	res[3] = "Monóxido de Nitrógeno (NO)";	
		  } else if(res[3] == 8) {
		  	res[3] = "Dióxido de Nitrógeno (NO2)";	 
		  } else if(res[3] == 9) {
		  	res[3] = "Partículas en suspensión (<2.5)";
		  } else if(res[3] == 10) {
		  	res[3] = "Partículas en suspensión (<10)";
		  } else if(res[3] == 12) {
		  	res[3] = "Óxidos de Nitrógeno totales (NOx)";
		  } else if(res[3] == 14) {
		  	res[3] = "Ozono (O3)";
		  } else if(res[3] == 20) {
		  	res[3] = "Tolueno (TOL)";
		  } else if(res[3] == 30) {
		  	res[3] = "Benceno (BEN)";
		  } else if(res[3] == 35) {
		  	res[3] = "Etilbenceno (EBE)";	
		  } else if(res[3] == 42) {
		  	res[3] = "Hidrocarburos Totales (HC)";	
		  } else if(res[3] == 43) {
		  	res[3] = "Metano (CH4)";
		  } else if(res[3] == 44) {
		  	res[3] = "Hidrocarburos No Metánicos (NMH)";
		  } else if(res[3] == 80) {
		  	res[3] = "Radiación Ultravioleta (UV)";
		  } else if(res[3] == 81) {
		  	res[3] = "Velocidad del Viento (VV)";
		  } else if(res[3] == 82) {
		  	res[3] = "Dirección del Viento (DD)";
		  } else if(res[3] == 83) {
		  	res[3] = "Temperatura Media (TMP)";
		  } else if(res[3] == 84) {
		  	res[3] = "Temperatura Máxima (TMX)";
		  } else if(res[3] == 85) {
		  	res[3] = "Temperatura Mínima (TMI)";
		  } else if(res[3] == 86) {
		  	res[3] = "Humedad Relativa (HR)";	 
		  } else if(res[3] == 87) {
		  	res[3] = "Presión Barométrica (PRB)";	  
		  } else if(res[3] == 88) {
		  	res[3] = "Radiación Solar (RS)"; 
		  } else if(res[3] == 89) {
		  	res[3] = "Precipitación (LL)";	
		  }
	
		  // Código de Técnica Analítica
		  if (res[4] == 2) {
		  	res[4] = "Ionización de llama";
		  } else if(res[4] == 6) {
		  	res[4] = "Absorción Ultravioleta";
		  } else if(res[4] == 8) {
		  	res[4] = "Quimioluminiscencia";
		  } else if(res[4] == 38) {
		  	res[4] = "Fluorescencia Ultravioleta";
		  } else if(res[4] == 47) {
		  	res[4] = "Microbalanza";
		  } else if(res[4] == 48) {
		  	res[4] = "Absorción Infrarroja";
		  } else if(res[4] == 59) {
		  	res[4] = "Cromatografía de Gases";
		  } else if(res[4] == 98) {
		  	res[4] = "Sensor Meteorológico";
		  }
	
		  // Código de Periodo de Analisis 
		  if (res[5] == 2) {
		  	res[5] = "Horario";
		  }
	
	
		  if (res[10] == "V") {
		  	res[10] = "Pasado";
		  } else if(res[10] == "N") {
		  	res[10] = "Pendiente";
		  }
	
		  if (res[12] == "V") {
		  	res[12] = "Pasado";
		  } else if(res[12] == "N") {
		  	res[12] = "Pendiente";
		  }
	
		  if (res[14] == "V") {
		  	res[14] = "Pasado";
		  } else if(res[14] == "N") {
		  	res[14] = "Pendiente";
		  }
	
		  if (res[16] == "V") {
		  	res[16] = "Pasado";
		  } else if(res[16] == "N") {
		  	res[16] = "Pendiente";
		  }
	
		  if (res[18] == "V") {
		  	res[18] = "Pasado";
		  } else if(res[18] == "N") {
		  	res[18] = "Pendiente";
		  }
	
		  if (res[20] == "V") {
		  	res[20] = "Pasado";
		  } else if(res[20] == "N") {
		  	res[20] = "Pendiente";
		  }
		  
		  if (res[22] == "V") {
		  	res[22] = "Pasado";
		  } else if(res[22] == "N") {
		  	res[22] = "Pendiente";
		  }	  
	
		  if (res[24] == "V") {
		  	res[24] = "Pasado";
		  } else if(res[24] == "N") {
		  	res[24] = "Pendiente";
		  }
	
		  if (res[26] == "V") {
		  	res[26] = "Pasado";
		  } else if(res[26] == "N") {
		  	res[26] = "Pendiente";
		  }
	
		  if (res[28] == "V") {
		  	res[28] = "Pasado";
		  } else if(res[28] == "N") {
		  	res[28] = "Pendiente";
		  }
	
		  if (res[30] == "V") {
		  	res[30] = "Pasado";
		  } else if(res[30] == "N") {
		  	res[30] = "Pendiente";
		  }
	
		  if (res[32] == "V") {
		  	res[32] = "Pasado";
		  } else if(res[32] == "N") {
		  	res[32] = "Pendiente";
		  }
	
		  if (res[34] == "V") {
		  	res[34] = "Pasado";
		  } else if(res[34] == "N") {
		  	res[34] = "Pendiente";
		  }
	
		  if (res[36] == "V") {
		  	res[36] = "Pasado";
		  } else if(res[36] == "N") {
		  	res[36] = "Pendiente";
		  }
	
		  if (res[38] == "V") {
		  	res[38] = "Pasado";
		  } else if(res[38] == "N") {
		  	res[38] = "Pendiente";
		  }
	
		  if (res[40] == "V") {
		  	res[40] = "Pasado";
		  } else if(res[40] == "N") {
		  	res[40] = "Pendiente";
		  }
	
		  if (res[42] == "V") {
		  	res[42] = "Pasado";
		  } else if(res[42] == "N") {
		  	res[42] = "Pendiente";
		  }
	
		  if (res[44] == "V") {
		  	res[44] = "Pasado";
		  } else if(res[44] == "N") {
		  	res[44] = "Pendiente";
		  }
	
		  if (res[46] == "V") {
		  	res[46] = "Pasado";
		  } else if(res[46] == "N") {
		  	res[46] = "Pendiente";
		  }
	
		  if (res[48] == "V") {
		  	res[48] = "Pasado";
		  } else if(res[48] == "N") {
		  	res[48] = "Pendiente";
		  }
	
	
		  if (res[50] == "V") {
		  	res[50] = "Pasado";
		  } else if(res[50] == "N") {
		  	res[50] = "Pendiente";
		  }
	
	
		  if (res[52] == "V") {
		  	res[52] = "Pasado";
		  } else if(res[52] == "N") {
		  	res[52] = "Pendiente";
		  }
		  
		  if (res[54] == "V") {
		  	res[54] = "Pasado";
		  } else if(res[54] == "N") {
		  	res[54] = "Pendiente";
		  }
	
		  if (res[56] == "V") {
		  	res[56] = "Pasado";
		  } else if(res[56] == "N") {
		  	res[56] = "Pendiente";
		  }

	  	  AllRes.push(res);

	}).then(function () {
	All=[{}];
	for (var i = 0; i < AllRes.length; i++) {

   	 	var myJsonString = JSON.stringify({
	  	estacion_nombre: AllRes[i][2].nombre, 
		estacion_numero: AllRes[i][2].numero,
	  	parametro: AllRes[i][3],
	  	tecnica: AllRes[i][4],
	  	fecha: AllRes[i][8].toString()+AllRes[i][7].toString()+AllRes[i][6].toString(),
	  	hora0: {valor: AllRes[i][9], estado: AllRes[i][10]},
	  	hora1: {valor: AllRes[i][11], estado: AllRes[i][12]},
	  	hora2: {valor: AllRes[i][13], estado: AllRes[i][14]},
	  	hora3: {valor: AllRes[i][15], estado: AllRes[i][16]},
	  	hora4: {valor: AllRes[i][17], estado: AllRes[i][18]},
	  	hora5: {valor: AllRes[i][19], estado: AllRes[i][20]},
	  	hora6: {valor: AllRes[i][21], estado: AllRes[i][22]},
	  	hora7: {valor: AllRes[i][23], estado: AllRes[i][24]},
	  	hora8: {valor: AllRes[i][25], estado: AllRes[i][26]},
	  	hora9: {valor: AllRes[i][27], estado: AllRes[i][28]},
	  	hora10: {valor: AllRes[i][29], estado: AllRes[i][30]},
	  	hora11: {valor: AllRes[i][31], estado: AllRes[i][32]},
	  	hora12: {valor: AllRes[i][33], estado: AllRes[i][34]},
	  	hora13: {valor: AllRes[i][45], estado: AllRes[i][36]},
	  	hora14: {valor: AllRes[i][37], estado: AllRes[i][38]},
	  	hora15: {valor: AllRes[i][39], estado: AllRes[i][40]},
	  	hora16: {valor: AllRes[i][41], estado: AllRes[i][42]},
	  	hora17: {valor: AllRes[i][43], estado: AllRes[i][44]},
	  	hora18: {valor: AllRes[i][45], estado: AllRes[i][46]},
	  	hora19: {valor: AllRes[i][47], estado: AllRes[i][48]},
	  	hora20: {valor: AllRes[i][49], estado: AllRes[i][50]},
	  	hora21: {valor: AllRes[i][51], estado: AllRes[i][52]},
	  	hora22: {valor: AllRes[i][53], estado: AllRes[i][54]},
	  	hora23: {valor: AllRes[i][55], estado: AllRes[i][56]}
	  });
		All[i] = myJsonString;
		All[i] = JSON.parse(All[i]);
	}

	//logger.info('Compartiendo los datos enriquecidos', JSON.stringify(All));
	logger.info('Iniciando el almacenamiento de datos en aire.json');
	saveJsonToFile ();
	});
}

};