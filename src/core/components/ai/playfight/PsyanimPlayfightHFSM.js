import PsyanimBasicHFSM from "../PsyanimBasicHFSM.js";

// import PsyanimPlayfightFSM from './PsyanimPlayfightFSM.js';
// import PsyanimPlayfightSeparationFSM from './PsyanimPlayfightSeparationFSM.js';

import PsyanimSensor from "../../physics/PsyanimSensor.js";

export default class PsyanimPlayfightHFSM extends PsyanimBasicHFSM {

    playfightFSM;
    separationFSM;

    constructor(entity) {

        super(entity);
    }

    afterCreate() {

        super.afterCreate();

        // add sub-state machines
        this.addSubStateMachine(this.playfightFSM);
        // this.addSubStateMachine(this.separationFSM);

        // add interrupts

        // TODO:

        // setup initial substate machine to run
        this.initialSubStateMachine = this.playfightFSM;

        this._sensor = this.entity.getComponent(PsyanimSensor);

        this._sensor.events.on('triggerEnter', (gameObject) => {
            console.log(this.entity.name, "onTriggerEnter detected!");
        });

        this._sensor.events.on('triggerExit', (gameObject) => {
            console.log(this.entity.name, 'onTriggerExit detected!');
        });
    }

    update(t, dt) {

        super.update(t, dt);
    }
}