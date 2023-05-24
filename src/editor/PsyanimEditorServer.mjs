import express from 'express';

export default class PsyanimEditorServer {

    constructor() {

        this.app = express();
        this.port = 3000;

        this._initHandlers();
    }

    _initHandlers() {

        this.app.use('/', express.static('./devdist'));

        this.app.get('/hello', (req, res) => {
            res.send('hello brave new world o/');
        });

        this.app.get('/test', (req, res) => {
            res.send('it works o/');
        });

        this.app.put('/data', (req, res) => {
            console.log("received req: " + req.body);
        });
    }

    start() {

        this.app.listen(this.port, () => {
            console.log('Psyanim Editor server listening on port: ' + this.port);
        });
    }
}