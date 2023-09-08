import PsyanimComponent from "../../src/core/PsyanimComponent";

import PsyanimApp from "../../src/core/PsyanimApp";

import PsyanimDebug from "../../src/core/utils/PsyanimDebug";

export default class SensorTestManager extends PsyanimComponent {

    sensor;

    constructor(entity) {

        super(entity);
    }

    afterCreate() {

        super.afterCreate();

        this.sensor.events.on('triggerEnter', (entity) => {
            console.log(entity.name + ' has ENTERED the building...');
        });

        this.sensor.events.on('triggerExit', (entity) => {
            console.log(entity.name + ' has EXITED the building...');
        });

        PsyanimApp.Instance.events.on('killzoneEntered', this._handleKillzoneEntered.bind(this));
    }

    _handleKillzoneEntered() {
        
        PsyanimDebug.log('killzone entered! player has gone to a better place o/');
    }
}