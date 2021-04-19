# REST API Boilerplate de NodeJs + Mongo

A continuación se detallan las características principales de la aplicación.

* Stack tecnológico usado: NodeJs + Express + MongoDB.
* La aplicación se estructura en capas (models, routes, controllers, utils y test).
* La configuración de la aplicación está definida en app.js.
* El servidor está definido en server.js.
* Los modelos incluyen validaciones de mongoose.
* El modelo usuario incluye un hook "pre" para hashear la contraseña.
* Para evitar el try catch en los controladores se ha creado el middleware async.js.
* La conexión con la base de datos está en config/db.js.
* Los controladores se pueden proteger por autentificación y por roles usando el middleware auth.
* Se ha usado los paquetes helmet, xss-clean, hpp y express-mongo-sanitize para la seguridad.
* Se ha limitado el número de peticiones que pueden atenderse usando express-rate-limit.
* Se han desarrollado tests unitarios y de integración usando Jest.
* Existe un middleware llamado logger (usa winston) que arroja las peticiones a la consola y a un fichero.
* Existen 3 ambientes (test, production y development).
* La documentación se ha desarrollado con Swagger.
* La paginación, filtrado y ordenación está encapsulada en utils/Features.js.