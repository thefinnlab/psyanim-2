import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimClientNetworkManager extends PsyanimComponent {

    host = "localhost";
    port = 3000;

    constructor(entity) {

        super(entity);
    }

    connect(host = null, port = null) {

        if (host)
        {
            this.host = host;
        }

        if (port)
        {
            this.port = port;
        }

        this._ws = new WebSocket("ws://" + this.host + ":" + this.port);
        this._ws.binaryType = "blob";
    }

    disconnect() {

        if (this._ws)
        {
            this._ws.close();
            this._ws = null;
        }
    }

    doPost(path, data) {

        let xhttp = new XMLHttpRequest();
        xhttp.open('POST', path);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(data);
    }

    sendBlob(data) {

        this._ws.send(data);
    }

    update(t, dt) {

        super.update(t, dt);

    }
}