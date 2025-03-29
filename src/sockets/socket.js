const ws = require('ws');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const messageModel = require('../models/messages');
const { WS, ROL } = require('../utils/constants');
const chats = new Map();
const technicians = new Map();

function startWebSocketServer(serverPort) {
    const server = new ws.Server({ port: serverPort });
    server.on('connection', ws => {
    console.log('Cliente conectado');

        ws.on('message', async message => {
            const b = Buffer.from(message);
            const messageString = b.toString();
            console.log('Mensaje recibido: ', messageString);
            try {

                const data = JSON.parse(messageString);
                console.log('data :>> ', data);
                const token = data.token;

                    if(!token){
                      return 
                    };
                
                    if (!jwt.decode(token)) {
                      return
                    }


                const { _id , rol } = jwt.verify(token, process.env.JWT_KEY);

                if (data.type == WS.TECHNICIAN_AVAILABLE){
                    console.log("tecnico disponible");
                    technicians.set(_id, ws);
                    // console.log('technicians :>> ', technicians);
                }

                if (data.type == WS.TECHNICIAN_UNAVAILABLE){
                    console.log("tecnico no disponible");
                    technicians.delete(_id);
                }

                console.log('data.type == WS.CREATE_CHAT,data.type, WS.CREATE_CHAT :>> ', data.type == WS.CREATE_CHAT,data.type, WS.CREATE_CHAT);
                if (data.type == WS.CREATE_CHAT) {
                    console.log("Chat creado", technicians.size);
                    // Guardamos el ws del usuario con el id del chat y esperamos a que un tecnico se una al chat

                    chats.set(data.id_chat, new Map([[_id, ws]]));

                    const notification = {type: WS.CREATE_CHAT}

                    technicians.forEach(client => {
                        console.log('client :>> ', client);
                        if (client.readyState === ws.OPEN) {
                            console.log("Tecnico notificado");
                            client.send(JSON.stringify(notification));
                        }
                    })
                }

                if (data.type == WS.TECHNICIAN_CONNECTED && rol === ROL.TECHNICIAN) {
                    console.log("Tecnico conectado a un chat");
                    // console.log('chats :>> ', chats);
                    // Guardamos el ws del tecnico con el id del chat

                    const { id_chat } = data;

                    const chat = chats.get(id_chat);


                    // Mandamos un mensaje al lado del cliente para hacer saber que ya un tecnico se conecto al chat
                    const notification = {type: WS.TECHNICIAN_CONNECTED}

                    technicians.forEach(client => {
                        if (client.readyState === ws.OPEN && client !== ws) {
                            client.send(JSON.stringify(notification));
                        }
                    })

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
                    console.log('chats :>> ', chats);
                    const { id_chat,  text_message} = data;

                    const chat = chats.get(id_chat);

                    if (chat) {
                        chat.forEach(client => {
                            if (client.readyState === ws.OPEN) {
                                client.send(JSON.stringify({ type: WS.MESSAGE, text_message, user: _id }));
                            }
                        });
                    }

                    // Guardamos el mensaje en la base de datos 
                    messageModel.create({
                        id_chat,
                        id_usuario: _id,
                        contenido: text_message,
                    }).catch((error) => {
                        console.error('Error al guardar el mensaje:', error);
                        
                    });
                }

            } catch (error) {

                console.log('error :>> ', error);
                
            }


                
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