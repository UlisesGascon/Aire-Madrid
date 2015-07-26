/* globales */
   
var debugMode = false;
var serverDate = null;
var realTimeAgo = null;
var dbUrl = "https://airemadrid.firebaseio.com/";
var dbSection = "last/";

var SO2Enable = false;
var COEnable = false;
var NOEnable = false;
var NO2Enable = false;
var PS25Enable = false;
var PS10Enable = false;
var NOXEnable = false;
var O3Enable = false;
var TOLEnable = false;
var BENEnable = false;
var EBEEnable = false;
var HCEnable = false;
var CH4Enable = false;
var NMHEnable = false;
var UVEnable = false;
var VVEnable = false;
var DDEnable = false;
var TMPEnable = false;
var TMIEnable = false;
var HREnable = false;
var PRBEnable = false;

var SO2Key = null; 
var COKey = null;
var NOKey = null;
var NO2Key = null;
var PS25Key = null;
var PS10Key = null;
var NOXKey = null;
var O3Key = null;
var TOLKey = null;
var BENKey = null;
var EBEKey = null;
var HCKey = null;
var CH4Key = null;
var NMHKey = null;
var UVKey = null;
var VVKey = null;
var DDKey = null;
var TMPKey = null;
var TMIKey = null
var HRKey = null;
var PRBKey = null;



/* Contaminantes medidos */

// // Dióxido de Azufre (S02):
var SO2elemento = "Dióxido de Azufre (S02): ";
var SO2valor = "#SO2Valor";
var SO2medidor = "#MEDSO2Valor";
// Monóxido de Carbono (CO): 
var COelemento = "Monóxido de Carbono (CO): ";
var COvalor = "#COValor";
var COmedidor = "#MEDCOValor";
// Monóxido de Nitrógeno (NO):
var NOelemento = "Monóxido de Nitrógeno (NO): ";
var NOvalor = "#NOValor";
var NOmedidor = "#MEDNOValor";
// Dióxido de Nitrógeno (NO2):
var NO2elemento = "Dióxido de Nitrógeno (NO2): ";
var NO2valor = "#NO2Valor";
var NO2medidor = "#MEDNO2Valor";
// Partículas en suspensión (<2.5): 
var PS25elemento = "Partículas en suspensión (<2.5): ";
var PS25valor = "#PS25Valor";
var PS25medidor = "#MEDPS25Valor";
// Partículas en suspensión (<10): 
var PS10elemento = "Partículas en suspensión (<10): ";
var PS10valor = "#PS10Valor";
var PS10medidor = "#MEDPS10Valor";
// Óxidos de Nitrógeno totales (NOx): 
var NOXelemento = "Óxidos de Nitrógeno totales (NOx): ";
var NOXvalor = "#NOXValor";
var NOXmedidor = "#MEDNOXValor";
// Ozono (O3): 
var O3elemento = "Ozono (O3): ";
var O3valor = "#O3Valor";
var O3medidor = "#MEDO3Valor";
// Tolueno (TOL):  
var TOLelemento = "Tolueno (C6H5CH3): ";
var TOLvalor = "#TOLValor";
var TOLmedidor = "#MEDTOLValor";
// Benceno (C6H6): 
var BENelemento = "Benceno (C6H6): ";
var BENvalor = "#BENValor";
var BENmedidor = "#MEDBENValor";
// Etilbenceno (EBE): 
var EBEelemento = "Etilbenceno (C6H5CH2CH3): ";
var EBEvalor = "#EBEValor";
var EBEmedidor = "#MEDEBEValor";
// Hidrocarburos Totales (HC): 
var HCelemento = "Hidrocarburos Totales (HC): ";
var HCvalor = "#HCValor";
var HCmedidor = "#MEDHCValor";
//Metano (CH4):
var CH4elemento = "Metano (CH4): ";
var CH4valor = "#CH4Valor";
var CH4medidor = "#MEDCH4Valor";
// Hidrocarburos No Metánicos (NMH): 
var NMHelemento = "Hidrocarburos No Metánicos (NMH): ";
var NMHvalor = "#NMHValor";
var NMHmedidor = "#MEDNMHValor";


/* Parámetros metereológicos */
// Radiación Ultravioleta (UV):
var UVelemento = "Radiación Ultravioleta (UV): ";
var UVvalor = "#UVValor";
var UVmedidor = "#MEDUVValor";
// Velocidad del Viento (VV): 
var VVelemento = "Velocidad del Viento (VV): ";
var VVvalor = "#VVValor";
var VVmedidor = "#MEDVVValor";
// Dirección del Viento (DD):
var DDelemento = "Dirección del Viento (DD): ";
var DDvalor = "#DDValor";
var DDmedidor = "#MEDDDValor";
// Temperatura Media (TMP): 
var TMPelemento = "Temperatura Media (TMP): ";
var TMPvalor = "#TMPValor";
var TMPmedidor = "#MEDTMPValor";
// Temperatura Mínima (TMI):  
var TMIelemento = "Temperatura Mínima (TMI): ";
var TMIvalor = "#TMIValor";
var TMImedidor = "#MEDTMIValor";
// Humedad Relativa (HR): 
var HRelemento = "Humedad Relativa (HR): ";
var HRvalor = "#HRValor";
var HRmedidor = "#MEDHRValor";
// Presión Barométrica (PRB): 
var PRBelemento = "Presión Barométrica (PRB): ";
var PRBvalor = "#PRBValor";
var PRBmedidor = "#MEDPRBValor";





/* 
    - INICIO - Gestion del tiempo 
*/
var horaActual = getHourTime();

function getHourTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    if (debugMode) {
    console.log("hora es "+hour );
    };
    return hour
};


var horaFinal1 = horaActual-1;

if (horaFinal1 == -1) {
  horaFinal1 = 23;
};

var horaFinal2 = horaActual-2;

if (horaFinal2 == -2) {
  horaFinal2 = 22;
}
else if (horaFinal2 == -1) {
  horaFinal2 = 23;
};

// RealTime Read

var myFirebaseRef = new Firebase(dbUrl+dbSection+"0/fecha");
    myFirebaseRef.on("value", function(snapshot) {
    
      var newChange = snapshot.val();
      var res = newChange.split("");
      serverDate = ""+res[4]+""+res[5]+""+res[6]+""+res[7]+"-"+res[2]+""+res[3]+"-"+res[0]+""+res[1]+"T";
      
        realTimeAgo = serverDate+""+horaFinal1+":00:00Z"
        var userTimeAgo = ""+res[0]+""+res[1]+"/"+res[2]+""+res[3]+"/"+res[4]+""+res[5]+""+res[6]+""+res[7]+" a las "+horaFinal1+":00"
        $("abbr.timeago").html(userTimeAgo).attr("title", realTimeAgo).timeago();

        
        
        if (debugMode) {
        console.log("la hora definida es "+hora);
        console.log("El tiempo para TiemAgo es "+realTimeAgo);
        };
    
    });
    var hora = "hora"+horaFinal2+"/"
    if(debugMode) {
      console.log("Hora pedida es "+hora);
    };


/* - FIN - Gestion del tiempo */

/*
    - INICIO - Queries
*/

function controlEstaciones () {
var firebaseRef = new Firebase(dbUrl+dbSection);
firebaseRef.orderByChild("estacion").on("child_added", function(snapshot) {
  console.log(snapshot.key() + " es la estación de " + snapshot.val().estacion);
});
};

function bringData (dbKey, consoleElement, valorID, medID) {
var myFirebaseRef = new Firebase(dbUrl+dbSection+dbKey+hora);
myFirebaseRef.on("value", function(snapshot) {
  var newChange = snapshot.val();
  if (debugMode) {
  console.log(consoleElement+newChange.valor);
  };
  $(valorID).html(parseFloat(newChange.valor));
});

var myFirebaseRef = new Firebase(dbUrl+dbSection+dbKey);
myFirebaseRef.on("value", function(snapshot) {
  var newChange = snapshot.val();
  if (debugMode) {  
  console.log(newChange.tecnica);
  };  
  $(medID).html(newChange.tecnica);
});

};


function bringDDData (dbKey, consoleElement, valorID, medID) {
var myFirebaseRef = new Firebase(dbUrl+dbSection+dbKey+hora);
myFirebaseRef.on("value", function(snapshot) {
  var newChange = snapshot.val();
  if (debugMode) {
  console.log(consoleElement+newChange.valor);
  };
  var valorRico = parseFloat(newChange.valor);
  
    if (valorRico <= 89) {
    $(valorID).html(valorRico+"° (Norte)");
  } else if (valorRico <= 179){
    $(valorID).html(valorRico+"° (Este)");
  } else if (valorRico <= 269){
    $(valorID).html(valorRico+"° (Sur)");
  } else if (valorRico >= 270){    
    $(valorID).html(valorRico+"° (Oeste)");
  } else {
    $(valorID).addClass( "text-danger" ).html("ERROR"); 
  };

});

var myFirebaseRef = new Firebase(dbUrl+dbSection+dbKey);
myFirebaseRef.on("value", function(snapshot) {
  var newChange = snapshot.val();
  if (debugMode) {  
    console.log(newChange.tecnica);
  };
  $(medID).html(newChange.tecnica);
});

};

/* - FIN - Queries*/

/* 
    - INICIO - TEMPLATES
*/

// Index
var allModals = '<div class="modal fade" id="SO2Modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="myModalLabel">Dióxido de Azufre (S0<sub>2</sub>)</h4> </div><div class="modal-body"> <div class="row"> <div class="col-lg-12"> <img src="img/peligrosidad_dioxido_de_azufre.png" class="pull-left img-responsive img-peligrosidad"></img> <p><em><span>[3]Muy peligroso</span> <span>[0]No se inflama</span> <span>[0]Estable</span></em></p><p>El dióxido de azufre es un óxido cuya fórmula molecular es SO<sub>2</sub>. Es un gas incoloro con un característico olor asfixiante. Se trata de una sustancia reductora que, con el tiempo, el contacto con el aire y la humedad, se convierte en trióxido de azufre. La velocidad de esta reacción en condiciones normales es baja.</p></div></div><div class="row"> <div class="col-lg-4"> <div class="panel panel-default"> <div class="panel-heading">Límite horario</div><div class="panel-body"> <h3>350 μg/m<sup>3</sup></h3> que no podrá superarse en más de 24 ocasiones por año </div></div></div><div class="col-lg-4"> <div class="panel panel-default"> <div class="panel-heading">Límite diario</div><div class="panel-body"> <h3>125 μg/m<sup>3</sup></h3> que no podrá superarse en más de 3 ocasiones por año </div></div></div><div class="col-lg-4"> <div class="panel panel-default"> <div class="panel-heading">Umbral de Alerta</div><div class="panel-body"> <h3>500 μg/m<sup>3</sup></h3> durante tres horas consecutivas en un área &#62;100 km<sup>2</sup> </div></div></div></div><div class="row"> <div class="col-lg-12"> <em>Fuente: <a target="_blank" href="https://www.wikiwand.com/es/Di%C3%B3xido_de_azufre">Wikipedia</a> y <a target="_blank" href="http://www.madrid.es/UnidadesDescentralizadas/Sostenibilidad/ContenidosBasicos/Ficheros/PlanCalidadAire2012.pdf">Ayuntamiento de Madrid</a></em> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button> </div></div></div></div><div class="modal fade" id="COModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="myModalLabel">Monóxido de Carbono (CO)</h4> </div><div class="modal-body"> <div class="row"> <div class="col-lg-12"> <img src="img/peligrosidad_monoxido_de_carbono.png" class="pull-left img-responsive img-peligrosidad"></img> <p><em><span>[4]Causa de muerte</span> <span>[4]Se inflama a &#60;25°C</span> <span>[0]Estable</span></em></p><p>El monóxido de carbono, también denominado óxido de carbono (II), gas carbonoso y anhídrido carbonoso (los dos últimos cada vez más en desuso), cuya fórmula química es CO, es un gas inodoro, incoloro y altamente tóxico. Puede causar la muerte cuando se respira en niveles elevados. Se produce por la combustión deficiente de sustancias como gas, gasolina, keroseno, carbón, petróleo, tabaco o madera. Las chimeneas, las calderas, los calentadores de agua o calefactores y los aparatos domésticos que queman combustible, como las estufas u hornallas de la cocina o los calentadores a queroseno, también pueden producirlo si no están funcionando bien. Los vehículos con el motor encendido también lo despiden. También se puede encontrar en las atmósferas de las estrellas de carbono.</p></div></div><div class="row"> <div class="col-lg-4"> </div><div class="col-lg-4"> <div class="panel panel-default"> <div class="panel-heading">Límite Octohorario</div><div class="panel-body"> <h3>10 μg/m<sup>3</sup></h3> media octohoraria máxima en un día </div></div></div><div class="col-lg-4"> </div></div><div class="row"> <div class="col-lg-12"> <em>Fuente: <a target="_blank" href="https://www.wikiwand.com/es/Mon%C3%B3xido_de_carbono">Wikipedia</a> y <a target="_blank" href="http://www.madrid.es/UnidadesDescentralizadas/Sostenibilidad/ContenidosBasicos/Ficheros/PlanCalidadAire2012.pdf">Ayuntamiento de Madrid</a></em> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button> </div></div></div></div><div class="modal fade" id="NOModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="myModalLabel">Monóxido de Nitrógeno (NO)</h4> </div><div class="modal-body"> <div class="row"> <div class="col-lg-12"> <img src="img/peligrosidad_monoxido_de_nitrogeno.png" class="pull-left img-responsive img-peligrosidad"></img> <p><em><span>[3]Muy peligroso</span> <span>[0]No se inflama</span> <span>[2]Inestable en caso de cambio químico violento</span> <span>[OX] Oxidante</span></em></p><p>El óxido de nitrógeno (II), óxido nítrico o monóxido de nitrógeno (NO) es un gas incoloro y poco soluble en agua presente en pequeñas cantidades en los mamíferos. Está también extendido por el aire siendo producido en automóviles y plantas de energía. Se lo considera un agente tóxico.</p><p>A altas temperaturas el nitrógeno (N<sub>2</sub>) y el oxígeno (O<sub>2</sub>) moleculares pueden combinarse para formar óxido nítrico; por ello las actividades humanas han incrementado en gran medida la presencia de este gas en la atmósfera.</p><p>Este gas en el aire puede convertirse, más tarde, en ácido nítrico produciendo así lluvia ácida. Además el NO y el NO<sub>2</sub> son en parte responsables del agujero de la capa de ozono.</p><p>Su efecto para con la radiación solar es doble. Mientras en la baja atmósfera contribuyen al calentamiento global en la alta lo hacen al oscurecimiento global.</p></div></div><div class="row"> <div class="col-lg-12"> <em>Fuente: <a target="_blank" href="https://www.wikiwand.com/es/%C3%93xido_de_nitr%C3%B3geno_(II)">Wikipedia</a></em> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button> </div></div></div></div><div class="modal fade" id="NO2Modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="myModalLabel">Dióxido de Nitrógeno (NO<sub>2</sub>)</h4> </div><div class="modal-body"> <div class="row"> <div class="col-lg-12"> <img src="img/peligrosidad_dioxido_de_nitrogeno.png" class="pull-left img-responsive img-peligrosidad"></img> <p><em><span>[3]Muy peligroso</span> <span>[0]No se inflama</span> <span>[0]Estable</span></em></p><p>El dióxido de nitrógeno u óxido de nitrógeno (IV) (NO<sub>2</sub>), es un compuesto químico formado por los elementos nitrógeno y oxígeno, uno de los principales contaminantes entre los varios óxidos de nitrógeno.</p><p>El dióxido de nitrógeno es de color marrón-amarillento. Se forma como subproducto en los procesos de combustión a altas temperaturas, como en los vehículos motorizados y las plantas eléctricas. Por ello es un contaminante frecuente en zonas urbanas.</p><p>Es un gas tóxico, irritante y precursor de la formación de partículas de nitrato. Estas llevan a la producción de ácido y elevados niveles de PM-2.5 en el ambiente. Afecta principalmente al sistema respiratorio. La exposición a corto plazo en altos niveles causa daños en las células pulmonares, mientras que la exposición a más largo plazo en niveles bajos de dióxido de nitrógeno puede causar cambios irreversibles en el tejido pulmonar similares a un enfisema.</p><p>El dióxido de nitrógeno es un contaminante indicador del tráfico rodado fundamentalmente, es emitido especialmente por los vehículos diesel (emisiones directas o “primarias”), pero se produce también por la oxidación del monóxido de nitrógeno, emitido también por los vehículos (dióxido de nitrógeno secundario).</p></div></div><div class="row"> <div class="col-lg-4"> <div class="panel panel-default"> <div class="panel-heading">Límite horario</div><div class="panel-body"> <h3>200 μg/m<sup>3</sup></h3> que no podrá superarse en más de 18 ocasiones por año </div></div></div><div class="col-lg-4"> <div class="panel panel-default"> <div class="panel-heading">Límite anual</div><div class="panel-body"> <h3>40 μg/m<sup>3</sup></h3> </div></div></div><div class="col-lg-4"> <div class="panel panel-default"> <div class="panel-heading">Umbral de Alerta</div><div class="panel-body"> <h3>400 μg/m<sup>3</sup></h3> durante tres horas consecutivas en un área &#62;100 km<sup>2</sup> </div></div></div></div><div class="row"> <div class="col-lg-12"> <em>Fuente: <a target="_blank" href="https://www.wikiwand.com/es/Di%C3%B3xido_de_nitr%C3%B3geno">Wikipedia</a> y <a target="_blank" href="http://www.madrid.es/UnidadesDescentralizadas/Sostenibilidad/ContenidosBasicos/Ficheros/PlanCalidadAire2012.pdf">Ayuntamiento de Madrid</a></em> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button> </div></div></div></div><div class="modal fade" id="O3Modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="myModalLabel">Ozono (O<sub>3</sub>)</h4> </div><div class="modal-body"> <div class="row"> <div class="col-lg-12"> <p>El ozono (O<sub>3</sub>) es una sustancia cuya molécula está compuesta por tres átomos de oxígeno, formada al disociarse los dos átomos que componen el gas de oxígeno. Cada átomo de oxígeno liberado se une a otra molécula de oxígeno gaseoso (O<sub>2</sub>), formando moléculas de ozono (O<sub>3</sub>).</p><p>A temperatura y presión ambientales el ozono es un gas de olor acre y generalmente incoloro, pero en grandes concentraciones puede volverse ligeramente azulado. Si se respira en grandes cantidades, puede provocar una irritación en los ojos y/o garganta, la cual suele pasar después de respirar aire fresco por algunos minutos.</p></div></div><div class="row"> <div class="col-lg-2"> </div><div class="col-lg-4"> <div class="panel panel-default"> <div class="panel-heading">Umbral información</div><div class="panel-body"> <h3>180 μg/m<sup>3</sup></h3> Como valor medio de 1 hora </div></div></div><div class="col-lg-4"> <div class="panel panel-default"> <div class="panel-heading">Umbral de Alerta</div><div class="panel-body"> <h3>240 μg/m<sup>3</sup></h3> Como valor medio de 1 hora </div></div></div><div class="col-lg-2"> </div></div><div class="row"> <div class="col-lg-12"> <em>Fuente: <a target="_blank" href="https://www.wikiwand.com/es/Ozono">Wikipedia</a> y <a target="_blank" href="http://www.madrid.es/UnidadesDescentralizadas/Sostenibilidad/ContenidosBasicos/Ficheros/PlanCalidadAire2012.pdf">Ayuntamiento de Madrid</a></em> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button> </div></div></div></div><div class="modal fade" id="TOLModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="myModalLabel">Tolueno (C<sub>6</sub>H<sub>5</sub>CH<sub>3</sub>)</h4> </div><div class="modal-body"> <div class="row"> <div class="col-lg-12"> <p>El tolueno o metilbenceno (C<sub>6</sub>H<sub>5</sub>CH<sub>3</sub>) es un hidrocarburo aromático a partir de la cual se obtienen derivados del benceno, el ácido benzoico, el fenol, la caprolactama, la sacarina, el diisocianato de tolueno (TDI), materia prima para la elaboración de poliuretano, medicamentos, colorantes, perfumes, TNT y detergentes.</p><p>El tolueno puede afectar al sistema nervioso. Niveles bajos o moderados pueden producir cansancio, confusión, debilidad, pérdida de la memoria, náusea, pérdida del apetito y pérdida de la audición y la vista. Estos síntomas generalmente desaparecen cuando la exposición termina.</p><p>Los vapores de tolueno presentan un ligero efecto narcótico e irritan los ojos. Inhalar niveles altos de tolueno durante un período breve puede hacer que uno se sienta mareado o somnoliento. Puede causar, además, pérdida del conocimiento y, en casos extremos, la muerte.</p></div></div><div class="row"> <div class="col-lg-12"> <em>Fuente: <a target="_blank" href="https://www.wikiwand.com/es/Tolueno">Wikipedia</a></em> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button> </div></div></div></div><div class="modal fade" id="BENModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="myModalLabel">Benceno (C<sub>6</sub>H<sub>6</sub>)</h4> </div><div class="modal-body"> <div class="row"> <div class="col-lg-12"> <img src="img/peligrosidad_benceno.png" class="pull-left img-responsive img-peligrosidad"></img> <p><em><span>[3]Muy peligroso</span> <span>[3]Se inflama a &#60;37°C</span> <span>[2]Inestable en caso de cambio químico violento</span></em></p><p>El benceno es un líquido incoloro y muy inflamable de aroma dulce (que debe manejarse con sumo cuidado debido a su carácter cancerígeno), con un punto de ebullición relativamente alto.</p><p>Respirar niveles de benceno muy altos puede causar la muerte, mientras que niveles bajos pueden causar somnolencia, mareo y aceleración del latido del corazón o taquicardia. Comer o tomar altos niveles de benceno puede causar vómitos, irritación del estómago, mareo, somnolencia o convulsiones y, en último extremo, la muerte.</p><p>La exposición de larga duración al benceno se manifiesta en la sangre. El benceno produce efectos nocivos en la médula ósea y puede causar una disminución en el número de hematíes, lo que conduce a padecer anemia. El benceno también puede producir hemorragias y daños en el sistema inmunitario, aumentando así las posibilidades de contraer infecciones por inmunodepresión.</p></div></div><div class="row"> <div class="col-lg-4"> </div><div class="col-lg-4"> <div class="panel panel-default"> <div class="panel-heading">Límite Anual</div><div class="panel-body"> <h3>5 μg/m<sup>3</sup></h3> </div></div></div><div class="col-lg-4"> </div></div><div class="row"> <div class="col-lg-12"> <em>Fuente: <a target="_blank" href="https://www.wikiwand.com/es/Benceno">Wikipedia</a> y <a target="_blank" href="http://www.madrid.es/UnidadesDescentralizadas/Sostenibilidad/ContenidosBasicos/Ficheros/PlanCalidadAire2012.pdf">Ayuntamiento de Madrid</a></em> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button> </div></div></div></div><div class="modal fade" id="EBEModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="myModalLabel">Etilbenceno (C<sub>6</sub>H<sub>5</sub>CH<sub>2</sub>CH<sub>3</sub>)</h4> </div><div class="modal-body"> <div class="row"> <div class="col-lg-12"> <p>El etilbenceno es un líquido inflamable, incoloro, de olor similar a la gasolina. Se le encuentra en productos naturales tales como carbón y petróleo, como también en productos de manufactura como tinturas, insecticidas y pinturas.</p><p>El uso principal del etilbenceno es para fabricar otro producto químico, estireno y por la polimerización de éste se obtiene el poliestireno, que sirve en la fabricación de resinas, plásticos y hules. Otros usos incluyen como solvente, en combustibles, y en la manufactura de otros productos químicos.</p></div></div><div class="row"> <div class="col-lg-12"> <em>Fuente: <a target="_blank" href="https://www.wikiwand.com/es/Etilbenceno">Wikipedia</a></em> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button> </div></div></div></div><div class="modal fade" id="CH4Modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="myModalLabel">Metano (CH<sub>4</sub>)</h4> </div><div class="modal-body"> <div class="row"> <div class="col-lg-12"> <p>El metano es el hidrocarburo alcano más sencillo, cuya fórmula química es CH<sub>4</sub></p><p>El metano no es tóxico. Su principal peligro para la salud son las quemaduras que puede provocar si entra en ignición. Es altamente inflamable y puede formar mezclas explosivas con el aire. El metano reacciona violentamente con oxidantes, halógenos y algunos compuestos halogenados. El metano también es asfixiante y puede desplazar al oxígeno en un espacio cerrado. La asfixia puede sobrevenir si la concentración de oxígeno se reduce por debajo del 19,5 % por desplazamiento. Las concentraciones a las cuales se forman las barreras explosivas o inflamables son mucho más pequeñas que las concentraciones en las que el riesgo de asfixia es significativo. Si hay estructuras construidas sobre o cerca de vertederos, el metano desprendido puede penetrar en el interior de los edificios y exponer a los ocupantes a niveles significativos de metano. Algunos edificios tienen sistemas por debajo de sus cimientos para capturar este gas y expulsarlo del edificio.</p></div></div><div class="row"> <div class="col-lg-12"> <em>Fuente: <a target="_blank" href="https://www.wikiwand.com/es/Metano">Wikipedia</a></em> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button> </div></div></div></div><div class="modal fade" id="UVVModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title" id="myModalLabel">Radiación Ultravioleta (UV)</h4> </div><div class="modal-body"> <div class="row"> <div class="col-lg-12"> <p>La mayor parte de la radiación ultravioleta que llega a la Tierra lo hace en las formas UV-C, UV-B y UV-A; principalmente en esta última, a causa de la absorción por parte de la atmósfera terrestre. Estos rangos están relacionados con el daño que producen en el ser humano: la radiación UV-C (la más perjudicial para la vida) no llega a la tierra al ser absorbida por el oxígeno y el ozono de la atmósfera; la radiación UV-B es parcialmente absorbida por el ozono y solo llega a la superficie de la tierra en un porcentaje mínimo, pese a lo que puede producir daños en la piel.</p><p>Entre los daños que los rayos ultravioleta pueden provocar se incluyen el cáncer de piel, envejecimiento de ésta, irritación, arrugas, manchas o pérdida de elasticidad, así como afecciones a nivel ocular. También pueden desencadenar lupus eritematoso sistémico.</p><p>La radiación UV es altamente mutagénica, es decir, que induce a mutaciones. En el ADN provoca daño al formar dímeros de pirimidinas (generalmente dímeros de timina) que acortan la distancia normal del enlace, generando una deformación de la cadena.</p></div><div class="row"> <div class="col-lg-12"> <em>Fuente: <a target="_blank" href="http://www.wikiwand.com/es/Radiaci%C3%B3n_ultravioleta">Wikipedia</a></em> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button> </div></div></div></div>'
var allFooter = '<footer class="footer"> <div class="container"> <img height="30" src="img/logo_ulises.png"> <a class="pfooter pull-right" target="_blank" href="https://twitter.com/kom_256"><p class="pull-right fa fa-twitter-square"></p></a> <a class="pfooter pull-right" target="_blank" href="https://github.com/UlisesGascon"><p class="pull-right fa fa-github-square" ></p></a> </div></footer>';
var allConstruido_responsive = '<div class="row"><div class="col-lg-12"><center><a href="agradecimientos.html" target="_blank"><img src="img/construccion.png"></img></a></center></div></div>';
var allConstruido = '<div class="col-lg-3"></div><div class="col-lg-1"> <a href="https://www.raspberrypi.org/" target="_blank"><img class="img-responsive banda-inferior" src="img/raspi.png"></img></a> </div><div class="col-lg-1"> <a href="https://nodejs.org/" target="_blank"><img class="img-responsive banda-inferior" src="img/nodejs.png"></img></a> </div><div class="col-lg-1"> <a href="http://pillarsjs.com/" target="_blank"><img class="img-responsive banda-inferior" src="img/pillarsjs.png"></img></a> </div><div class="col-lg-1"> <a href="https://www.firebase.com/" target="_blank"><img class="img-responsive banda-inferior" src="img/firebase.png"></img></a> </div><div class="col-lg-1"> <a href="http://getbootstrap.com/" target="_blank"><img class="img-responsive banda-inferior" src="img/Bootstrap.svg"></img></a> </div><div class="col-lg-1"> <a href="https://cartodb.com/" target="_blank"><img class="img-responsive banda-inferior" src="img/cartodb.png"></img></a> </div><div class="col-lg-3"></div>';
var allDatos = '<div class="col-lg-2"></div><div class="col-lg-3"> <a href="http://www.madrid.es/portal/site/munimadrid" target="_blank"><img class="img-responsive" src="img/logo-madrid.png"></img></a> </div><div class="col-lg-2"> <a href="https://es.wikipedia.org/wiki/Wikipedia:Portada" target="_blank"><img id="img-wikipedia" class="img-responsive" src="img/rsz_1wikipedia-logo.jpg"></img></a> </div><div class="col-lg-3"> <a href="http://www.magrama.gob.es/es/" target="_blank"><img id="ministerio-MA" class="img-responsive" src="img/ministerio-medio-ambiente.jpg"></img></a> </div><div class="col-lg-2"></div>';
var allDatos_responsive = '<div class="row"><div class="col-lg-12"><center><a href="agradecimientos.html" target="_blank"><img src="img/datos.png"></img></a></center></div></div>'; 
var allEstaciones = '<div class="col-lg-2"></div><div class="col-lg-2"> <p><a href="28079004.html">Plaza de España</a></p><p><a href="28079008.html">Escuelas Aguirre</a></p><p><a href="28079011.html">Ramón y Cajal</a></p><p><a href="28079016.html">Arturo Soria</a></p><p><a href="28079017.html">Villaverde</a></p><p><a href="28079018.html">farolillo</a></p></div><div class="col-lg-2"> <p><a href="28079024.html">Casa de Campo</a></p><p><a href="28079027.html">Barajas </a></p><p><a href="28079035.html">Plaza del Carmen</a></p><p><a href="28079036.html">Moratalaz</a></p><p><a href="28079038.html">Cuatro Caminos</a></p><p><a href="28079039.html">Barrio del Pilar</a></p></div><div class="col-lg-2"> <p><a href="28079040.html">Vallecas</a></p><p><a href="28079047.html">Méndez Álvaro</a></p><p><a href="28079048.html">Castellana</a></p><p><a href="28079049.html">Parque del Retiro</a></p><p><a href="28079050.html">Plaza Castilla</a></p><p><a href="28079054.html">Ensanche de Vallecas</a></p></div><div class="col-lg-2"> <p><a href="28079055.html">Urbanización Embajada</a></p><p><a href="28079056.html">Plaza Fernández Ladreda</a></p><p><a href="28079057.html">Sanchinarro</a></p><p><a href="28079058.html">El Pardo</a></p><p><a href="28079059.html">Parque Juan Carlos I</a></p><p><a href="28079060.html">Tres Olivos</a></p></div><div class="col-lg-2"></div>';
var allContamintantesMedidos = '<p><a href="#" data-toggle="modal" data-target="#SO2Modal">Dióxido de Azufre (S0<sub>2</sub>):</a> <span id="SO2Valor"></span> μg/m<sup>3</sup> medido por <span id="MEDSO2Valor"></span></p><p><a href="#" data-toggle="modal" data-target="#COModal">Monóxido de Carbono (CO):</a> <span id="COValor"></span> μg/m<sup>3</sup> medido por <span id="MEDCOValor"></span></p><p><a href="#" data-toggle="modal" data-target="#NOModal">Monóxido de Nitrógeno (NO):</a> <span id="NOValor"></span> μg/m<sup>3</sup> medido por <span id="MEDNOValor"></span></p><p><a href="#" data-toggle="modal" data-target="#NO2Modal">Dióxido de Nitrógeno (NO<sub>2</sub>):</a> <span id="NO2Valor"></span> μg/m<sup>3</sup> medido por <span id="MEDNO2Valor"></span></p><p>Partículas en suspensión (&#60;2.5): <span id="PS25Valor"></span> μg/m<sup>3</sup> medido por <span id="MEDPS25Valor"></span></p><p>Partículas en suspensión (&#60;10): <span id="PS10Valor"></span> μg/m<sup>3</sup> medido por <span id="MEDPS10Valor"></span></p><p>Óxidos de Nitrógeno totales (NOx): <span id="NOXValor"></span> μg/m<sup>3</sup> medido por <span id="MEDNOXValor"></span></p><p><a href="#" data-toggle="modal" data-target="#O3Modal">Ozono (O<sub>3</sub>):</a> <span id="O3Valor"></span> μg/m<sup>3</sup> medido por <span id="MEDO3Valor"></span></p><p><a href="#" data-toggle="modal" data-target="#TOLModal">Tolueno (C<sub>6</sub>H<sub>5</sub>CH<sub>3</sub>):</a> <span id="TOLValor"></span> μg/m<sup>3</sup> medido por <span id="MEDTOLValor"></span></p><p><a href="#" data-toggle="modal" data-target="#BENModal">Benceno (C<sub>6</sub>H<sub>6</sub>):</a> <span id="BENValor"></span> μg/m<sup>3</sup> medido por <span id="MEDBENValor"></span></p><p><a href="#" data-toggle="modal" data-target="#EBEModal">Etilbenceno (C<sub>6</sub>H<sub>5</sub>CH<sub>2</sub>CH<sub>3</sub>):</a> <span id="EBEValor"></span> μg/m<sup>3</sup> medido por <span id="MEDEBEValor"></span></p><p>Hidrocarburos Totales (HC): <span id="HCValor"></span> μg/m<sup>3</sup> medido por <span id="MEDHCValor"></span></p><p><a href="#" data-toggle="modal" data-target="#CH4Modal">Metano (CH<sub>4</sub>):</a> <span id="CH4Valor"></span> μg/m<sup>3</sup> medido por <span id="MEDCH4Valor"></span></p><p>Hidrocarburos No Metánicos (NMH): <span id="NMHValor"></span> μg/m<sup>3</sup> medido por <span id="MEDNMHValor"></span></p>';
var allParametrosMetereologicos = '<p><a href="#" data-toggle="modal" data-target="#UVVModal">Radiación Ultravioleta (UV):</a> <span id="UVValor"></span> medido por <span id="MEDUVValor"></span></p><p>Velocidad del Viento (VV): <span id="VVValor"></span> Km/h medido por <span id="MEDVVValor"></span></p><p>Dirección del Viento (DD): <span id="DDValor"></span> medido por <span id="MEDDDValor"></span></p><p>Temperatura Media (TMP): <span id="TMPValor"></span>°C medido por <span id="MEDTMPValor"></span></p><p>Temperatura Mínima (TMI): <span id="TMIValor"></span>°C medido por <span id="MEDTMIValor"></span></p><p>Humedad Relativa (HR): <span id="HRValor"></span>% medido por <span id="MEDHRValor"></span></p><p>Presión Barométrica (PRB): <span id="PRBValor"></span> hPa medido por <span id="MEDPRBValor"></span></p>';
var allCabecera = '<div class="github-fork-ribbon-wrapper right"> <div class="github-fork-ribbon"> <a target="_blank" href="https://github.com/UlisesGascon/Aire-Madrid">Fork me on GitHub</a> </div></div><nav class="navbar navbar-inverse navbar-fixed-top"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="index.html">Aire Madrid</a> </div><div id="navbar" class="navbar-collapse collapse"> <ul class="nav navbar-nav"> <li class="active"><a href="index.html">Home</a></li><li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Estaciones <span class="caret"></span></a> <ul class="dropdown-menu"> <li><a href="28079004.html">Plaza de España</a></li><li><a href="28079008.html">Escuelas Aguirre</a></li><li><a href="28079011.html">Ramón y Cajal</a></li><li><a href="28079016.html">Arturo Soria</a></li><li><a href="28079017.html">Villaverde</a></li><li><a href="28079018.html">Farolillo</a></li><li><a href="28079024.html">Casa de Campo</a></li><li><a href="28079027.html">Barajas </a></li><li><a href="28079035.html">Plaza del Carmen</a></li><li><a href="28079036.html">Moratalaz</a></li><li><a href="28079038.html">Cuatro Caminos</a></li><li><a href="28079039.html">Barrio del Pilar</a></li><li><a href="28079040.html">Vallecas</a></li><li><a href="28079047.html">Méndez Álvaro</a></li><li><a href="28079048.html">Castellana</a></li><li><a href="28079049.html">Parque del Retiro</a></li><li><a href="28079050.html">Plaza Castilla</a></li><li><a href="28079054.html">Ensanche de Vallecas</a></li><li><a href="28079055.html">Urbanización Embajada</a></li><li><a href="28079056.html">Plaza Fernández Ladreda</a></li><li><a href="28079057.html">Sanchinarro</a></li><li><a href="28079058.html">El Pardo</a></li><li><a href="28079059.html">Parque Juan Carlos I</a></li><li><a href="28079060.html">Tres Olivos</a></li></ul> </li><li><a href="agradecimientos.html">Agradecimientos</a></li><li><a href="sobre.html">Sobre</a></li></ul> </div></div></nav>';

// Custom

var customEstaciones = '<div class="col-lg-3"> <p><a href="28079004.html">Plaza de España</a></p><p><a href="28079008.html">Escuelas Aguirre</a></p><p><a href="28079011.html">Ramón y Cajal</a></p><p><a href="28079016.html">Arturo Soria</a></p><p><a href="28079017.html">Villaverde</a></p><p><a href="28079018.html">farolillo</a></p></div><div class="col-lg-3"> <p><a href="28079024.html">Casa de Campo</a></p><p><a href="28079027.html">Barajas </a></p><p><a href="28079035.html">Plaza del Carmen</a></p><p><a href="28079036.html">Moratalaz</a></p><p><a href="28079038.html">Cuatro Caminos</a></p><p><a href="28079039.html">Barrio del Pilar</a></p></div><div class="col-lg-3"> <p><a href="28079040.html">Vallecas</a></p><p><a href="28079047.html">Méndez Álvaro</a></p><p><a href="28079048.html">Castellana</a></p><p><a href="28079049.html">Parque del Retiro</a></p><p><a href="28079050.html">Plaza Castilla</a></p><p><a href="28079054.html">Ensanche de Vallecas</a></p></div><div class="col-lg-3"> <p><a href="28079055.html">Urbanización Embajada</a></p><p><a href="28079056.html">Plaza Fernández Ladreda</a></p><p><a href="28079057.html">Sanchinarro</a></p><p><a href="28079058.html">El Pardo</a></p><p><a href="28079059.html">Parque Juan Carlos I</a></p><p><a href="28079060.html">Tres Olivos</a></p></div>';
var customCabecera = '<div class="github-fork-ribbon-wrapper right"> <div class="github-fork-ribbon"> <a target="_blank" href="https://github.com/UlisesGascon/Aire-Madrid">Fork me on GitHub</a> </div></div><nav class="navbar navbar-inverse navbar-fixed-top"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="index.html">Aire Madrid</a> </div><div id="navbar" class="navbar-collapse collapse"> <ul class="nav navbar-nav"> <li ><a href="index.html">Home</a></li><li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Estaciones <span class="caret"></span></a> <ul class="dropdown-menu"> <li><a href="28079004.html">Plaza de España</a></li><li><a href="28079008.html">Escuelas Aguirre</a></li><li><a href="28079011.html">Ramón y Cajal</a></li><li><a href="28079016.html">Arturo Soria</a></li><li><a href="28079017.html">Villaverde</a></li><li><a href="28079018.html">Farolillo</a></li><li><a href="28079024.html">Casa de Campo</a></li><li><a href="28079027.html">Barajas </a></li><li><a href="28079035.html">Plaza del Carmen</a></li><li><a href="28079036.html">Moratalaz</a></li><li><a href="28079038.html">Cuatro Caminos</a></li><li><a href="28079039.html">Barrio del Pilar</a></li><li><a href="28079040.html">Vallecas</a></li><li><a href="28079047.html">Méndez Álvaro</a></li><li><a href="28079048.html">Castellana</a></li><li><a href="28079049.html">Parque del Retiro</a></li><li><a href="28079050.html">Plaza Castilla</a></li><li><a href="28079054.html">Ensanche de Vallecas</a></li><li><a href="28079055.html">Urbanización Embajada</a></li><li><a href="28079056.html">Plaza Fernández Ladreda</a></li><li><a href="28079057.html">Sanchinarro</a></li><li><a href="28079058.html">El Pardo</a></li><li><a href="28079059.html">Parque Juan Carlos I</a></li><li><a href="28079060.html">Tres Olivos</a></li></ul> </li><li><a href="agradecimientos.html">Agradecimientos</a></li><li><a href="sobre.html">Sobre</a></li></ul> </div></div></nav>';


/* - FIN - TEMPLATES*/

/* ESTACIONES */

function getEstationInfo() {
$('#estacionNombre').html(estacionNombre);
$('#estacionNumero').html("Estación "+estacionNumero);
$('#estacionFoto').html('<img class="img-responsive" src="img/foto-estacion'+estacionNumero+'.jpg"></img>');
$('#estacionDireccion').html(estacionDireccion);
$('#estacionCodigo').html('<a target="_blank" href="'+estacionUrl+'">'+estacionCodigo+'</a>');
$('#estacionAltitud').html(estacionAltitud);
$('#estacionLatitud').html(unescape(estacionLatitud));
$('#estacionLongitud').html(unescape(estacionLongitud));
$('#estacionDireccion').html(estacionDireccion);
};

function getEstationtemplate() {
$('#allModals').html(allModals);
$('#allFooter').html(allFooter);
$('#allDatos').html(allDatos);
$('#allDatos_responsive').html(allDatos_responsive);
$('#customEstaciones').html(customEstaciones);
$('#customCabecera').html(customCabecera);
};


function getContamintantesMedidos () {

  if (SO2Enable) {
  	$('#customContamintantesMedidos').append('<p><a href="#" data-toggle="modal" data-target="#SO2Modal">Dióxido de Azufre (S0<sub>2</sub>):</a> <span id="SO2Valor"></span> μg/m<sup>3</sup> medido por <span id="MEDSO2Valor"></span></p>');
  	bringData(SO2Key, SO2elemento, SO2valor, SO2medidor);
  };
  if (COEnable) {
  	$('#customContamintantesMedidos').append('<p><a href="#" data-toggle="modal" data-target="#COModal">Monóxido de Carbono (CO):</a> <span id="COValor"></span> μg/m<sup>3</sup> medido por <span id="MEDCOValor"></span></p>');
  	bringData(COKey, COelemento, COvalor, COmedidor);
  };
  if (NOEnable) {
  	$('#customContamintantesMedidos').append('<p><a href="#" data-toggle="modal" data-target="#NOModal">Monóxido de Nitrógeno (NO):</a> <span id="NOValor"></span> μg/m<sup>3</sup> medido por <span id="MEDNOValor"></span></p>');
  	bringData(NOKey, NOelemento, NOvalor, NOmedidor);
  };
  if (NO2Enable) {
  	$('#customContamintantesMedidos').append('<p><a href="#" data-toggle="modal" data-target="#NO2Modal">Dióxido de Nitrógeno (NO<sub>2</sub>):</a> <span id="NO2Valor"></span> μg/m<sup>3</sup> medido por <span id="MEDNO2Valor"></span></p>');
  	bringData(NO2Key, NO2elemento, NO2valor, NO2medidor);
  };
  if (PS25Enable) {
  	$('#customContamintantesMedidos').append('<p>Partículas en suspensión (&#60;2.5): <span id="PS25Valor"></span> μg/m<sup>3</sup> medido por <span id="MEDPS25Valor"></span></p>');
  	bringData(PS25Key, PS25elemento, PS25valor, PS25medidor);
  };
  if (PS10Enable) {
  	$('#customContamintantesMedidos').append('<p>Partículas en suspensión (&#60;10): <span id="PS10Valor"></span> μg/m<sup>3</sup> medido por <span id="MEDPS10Valor"></span></p>');
  	bringData(PS10Key, PS10elemento, PS10valor, PS10medidor);
  };
  if (NOXEnable) {
  	$('#customContamintantesMedidos').append('<p>Óxidos de Nitrógeno totales (NOx): <span id="NOXValor"></span> μg/m<sup>3</sup> medido por <span id="MEDNOXValor"></span></p>');
  	bringData(NOXKey, NOXelemento, NOXvalor, NOXmedidor);
  };
  if (O3Enable) {
  	$('#customContamintantesMedidos').append('<p><a href="#" data-toggle="modal" data-target="#O3Modal">Ozono (O<sub>3</sub>):</a> <span id="O3Valor"></span> μg/m<sup>3</sup> medido por <span id="MEDO3Valor"></span></p>');
  	bringData(O3Key, O3elemento, O3valor, O3medidor);
  };
  if (TOLEnable) {
  	$('#customContamintantesMedidos').append('<p><a href="#" data-toggle="modal" data-target="#TOLModal">Tolueno (C<sub>6</sub>H<sub>5</sub>CH<sub>3</sub>):</a> <span id="TOLValor"></span> μg/m<sup>3</sup> medido por <span id="MEDTOLValor"></span></p>');
  	bringData(TOLKey, TOLelemento, TOLvalor, TOLmedidor);
  };
  if (BENEnable) {
  	$('#customContamintantesMedidos').append('<p><a href="#" data-toggle="modal" data-target="#BENModal">Benceno (C<sub>6</sub>H<sub>6</sub>):</a> <span id="BENValor"></span> μg/m<sup>3</sup> medido por <span id="MEDBENValor"></span></p>');
  	bringData(BENKey, BENelemento, BENvalor, BENmedidor);
  };
  if (EBEEnable) {
  	$('#customContamintantesMedidos').append('<p><a href="#" data-toggle="modal" data-target="#EBEModal">Etilbenceno (C<sub>6</sub>H<sub>5</sub>CH<sub>2</sub>CH<sub>3</sub>):</a> <span id="EBEValor"></span> μg/m<sup>3</sup> medido por <span id="MEDEBEValor"></span></p>');
  	bringData(EBEKey, EBEelemento, EBEvalor, EBEmedidor);
  };
  if (HCEnable) {
  	$('#customContamintantesMedidos').append('<p>Hidrocarburos Totales (HC): <span id="HCValor"></span> μg/m<sup>3</sup> medido por <span id="MEDHCValor"></span></p>');
  	bringData(HCKey, HCelemento, HCvalor, HCmedidor);
  };
  if (CH4Enable) {
  	$('#customContamintantesMedidos').append('<p><a href="#" data-toggle="modal" data-target="#CH4Modal">Metano (CH<sub>4</sub>):</a> <span id="CH4Valor"></span> μg/m<sup>3</sup> medido por <span id="MEDCH4Valor"></span></p>');
  	bringData(CH4Key, CH4elemento, CH4valor, CH4medidor);
  };
  if (NMHEnable) {
  	$('#customContamintantesMedidos').append('<p>Hidrocarburos No Metánicos (NMH): <span id="NMHValor"></span> μg/m<sup>3</sup> medido por <span id="MEDNMHValor"></span></p>');
  	bringData(NMHKey, NMHelemento, NMHvalor, NMHmedidor);
  };
};


function getParametrosMetereologicos () {

  if (UVEnable) {
  	$('#customParametrosMetereologicos').append('<p><a href="#" data-toggle="modal" data-target="#UVVModal">Radiación Ultravioleta (UV):</a> <span id="UVValor"></span> medido por <span id="MEDUVValor"></span></p>');
  	bringData(UVKey, UVelemento, UVvalor, UVmedidor);
  };
  if (VVEnable) {
  	$('#customParametrosMetereologicos').append('<p>Velocidad del Viento (VV): <span id="VVValor"></span> Km/h medido por <span id="MEDVVValor"></span></p>');
  	bringData(VVKey, VVelemento, VVvalor, VVmedidor);
  };
  if (DDEnable) {
  	$('#customParametrosMetereologicos').append('<p>Dirección del Viento (DD): <span id="DDValor"></span> medido por <span id="MEDDDValor"></span></p>');
  	bringDDData(DDKey, DDelemento, DDvalor, DDmedidor);
  };
  if (TMPEnable) {
  	$('#customParametrosMetereologicos').append('<p>Temperatura Media (TMP): <span id="TMPValor"></span>°C medido por <span id="MEDTMPValor"></span></p>');
  	bringData(TMPKey, TMPelemento, TMPvalor, TMPmedidor);
  };
  if (TMIEnable) {
  	$('#customParametrosMetereologicos').append('<p>Temperatura Mínima (TMI): <span id="TMIValor"></span>°C medido por <span id="MEDTMIValor"></span></p>');
  	bringData(TMIKey, TMIelemento, TMIvalor, TMImedidor);
  };
  if (HREnable) {
  	$('#customParametrosMetereologicos').append('<p>Humedad Relativa (HR): <span id="HRValor"></span>% medido por <span id="MEDHRValor"></span></p>');
  	bringData(HRKey, HRelemento, HRvalor, HRmedidor);
  };
  if (PRBEnable) {
  	$('#customParametrosMetereologicos').append('<p>Presión Barométrica (PRB): <span id="PRBValor"></span> hPa medido por <span id="MEDPRBValor"></span></p>');	
  	bringData(PRBKey, PRBelemento, PRBvalor, PRBmedidor);
  };
};



// Analytics 

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-65618670-1', 'auto');
  ga('send', 'pageview');
