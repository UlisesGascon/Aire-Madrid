# Análisis y enriquecimiento de datos:

Los datos en el estado original son un txt plano, para su interpretación existe [una guia](http://datos.madrid.es/FWProjects/egob/contenidos/datasets/ficheros/Interprete%20para%20horarios%20tiempo%20real.pdf)

Cada registro se separa del siguiente por una coma y cada bloque se separa por un salto de línea.

##Datos por posición:

1. Este dato es la Comunidad Autonoma 

    *28 es la Comunidad Autonoma de Madrid*

2. Este dato es la ciudad

    *079 es Madrid*

3. Este dato es el Número de Estación

    *4 es Plaza de España*
    *8 es Escuelas Aguirre*
    *11 es Ramón y Cajal*
    *16 es Arturo Soria*
    *17 es Villaverde*
    *18 es Farolillo*
    *24 es Casa de Campo*
    *27 es Barajas*
    *35 es Plaza del Carmen*
    *36 es Moratalaz*
    *38 es Cuatro Caminos*
    *39 es Barrio del Pilar*
    *40 es Vallecas*
    *47 es Méndez Álvaro*
    *48 es Castellana*
    *49 es Parque del Retiro*
    *50 es Plaza Castilla*
    *54 es Ensanche de Vallecas*
    *55 es Urbanización Embajada*
    *56 es Plaza Fernández Ladreda*
    *57 es Sanchinarro*
    *58 es El Pardo*
    *59 es Parque Juan Carlos I*
    *60 es Tres Olivos*
    *99 es Media de la red (no una estación real)*

4. Este dato es el Parámetro

    *1 es DIÓXIDO DE AZUFRE*
    *6 es MONÓXIDO DE CARBONO*
    *7 es MONÓXIDO DE NITRÓGENO*
    *8 es DIÓXIDO DE NITRÓGENO*
    *9 es PARTÍCULAS EN SUSPENSIÓN menores a 2.5*
    *10 es PARTÍCULAS EN SUSPENSIÓN menores a 10*
    *12 es ÓXIDOS DE NITRÓGENO TOTALES*
    *14 es OZONO*
    *20 es TOLUENO*
    *30 es BENCENO*
    *35 es ETILBENCENO*
    *42 es HIDROCARBUROS TOTALES (EXANO)*
    *43 es METANO*
    *44 es HIDROCARBUROS NO METÁNICOS*
    *80 es RADIACIÓN ULTRAVIOLETA*
    *81 es VELOCIDAD DE VIENTO*
    *82 es DIRECCIÓN DE VIENTO*
    *83 es TEMPERATURA MEDIA*
    *84 es TEMPERATURA MÁXIMA*
    *85 es TEMPERATURA MINIMA*
    *86 es HUMEDAD RELATIVA*
    *87 es PRESIÓN BAROMÉTRICA* 

5. Este dato es la técnica analítica

    *2 es IONIZACIÓN DE LLAMA*
    *6 es ABSORCIÓN ULTRAVIOLETA*
    *8 es QUIMIOLUMINISCENCIA*
    *38 es FLUORESCENCIA ULTRAVIOLETA*
    *47 es MICROBALANZA*
    *48 es ABSORCIÓN INFRARROJA*
    *59 es CROMATOGRAFÍA DE GASES*
    *98 es SENSOR METEOROLOGICO* 


6. Este dato es el periodo de análisis

    *2 es horario*

7. Este dato es el Año (fecha) en formato YYYY
8. Este dato es el Mes (fecha) en formato MM
9. Este dato es el Día (fecha) en formato DD
10+. Estos son los datos cada hora. Valor y Estado. Empezando por la hora 0 hasta la 23