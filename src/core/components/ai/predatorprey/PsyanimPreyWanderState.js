import PsyanimFSMState from "../PsyanimFSMState.js";

export default class PsyanimPreyWanderState extends PsyanimFSMState {

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
            this.entity.color = 0x00ff00;
        }
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run(t, dt);
    }
}