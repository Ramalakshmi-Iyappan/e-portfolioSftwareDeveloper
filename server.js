const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

app.use(express.static(__dirname + '/public'));

wss.on('connection', (ws) => {
    console.log('A new client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        //Broadcast the message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN){
                client.send(message);
            }
        });

    });

    ws.on('close', () =>{
        console.log('A client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Sever started on http://localhost:3000');
})