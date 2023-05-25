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

        this.httpServer = this.app.listen(this.port, () => {
            console.log('Psyanim Editor server listening on port: ' + this.port);
        });
    }
}