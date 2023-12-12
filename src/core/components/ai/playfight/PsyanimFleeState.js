import PsyanimFSMState from '../PsyanimFSMState.js';

import { PsyanimDebug } from 'psyanim-utils';

export default class PsyanimPlayfightFleeState extends PsyanimFSMState {

    constructor(fsm) {

        super(fsm);

        this.fsm.setStateVariable('charge', 0);

        /**
         *  Setup transitions here
         */
    }

    afterCreate() {

    }

    enter() {

        super.enter();
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run();

    }
}