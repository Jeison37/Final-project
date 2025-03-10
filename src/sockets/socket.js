const ws = require('ws');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const messageModel = require('../models/messages');
const { WS, ROL } = require('../utils/constants');
const users = new Map();

function startWebSocketServer(serverPort) {
    const server = new ws.Server({ port: serverPort });
    server.on('connection', ws => {
    console.log('Cliente conectado');


    ws.on('message', async message => {
        console.log('message :>> ', message);
        try {

            const data = JSON.parse(message);

            if (data.type == WS.CREATE_CHAT) {
                // Guardamos el ws del usuario con el id del chat yesperamos a que un tecnico se una al chat
                                
                const token = req.headers['authorization'];
                const { _id } = jwt.verify(token, process.env.JWT_KEY);

                users.set(data.id_chat, ws);
            }

            if (data.type == WS.TECHNICIAN_CONNECTED) {
                // Guardamos el ws del tecnico y el ws del usuario con el id del chat

                const token = req.headers['authorization'];
                const { _id , rol } = jwt.verify(token, process.env.JWT_KEY);

                if (rol == ROL.TECHNICIAN) {

                    const { id_chat, id_usuario } = data;

                    const ws_user = users.get(id_chat);

                    users.set(id_chat, {_id: ws, [id_usuario]: ws_user});
                }



            }

            if (data.type == WS.MESSAGE) {
                const token = req.headers['authorization'];
                const { _id } = jwt.verify(token, process.env.JWT_KEY);

                const { id_chat,  text_message} = data;

                const ws_chat = users.get(id_chat);

                if (ws_chat) {
                    ws_chat[_id].send(text_message);
                }

                // TODO: Guardamos el mensaje en la base de datos
            }

        } catch (error) {
            
        }
            const b = Buffer.from(message);
            const messageString = b.toString();
            console.log('Mensaje recibido: ', messageString);

            
            clients.forEach(client => {
            if (client !== ws && client.readyState === ws.OPEN) {
                client.send(messageString);
            }
            });
        });

        ws.on('close', () => {
            console.log('Cliente desconectado');
            clients.delete(ws); 
        });
        });
}

module.exports = { startWebSocketServer };