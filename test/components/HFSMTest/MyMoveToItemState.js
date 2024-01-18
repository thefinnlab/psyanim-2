import PsyanimFSMState from '../../../src/core/components/ai/PsyanimFSMState.js';

import PsyanimArriveAgent from '../../../src/core/components/steering/agents/PsyanimArriveAgent.js';

export default class MyMoveToItemState extends PsyanimFSMState {

    constructor(fsm) {

        super(fsm);

        this.fsm.setStateVariable('itemCollected', false);
    }

    afterCreate() {

        super.afterCreate();

        this._arriveAgent = this.entity.getComponent(PsyanimArriveAgent);
    }

    enter() {

        super.enter();
        // this._arriveAgent.enabled = true;

    }

    exit() {

        super.exit();

        // this._arriveAgent.enabled = false;
    }

    run(t, dt) {

        super.run(t, dt);
    }
}