import PsyanimFSMState from "../PsyanimFSMState.js";

export default class PsyanimPredatorChargeState extends PsyanimFSMState {

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
            this.entity.color = 0xff0000;
        }
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run(t, dt);
    }
}