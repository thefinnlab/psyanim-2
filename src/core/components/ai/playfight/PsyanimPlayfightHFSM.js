import PsyanimBasicHFSM from "../PsyanimBasicHFSM";

import PsyanimPlayfightFSM from './PsyanimPlayfightFSM';
import PsyanimPlayfightSeparationFSM from './PsyanimPlayfightSeparationFSM';

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
        this.addSubStateMachine(this.separationFSM);

        // add interrupts

        // TODO:

        // setup initial substate machine to run
        this.initialSubStateMachine = this.playfightFSM;
    }

    update(t, dt) {

        super.update(t, dt);
    }
}