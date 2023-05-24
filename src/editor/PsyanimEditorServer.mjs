import express from 'express';

export default class PsyanimEditorServer {

    constructor() {

        this.app = express();
        this.port = 3000;

        this._initHandlers();
    }

    _initHandlers() {

        this.app.get('/', (req, res) => {
            res.send('hello brave new world o/');
        });
    }

    start() {

        this.app.listen(this.port, () => {
            console.log('Psyanim Editor server listening on port: ' + this.port);
        });
    }
}