import PsyanimFSMState from "../PsyanimFSMState.js";

export default class PsyanimPreyFleeState extends PsyanimFSMState {

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
            this.entity.color = 0x0000ff;
        }
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run(t, dt);
    }
}