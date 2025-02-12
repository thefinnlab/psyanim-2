import PsyanimComponent from "../../src/core/PsyanimComponent.js";

import PsyanimApp from "../../src/core/PsyanimApp.js";

import PsyanimSensor from "../../src/core/components/physics/PsyanimSensor.js";

import {
    PsyanimDebug
} from 'psyanim-utils';

export default class SensorTestManager extends PsyanimComponent {

    sensor1;

    sensor2;

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

        PsyanimApp.Instance.events.on('playerContact', this._handlePlayerContact, this);
    }

    onSensorEnter(entity) {

        super.onSensorEnter(entity);

        console.log(this.entity.name + ' has ENTERED', entity.name);
    }

    onSensorExit(entity) {

        super.onSensorExit(entity);

        console.log(this.entity.name + ' has EXITED', entity.name);
    }

    _handlePlayerContact(entity) {
        
        PsyanimDebug.log("player contact occured with entity named: '" + entity.name + "'");
    }

    update(t, dt) {

        super.update(t, dt);

        let scaleFactor = 1.15;

        // if (Phaser.Input.Keyboard.JustDown(this._keys.plus))
        // {
        //     this.sensor.scale(scaleFactor);
        // }
        // else if (Phaser.Input.Keyboard.JustDown(this._keys.minus))
        // {
        //     this.sensor.scale(1.0 / scaleFactor);
        // }
    }
}