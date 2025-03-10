require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const { dbConnect } = require('./src/config/mongo'); 
const path = require('path');
const { auth } = require('./src/middlewares/auth');
const ws = require('ws');
const { startWebSocketServer } = require('./src/sockets/socket');

dbConnect(); 

const PORT = process.env.PORT || 3000; 

const WS_PORT = 8080;

app.use(cors()); 
app.use(express.json()); 

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api', require('./src/routes'));

app.listen(PORT, ()=>{
  console.log("La api esta lista...");
  console.log(`Servidor corriento en http://localhost:${PORT}`);
  startWebSocketServer(WS_PORT);
});


// // Conjunto para almacenar todos los clientes conectados
// const clients = new Set();

// server.on('connection', (ws) => {
//   console.log('Cliente conectado');
//   clients.add(ws); // Agrega el cliente al conjunto

//   ws.on('message', (message) => {
//     const b = Buffer.from(message);
//     const messageString = b.toString();
//     console.log('Mensaje recibido: ', messageString);

//     // Transmite el mensaje a todos los clientes conectados
//     clients.forEach(client => {
//       if (client !== ws && client.readyState === ws.OPEN) {
//         client.send(messageString);
//       }
//     });
//   });

//   ws.on('close', () => {
//     console.log('Cliente desconectado');
//     clients.delete(ws); // Elimina el cliente del conjunto
//   });
// });
