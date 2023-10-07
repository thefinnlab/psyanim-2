import Phaser from 'phaser';

import PsyanimComponent from '../../core/PsyanimComponent.js';

class MySingleton {

    static get Instance() {

        if (MySingleton._instance == null)
        {
            MySingleton._instance = new MySingleton();
        }

        return MySingleton._instance;
    }

    static _instance = null;

    data = 0;
}

export default class PsyanimSingletonTest extends PsyanimComponent {

    constructor(entity) {

        super(entity);

        this._keys = {
            I: this.entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
            O: this.entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)
        };
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._keys.I))
        {
            MySingleton.Instance.data++;
            console.log("singleton data = " + MySingleton.Instance.data);
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.O))
        {
            console.log("singleton data = " + MySingleton.Instance.data);
        }
    }
}