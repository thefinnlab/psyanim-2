import PsyanimFSMState from "../PsyanimFSMState.js";

export default class PsyanimPredatorWallAvoidanceState extends PsyanimFSMState {

    constructor(fsm) {

        super(fsm);
    }

    afterCreate() {

        super.afterCreate();
    }

    enter() {

        super.enter();

        if (this.fsm.debug)
        {
            this.entity.color = 0xffff00;
        }
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run(t, dt);
    }
}