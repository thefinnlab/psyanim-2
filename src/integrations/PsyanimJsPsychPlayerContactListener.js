import Phaser from 'phaser';

import PsyanimComponent from '../core/PsyanimComponent';

import PsyanimDebug from '../core/utils/PsyanimDebug';
import PsyanimApp from '../core/PsyanimApp';

export default class PsyanimJsPsychPlayerContactListener extends PsyanimComponent {

    sensor;

    constructor(entity) {

        super(entity);
    }

    afterCreate() {

        super.afterCreate();

        if (this.sensor)
        {
            this.sensor.events.on('triggerEnter', (entity) => {
                PsyanimApp.Instance.events.emit('killzoneEntered');
            });
        }
        else
        {
            PsyanimDebug.error("no sensor configured in PsyanimJsPsychListener");
        }
    }

    update(t, dt) {

        super.update(t, dt);
    }
}