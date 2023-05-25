import express from 'express';
import path from 'path';
import fs from 'fs';

import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';

import bodyParser from 'body-parser';

export default class PsyanimEditorServer {

    constructor() {

        this.app = express();
        this.port = 3000;

        this._initHandlers();
    }

    _initHandlers() {

        this.app.use(express.json());

        this.app.use('/', express.static('./devdist'));
    }

    start() {

        let server = this.app.listen(this.port, () => {
            console.log('Psyanim Editor server listening on port: ' + this.port);
        });

        this.wss = new WebSocketServer({ server });

        this.wss.on('connection', (ws) => {

            ws.on('message', (msg) => {
                console.log("message received!");
                console.log(msg);
            });

            console.log("received client connection!");
        });
    }
}