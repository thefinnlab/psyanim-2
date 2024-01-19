import PsyanimBasicHFSM from "../../../src/core/components/ai/PsyanimBasicHFSM.js";

import MyPatrolFleeAgentFSM from "./MyPatrolFleeAgentFSM.js";
import MyCollectItemFSM from "./MyCollectItemFSM.js";

export default class MyBasicHFSM extends PsyanimBasicHFSM {

    constructor(entity) {

        super(entity);
    }

    afterCreate() {

        super.afterCreate();

        this._patrolFSM = this.entity.getComponent(MyPatrolFleeAgentFSM);
        this._collectItemFSM = this.entity.getComponent(MyCollectItemFSM);

        // add sub-state machines
        this.addSubStateMachine(this._patrolFSM);
        this.addSubStateMachine(this._collectItemFSM);

        // add interrupts
        this.addInterrupt(MyPatrolFleeAgentFSM, 'itemInScene', (value) => value === true, MyCollectItemFSM);
        this.addInterrupt(MyCollectItemFSM, 'itemCollected', (value) => value === true);

        // setup initial substate machine to run
        this.initialSubStateMachine = this._patrolFSM;
    }

    update(t, dt) {

        super.update(t, dt);
    }
}