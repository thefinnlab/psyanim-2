import PsyanimComponent from "../../src/core/PsyanimComponent";

import PsyanimApp from "../../src/core/PsyanimApp";

import PsyanimDebug from "../../src/core/utils/PsyanimDebug";

export default class SensorTestManager extends PsyanimComponent {

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
            console.log(entity.name + ' has ENTERED the building...');
        });

        this.sensor.events.on('triggerExit', (entity) => {
            console.log(entity.name + ' has EXITED the building...');
        });

        PsyanimApp.Instance.events.on('playerContact', this._handlePlayerContact, this);
    }

    _handlePlayerContact(entity) {
        
        PsyanimDebug.log("player contact occured with entity named: '" + entity.name + "'");
    }
}