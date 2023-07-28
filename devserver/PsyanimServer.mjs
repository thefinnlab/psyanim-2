import express from 'express';
import fs from 'fs';
import path from 'path';

import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';

import bodyParser from 'body-parser';

export default class PsyanimServer {

    constructor() {

        this.app = express();
        this.port = 3000;

        this._initHandlers();

        this._videoSaveConfig = {

            rootDirPath: "./experiments/videos",
            subdirName: "unknown",
            filenameBase: "unknown",
            filenameExt: ".webm"
        };
    }

    _initHandlers() {

        this.app.use(express.json());

        this.app.use('/', express.static('./dist'));

        this.app.post('/delete-videos', (req, res) => {

            console.log("Deleting all videos!");

            let rootDirPath = this._videoSaveConfig.rootDirPath;
            let subdirName = this._videoSaveConfig.subdirName;
    
            let directoryPath = rootDirPath + "/" + subdirName;

            fs.readdir(directoryPath, (err, files) => {
                
                if (err) 
                {
                    console.log("ERROR deleting videos" + err);
                }

                files.forEach(file => {

                    fs.unlink(path.join(directoryPath, file), (err) => {

                        if (err)
                        {
                            console.log("ERROR unlinking file: " + err);
                        }
                    });
                });
            });

            res.sendStatus(200);
        });

        this.app.post('/video-save-path', (req, res) => {

            console.log("received video config: " + JSON.stringify(req.body));

            let videoSaveConfig = req.body;

            if (Object.hasOwn(videoSaveConfig, 'rootDirPath'))
            {
                this._videoSaveConfig.rootDirPath = videoSaveConfig.rootDirPath;
            }

            if (Object.hasOwn(videoSaveConfig, 'subdirName'))
            {
                this._videoSaveConfig.subdirName = videoSaveConfig.subdirName;
            }

            if (Object.hasOwn(videoSaveConfig, 'filenameBase'))
            {
                this._videoSaveConfig.filenameBase = videoSaveConfig.filenameBase;
            }

            res.sendStatus(200);
        });
    }

    _getNextValidVideoFilePath() {

        let rootDirPath = this._videoSaveConfig.rootDirPath;
        let subdirName = this._videoSaveConfig.subdirName;
        let filenameBase = this._videoSaveConfig.filenameBase;
        let filenameExt = this._videoSaveConfig.filenameExt;

        let filenameIndex = 1;

        // TODO: make sure the directories exist!

        let filePath = rootDirPath + "/" + subdirName + "/"
            + filenameBase + (filenameIndex.toString().padStart(3, '0'))
            + filenameExt;

        while (fs.existsSync(filePath))
        {
            filenameIndex++;

            filePath = rootDirPath + "/" + subdirName + "/"
                + filenameBase + (filenameIndex.toString().padStart(3, '0'))
                + filenameExt;
        }

        return filePath;
    }

    start() {

        let server = this.app.listen(this.port, () => {
            console.log('Psyanim server listening on port: ' + this.port);
        });

        this.wss = new WebSocketServer({ server });

        this.wss.on('connection', (ws) => {

            ws.on('message', (msg) => {

                let buffer = Buffer.from(msg, 'binary');

                let filePath = this._getNextValidVideoFilePath();

                fs.writeFile(filePath, buffer, (err) => {
                    
                });
            });

            console.log("received client connection!");
        });
    }
}