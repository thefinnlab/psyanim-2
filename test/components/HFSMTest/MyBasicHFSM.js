import PsyanimBasicHFSM from "../../../src/core/components/ai/PsyanimBasicHFSM.js";

import MyItemPatrolFSM from "./MyItemPatrolFSM.js";
import MyFleeFSM from "./MyFleeFSM.js";

export default class MyBasicHFSM extends PsyanimBasicHFSM {

    target;

    fleePanicDistance;
    fleeSafetyDistance;

    returnToPatrolTime;

    constructor(entity) {

        super(entity);

        this.returnToPatrolTime = 1500;
        this.fleePanicDistance = 150;
        this.fleeSafetyDistance = 50;
    }

    afterCreate() {

        super.afterCreate();

        // configure and add sub-state machines
        this._itemPatrolFSM = this.entity.getComponent(MyItemPatrolFSM);
        this._itemPatrolFSM.target = this.target;

        this._fleeFSM = this.entity.getComponent(MyFleeFSM);
        this._fleeFSM.target = this.target;
        this._fleeFSM.fleePanicDistance = this.fleePanicDistance;
        this._fleeFSM.fleeSafetyDistance = this.fleeSafetyDistance;

        this.addSubStateMachine(this._itemPatrolFSM);
        this.addSubStateMachine(this._fleeFSM);

        // add interrupts
        this.addInterrupt(MyItemPatrolFSM, 'distanceToTarget', (value) => value < this.fleePanicDistance, MyFleeFSM);
        this.addInterrupt(MyFleeFSM, 'idleTime', (value) => value > this.returnToPatrolTime);

        // setup initial substate machine to run
        this.initialSubStateMachine = this._itemPatrolFSM;
    }

    update(t, dt) {

        super.update(t, dt);
    }
}