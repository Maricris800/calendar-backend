const express = require("express");
const { dbConnection } = require("./database/config");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

//Crear el servidor de express 
const app = express();

//Base de Datos
dbConnection();

//CORS
app.use( cors() );

//Directorio Público
app.use( express.static("public") );

//Lectura y parseo del body
app.use( express.json() );

//Rutas
app.use( "/api/auth", require("./routes/auth") );
//TODO: CRUD: Eventos
app.use( "/api/events", require("./routes/events") );

app.use( /(.*)/ , ( req, res ) => {
    res.sendFile(  path.join( __dirname, "/public/index.html") );
});


//Escuchar peticiones 
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ 4000 }`);
});



