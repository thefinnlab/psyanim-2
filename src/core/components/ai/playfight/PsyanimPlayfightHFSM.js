import PsyanimBasicHFSM from "../PsyanimBasicHFSM.js";

import PsyanimPlayfightFSM from './PsyanimPlayfightFSM.js';
import PsyanimPlayfightSeparationFSM from './PsyanimPlayfightSeparationFSM.js';

import PsyanimSensor from "../../physics/PsyanimSensor.js";

export default class PsyanimPlayfightHFSM extends PsyanimBasicHFSM {

    playfightFSM;
    separationFSM;

    maxSeparationDuration;

    maxSeparationSpeed;
    maxSeparationAcceleration;

    debug;

    constructor(entity) {

        super(entity);

        this.maxSeparationDuration = 100;

        this.maxSeparationSpeed = 12;
        this.maxSeparationAcceleration = 0.5;

        this.debug = false;
    }

    afterCreate() {

        super.afterCreate();

        // add sub-state machines
        this.addSubStateMachine(this.playfightFSM);
        this.addSubStateMachine(this.separationFSM);

        this.playfightFSM.debug = this.debug;
        this.separationFSM.debug = this.debug;

        this.separationFSM.setMaxSeparationSpeed(this.maxSeparationSpeed);
        this.separationFSM.setMaxSeparationAcceleration(this.maxSeparationAcceleration);

        // add interrupts
        this.addInterrupt(PsyanimPlayfightFSM, 'chargeContact', 
            value => value === true, 
            PsyanimPlayfightSeparationFSM);

        this.addInterrupt(PsyanimPlayfightSeparationFSM, 'separationTimer', 
            value => value >= this.maxSeparationDuration);

        // setup initial substate machine to run
        this.initialSubStateMachine = this.playfightFSM;

        this._sensor = this.entity.getComponent(PsyanimSensor);
    }

    update(t, dt) {

        super.update(t, dt);
    }
}