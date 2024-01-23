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
    }

    destroy() {

        PsyanimApp.Instance.events.off('playerContact', this._handlePlayerContact, this);

        super.destroy();
    }

    afterCreate() {

        super.afterCreate();

        this.sensor.events.on('triggerEnter', (entity) => {

            console.log(entity.name + ' has ENTERED the building at position =', 
                this.sensor.entity.position);
        });

        this.sensor.events.on('triggerExit', (entity) => {

            console.log(entity.name + ' has EXITED the building at position =',
                this.sensor.entity.position);
        });

        console.log('body collision filter group = ', this.sensor.entity.body.collisionFilter.group);

        PsyanimApp.Instance.events.on('playerContact', this._handlePlayerContact, this);
    }

    _handlePlayerContact(entity) {
        
        PsyanimDebug.log("player contact occured with entity named: '" + entity.name + "'");
    }
}