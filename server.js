const express = require('express');
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer} = require('http');
const exphbs = require("express-handlebars");


const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer);

const PORT = 8080 || process.env.PORT;

let productos = {}
app.engine(
    "hbs",
    exphbs.engine(
        {
            extname: "hbs",
            defaultLayout: 'index.hbs',
        }
    )
)

app.set('views','./views');
app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true
    }))
app.get('/', (req, res) => {
    res.render('datos.hbs');
})

io.on('connection', (socket) => {
    console.log("Usuario conectado");
    socket.emit('Bienvenido','Hola usuario.')
    socket.on('producto', data => {
        productos = {
            socketid: socket.id,
            title: data.title,
            price: data.price,
            url: data.url,
        }
        io.sockets.emit('productos', productos);
    })
    socket.on('usuario', data => {
        io.sockets.emit('usuarios', data);
    })
    socket.on('mensaje', data => {
        io.sockets.emit('mensajes', data);
    })
})

const connectedServer = httpServer.listen(PORT, function () {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`);
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))