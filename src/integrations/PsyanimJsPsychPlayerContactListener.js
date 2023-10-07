import PsyanimComponent from '../core/PsyanimComponent.js';

import PsyanimDebug from '../core/utils/PsyanimDebug.js';
import PsyanimApp from '../core/PsyanimApp.js';

export default class PsyanimJsPsychPlayerContactListener extends PsyanimComponent {

    targetEntityNames;

    sensor;

    constructor(entity) {

        super(entity);

        this.targetEntityNames = [];
    }

    afterCreate() {

        super.afterCreate();

        if (this.sensor)
        {
            this.sensor.events.on('triggerEnter', (entity) => {

                if (this.targetEntityNames.includes(entity.name))
                {
                    PsyanimApp.Instance.events.emit('playerContact', entity);                    
                }
            });
        }
        else
        {
            PsyanimDebug.error("no sensor configured in PsyanimJsPsychContactListener");
        }
    }

    update(t, dt) {

        super.update(t, dt);
    }
}