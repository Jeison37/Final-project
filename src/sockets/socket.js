const ws = require('ws');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const messageModel = require('../models/messages');
const { WS, ROL } = require('../utils/constants');
const chats = new Map();

function startWebSocketServer(serverPort) {
    const server = new ws.Server({ port: serverPort });
    server.on('connection', ws => {
    console.log('Cliente conectado');

        ws.on('message', async message => {
            console.log('message :>> ', message);
            try {

                const data = JSON.parse(message);
                const { _id , rol } = jwt.verify(data.token, process.env.JWT_KEY);

                if (data.type == WS.CREATE_CHAT) {
                    // Guardamos el ws del usuario con el id del chat yesperamos a que un tecnico se una al chat

                    chats.set(data.id_chat, new Map([[_id, ws]]));
                }

                if (data.type == WS.TECHNICIAN_CONNECTED && rol === ROL.TECHNICIAN) {
                    // Guardamos el ws del tecnico con el id del chat

                    const { id_chat } = data;

                    const chat = chats.get(id_chat);

                    // Mandamos un mensaje al lado del cliente para hacer saber que ya un tecnico se conecto al chat
                    const notification = {type: WS.TECHNICIAN_CONNECTED}

                    chat.forEach(client => {
                        if (client.readyState === ws.OPEN) {
                            client.send(JSON.stringify(notification));
                        }
                    });

                    if (chat){

                        if (chat.size < 2) {
                            
                            chat.set(_id, ws);

                        } else{
                            console.log("Ya hay un tecnico atendiendo el usuario de este chat");
                        }

                    }

                }

                if (data.type == WS.MESSAGE) {

                    const { id_chat,  text_message} = data;

                    const chat = users.get(id_chat);

                    if (chat) {
                        chat.forEach(client => {
                            if (client.readyState === ws.OPEN) {
                                client.send(JSON.stringify({ type: WS.MESSAGE, text_message, _id }));
                            }
                        });
                    }

                    // TODO: Guardamos el mensaje en la base de datos si no  es mejor hacerlo desde en controller de messages
                    messageModel.create({
                        id_chat,
                        id_usuario: _id,
                        contenido: text_message,
                    }).catch((error) => {
                        console.error('Error al guardar el mensaje:', error);
                        // Aquí puedes manejar el error, por ejemplo, reintentar o notificar al administrador
                    });
                }

            } catch (error) {

                console.log('error :>> ', error);
                
            }
                const b = Buffer.from(message);
                const messageString = b.toString();
                console.log('Mensaje recibido: ', messageString);

                
                // clients.forEach(client => {
                    // if (client !== ws && client.readyState === ws.OPEN) {
                    //     client.send(messageString);
                    // }
                // });
        });

        ws.on('close', () => {
            console.log('Cliente desconectado');
            chats.forEach((chat, id_chat) => {
                chat.forEach((client, userId) => {
                    if (client === ws) {
                        chat.delete(userId);
                        console.log(`Usuario ${userId} desconectado del chat ${id_chat}`);
                    }
                });
                if (chat.size === 0) {
                    chats.delete(id_chat); 
                }
            });
        });
    });
}

module.exports = { startWebSocketServer };