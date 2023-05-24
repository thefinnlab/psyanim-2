import express from 'express';

export default class PsyanimEditorServer {

    constructor() {

        this.app = express();
        this.port = 3000;

        this._initHandlers();
    }

    _initHandlers() {

        this.app.get('/', (req, res) => {
            res.send('hello world again o/');
        });
    }

    start() {

        this.app.listen(this.port, () => {
            console.log(`Editor listening on port ${this.port}`);
        });
    }
}