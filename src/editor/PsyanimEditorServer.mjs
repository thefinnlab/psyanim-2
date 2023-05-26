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

    _getNextValidVideoFilePath() {

        // TODO: make this configurable by client
        let rootDirName = "./experiments/videos";
        let subdirName = "playfight";
        let filenameBase = "playfight";
        let filenameExt = ".webm";

        let filenameIndex = 1;

        // TODO: make sure the directories exist!

        // use string.prototype.padStart(3, '0') to pad with zeroes
        let filePath = rootDirName + "/" + subdirName + "/"
            + filenameBase + (filenameIndex.toString().padStart(3, '0'))
            + filenameExt;

        while (fs.existsSync(filePath))
        {
            filenameIndex++;

            filePath = rootDirName + "/" + subdirName + "/"
                + filenameBase + (filenameIndex.toString().padStart(3, '0'))
                + filenameExt;
        }

        return filePath;
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

                let buffer = Buffer.from(msg, 'binary');

                let filePath = this._getNextValidVideoFilePath();

                fs.writeFile(filePath, buffer, (err) => {
                    
                });
            });

            console.log("received client connection!");
        });
    }
}