/*
    === Estructura del Script ===

Parte I - Librerías

1.1 Librería -> Arduino
1.2 Librería -> Websockets
1.3 Librería -> Datos del sistema (cpu, mem, etc..)


Parte II - Variables GLobales

2.1 Globales -> Versión Script

2.9.1 Globales -> Variables EduBasica
2.9.1 Variables EduBasica -> Leds



Parte III - Funciones

3.1 Funciones Locales
3.1.1 Local -> Determinar Adaptador de Red

3.1.3 Local -> Consola (Bienvenida)
3.1.3.1 Consola -> LcdEnable 
3.1.3.4 Consola -> wsMode
3.1.4 Local -> Escucha Arduino
3.1.5 Local -> Arranca el servidor
3.1.5.1 Servidor -> handler
3.1.5.2 Servidor -> wsStart
3.1.5.3 Servidor -> Apagando todo
3.1.5.4 Servidor -> Primer envio de datos (Información tab)
3.1.5.4.1 Primer Envio -> potenciometroValue


*/


/* Estrcutura de datos

== CABECERA ==
res[0] -> Comundiad autónoma
res[1] -> Ciudad
res[2] -> Número de Estación
res[3] -> Parametro medido
res[4] -> Técnica de analisis empleada
res[5] -> Periodo de analisis
res[6] -> Año
res[7] -> Mes
res[8] -> Día

== DATOS ==
res[9] -> Valor hora 00-01
res[10] -> Estado
res[11] -> Valor hora 01-02
res[12] -> Estado
res[13] -> Valor hora 02-03
res[14] -> Estado
res[15] -> Valor hora 03-04
res[16] -> Estado
res[17] -> Valor hora 04-05
res[18] -> Estado
res[19] -> Valor hora 05-06
res[20] -> Estado
res[21] -> Valor hora 06-07
res[22] -> Estado
res[23] -> Valor hora 07-08
res[24] -> Estado
res[25] -> Valor hora 08-09
res[26] -> Estado
res[27] -> Valor hora 09-10
res[28] -> Estado
res[29] -> Valor hora 10-11
res[30] -> Estado
res[31] -> Valor hora 11-12
res[32] -> Estado
res[33] -> Valor hora 12-13
res[34] -> Estado
res[35] -> Valor hora 13-14
res[36] -> Estado
res[37] -> Valor hora 15-16
res[38] -> Estado
res[39] -> Valor hora 16-17
res[40] -> Estado
res[41] -> Valor hora 17-18
res[42] -> Estado
res[43] -> Valor hora 18-19
res[44] -> Estado
res[45] -> Valor hora 19-20
res[46] -> Estado
res[47] -> Valor hora 20-21
res[48] -> Estado
res[49] -> Valor hora 21-22
res[50] -> Estado
res[51] -> Valor hora 22-23
res[52] -> Estado
res[53] -> Valor hora 23-00
res[54] -> Estado
res[55] -> Valor hora 00-01
res[56] -> Estado
*/

var lineReader = require('line-reader');
var http = require('http');
var fs = require('fs');
// Pillars
var project = require('pillars');
var Scheduled = require('scheduled');
// Firebase
var Firebase = require("firebase");

// Modo Debug
var debugMode = true;

// Firebase App config
var myFirebaseRef = new Firebase("https://angularjstestings.firebaseio.com/last");
var lastKnownVal = 0;
var dateFormat = 0;

// Variables Globales
var All=[{}];
var AllRes = [];


project.config.cors = true;
project.config.cacheMaxSize = 25*1024*1024;

// LIMPIAR FIREBASE (CleanUpFBJob)
var CleanUpFBJob = new Scheduled({
    id: "CleanUpFB",
    pattern: "0 9 1-7 * 1 *", // EL primer lunes de cada mes a las 9am
    task: function(){
    	if (debugMode) {
        	console.log("Primer Lunes del mes, hora de limpiar FireBase");
        };
    }
}).start();


// SUBIDA A FIREBASE CADA 6 HORAS (UpdateFBJob)
var UpdateFBJob = new Scheduled({
    id: "UpdateFB",
    pattern: "40 0,6,12,18 * * * *", // Todos los días a las 00:40, 06:40, 12:40 y 18:40
    task: function(){
    	updateFB ();
    }
}).start();


// SUBIDA A FIREBASE DEL RESUMEN DIARIO (SaveDayFB)
var SaveDayFBJob = new Scheduled({
    id: "SaveDayFB",
    pattern: "45 00 * * * *", // Todos los días a las 00:45
    task: function(){
    	updateFBArchive ();
    }
}).start();


// Bajada de Datos de Internet
var ConversionDatosJob = new Scheduled({
    id: "ConversionDatos",
    pattern: "37 * * * * *", // cada hora a las x:37
    task: function(){
    	fromTxtToJson(); 
    
    }
}).start();


// Bajada de Datos de Internet
var BajadaDatosJob = new Scheduled({
    id: "BajadaDatos",
    pattern: "35 * * * * *", // cada hora a las x:35
    task: function(){   	
    	download(); 
    }
}).start();


// Solo para asegurarnos que no se disparan los procesos del reloj con archivos vacios o fecha erronea
getDateFormat();
BajadaDatosJob.launch();
//ConversionDatosJob.launch();
//UpdateFBJob.launch();

// Función para casar la fecha en este formato (DDMMYYYY)
function getDateFormat () {
    var date = new Date();

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    dateFormat = ""+day+""+month+""+year; // DD/MM/YYYY
}

function updateFBArchive () {
	var myFirebaseArchive = new Firebase("https://angularjstestings.firebaseio.com/"+dateFormat);
    	myFirebaseArchive.set(All, onComplete);
    	if (debugMode) {
			console.log("INFO - Subiendo la última version al Archivo Firebase");
		};
};

var onComplete = function(error) {
  if (error) {
  	if (debigMode) {
    	console.log('ERROR (Firebase) - Sincronización fallada');
    };
  } else {
  	if (debugMode) {
    	console.log('INFO (Firebase) - Sincronizado con existo');
    };
  }
};

function updateFB () {
    if(All != lastKnownVal) {
    	lastKnownVal = All;
    	myFirebaseRef.set(All, onComplete);
    	if (debugMode) {
			console.log("INFO - Subiendo la última version a Firebase");
		};
    } else {
    	if (debugMode) {
    		console.log('Error (Firebase)- No se actualiza porque los datos son identicos a los anteriores.');
    	};
    };
};

function saveJsonToFile () {

	fs.writeFile("aire.json", JSON.stringify(All, null, 4), function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    if (debugMode) {
	    	console.log("aire.json actualizado y guardado!");
	    };
	});  
};

function download () {
	var file = fs.createWriteStream("aire.txt");
	var request = http.get("http://www.mambiente.munimadrid.es/opendata/horario.txt", function(response) {
	  response.pipe(file);
	});
	if (debugMode) {
		console.log("Iniciada la descarga de datos de Internet");
	};
};

function fromTxtToJson () {

      console.log("Enriqueciendo y guardando los datos en para su exportación");
	  lineReader.eachLine("aire.txt", function(line) {
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
	  	res[2] = "Media de la red";
	  } else if(res[2] == 4) {
	  	res[2] = "Pza. de España";
	  } else if(res[2] == 8) {
	  	res[2] = "Escuelas Aguirre";	  
	  } else if(res[2] == 11){
	  	res[2] = "Av. Ramón y Cajal";
	  } else if(res[2] == 16){
	  	res[2] = "Arturo Soria";
	  } else if(res[2] == 17){
	  	res[2] = "Villaverde Alto";
	  } else if(res[2] == 18){
	  	res[2] = "Farolillo";
	  } else if(res[2] == 24){
	  	res[2] = "Casa de Campo";
	  } else if(res[2] == 27){
	  	res[2] = "Barajas";	  	  		  	  		  
	  } else if(res[2] == 35){
	  	res[2] = "Pza. del Carmen";
	  } else if(res[2] == 36){
	  	res[2] = "Moratalaz";
	  } else if(res[2] == 38){
	  	res[2] = "Cuatro Caminos";
	  } else if(res[2] == 39){
	  	res[2] = "Barrio del Pilar";
	  } else if(res[2] == 40){
	  	res[2] = "Vallecas";	  		  		  	 		  
	  } else if(res[2] == 47){
	  	res[2] = "Méndez Álvaro";	  
	  } else if(res[2] == 48){
	  	res[2] = "Pº. Castellana";
	  } else if(res[2] == 49){
	  	res[2] = "Retiro";
	  } else if(res[2] == 50){
	  	res[2] = "Pza. Castilla";
	  } else if(res[2] == 54){
	  	res[2] = "Ensanche Vallecas";	
	  } else if(res[2] == 55){
	  	res[2] = "Urb. Embajada";	  
	  } else if(res[2] == 56){
	  	res[2] = "Pza. Fdez. Ladreda";	 
	  } else if(res[2] == 57){
	  	res[2] = "Sanchinarro";	  	
	  } else if(res[2] == 58){
	  	res[2] = "El Prado";	
	  } else if(res[2] == 59){
	  	res[2] = "Parque Juan Carlos I";
	  } else if(res[2] == 60){
	  	res[2] = "Tres Olivos";	  		  	  			  	 	
	  };


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
	  };

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
	  };

	  // Código de Periodo de Analisis 
	  if (res[5] == 2) {
	  	res[5] = "Horario";
	  };


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

//	  console.log(All);
	}).then(function () {
	
	All=[{}];
	// console.log("I'm done!!");
	 // console.log(All);

	
	//console.log(AllRes[0][1]);

	for (i = 0; i < 240; i++) {

   	 	var myJsonString = JSON.stringify({
	  	estacion: AllRes[i][2], 
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
	};

	if (debugMode) {
		console.log(JSON.stringify(All));
	};

	download();
	if (debugMode) {
	  	console.log('Actualizando la base de datos...');
	};
	
	saveJsonToFile ();
	});
}
