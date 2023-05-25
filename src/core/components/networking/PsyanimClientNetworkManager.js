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
    }

    close() {

        if (this._ws)
        {
            this._ws.close();
        }
    }

    sendBlob(data) {

        this._ws.binaryData = "blob";
        this._ws.send(data);
    }

    update(t, dt) {

        super.update(t, dt);

    }
}