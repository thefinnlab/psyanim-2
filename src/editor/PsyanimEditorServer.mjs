import express from 'express';
import path from 'path';
import fs from 'fs';

export default class PsyanimEditorServer {

    constructor() {

        this.app = express();
        this.port = 3000;

        this._initHandlers();
    }

    _initHandlers() {

        this.app.use(express.json());
        this.app.use('/', express.static('./devdist'));

        this.app.post('/data', (req, res) => {

            console.log("received req: " + req.body.message);

            let outputFileName = 'video1.webm';
            let outputFilePath = path.resolve('./experiments/videos/' + outputFileName);

            fs.writeFile(outputFilePath, req.body.message, (err) => {

                if (err) {
                    console.log(err);
                }

                console.log("successfully wrote post body to file!");
            });
        });
    }

    start() {

        this.app.listen(this.port, () => {
            console.log('Psyanim Editor server listening on port: ' + this.port);
        });
    }
}