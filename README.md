# Aire-Madrid

[Aire Madrid](https://airemadrid.firebaseapp.com) es una aplicación para poder ver los datos de la calidad del Aire de Madrid en tiempo real.

Este proyecto es una extensión de un post que publique hace unos meses en [mi blog](http://www.blog.ulisesgascon.com/) sobre la [posibilidad de utilizar datos abiertos](http://www.blog.ulisesgascon.com/la-iniciativa-del-open-data/) facilitados por parte de las diversas instituciones en España.

![AireMadrid Captura](https://airemadrid.firebaseapp.com/img/airemadrid_captura.png)
        
## Objetivo:
El objetivo de esta web es mostrar los datos que ofrece el ayuntamiento de Madrid a través de su portal de datos abiertos sobre la calidad del aire en tiempo real de una manera fácil y comprensible por un usuario no técnico.

### Obtención de datos:

Los datos en los que se basa esta aplicación son obtenidos directamente de un archivo .txt totalmente plano. 
[La última versión oficial](http://datos.madrid.es/egob/catalogo/212531-7916318-calidad-aire-tiempo-real.txt)

### Análisis y enriquecimiento de datos:

Los datos en el estado original no son de gran utilidad para el público en general. 

La información es descargada y se enriquece de manera transparente. 
[Detalles sobre el enriquecimiento](https://github.com/UlisesGascon/Aire-Madrid/tree/master/server/datos.md)

Una vez los datos están listos, cada hora se suben a [esta base de datos no relacional alojada en Firebase](https://airemadrid.firebaseio.com/).

### Lectura de datos:

Los datos de la base de datos son descargados en [este portal](https://airemadrid.firebaseapp.com/) donde se muestran al público divido entre el resumen (datos media de la red) y las estaciones.
[Detalles sobre la lectura](https://github.com/UlisesGascon/Aire-Madrid/tree/master/firebase/lectura.md)

*Nota:* Algunas estaciones presentan pocos datos, y algunos datos clave de la media como la temperatura máxima no están presentes. En estos momentos estoy intentando notificar estas deficiencias al portal de datos abiertos a la espera de mejorar la cantidad y calidad de los datos ofrecidos.        
        
        
### Colaboración:
Este proyecto está abierto a colaboración y mejora por parte de cualquier persona interesada. No dudes en ponerte en contacto conmigo a través de este repositorio o mi [cuenta de Twitter](https://twitter.com/kom_256).
        
        
        
        
        
        