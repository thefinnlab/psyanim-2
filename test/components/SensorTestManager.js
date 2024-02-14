import PsyanimComponent from "../../src/core/PsyanimComponent.js";

import PsyanimApp from "../../src/core/PsyanimApp.js";

import {
    PsyanimDebug
} from 'psyanim-utils';

export default class SensorTestManager extends PsyanimComponent {

    // TODO: this was working fine before, w/ only a single event fired on enter + exit...
    // so something has likely changed here.  let's figure out what it is.

    sensor;

    constructor(entity) {

        super(entity);

        this._keys = {
            plus: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS),
            minus: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS)
        };
    }

    destroy() {

        PsyanimApp.Instance.events.off('playerContact', this._handlePlayerContact, this);

        super.destroy();
    }

    afterCreate() {

        super.afterCreate();

        this.sensor.events.on('triggerEnter', (entity) => {

            console.log(entity.name + ' has ENTERED the building');
        });

        this.sensor.events.on('triggerExit', (entity) => {

            console.log(entity.name + ' has EXITED the building');
        });

        console.log('sensor body = ', this.sensor);

        PsyanimApp.Instance.events.on('playerContact', this._handlePlayerContact, this);
    }

    _handlePlayerContact(entity) {
        
        PsyanimDebug.log("player contact occured with entity named: '" + entity.name + "'");
    }

    update(t, dt) {

        super.update(t, dt);

        let scaleFactor = 1.15;

        if (Phaser.Input.Keyboard.JustDown(this._keys.plus))
        {
            this.sensor.scale(scaleFactor);
        }
        else if (Phaser.Input.Keyboard.JustDown(this._keys.minus))
        {
            this.sensor.scale(1.0 / scaleFactor);
        }
    }
}