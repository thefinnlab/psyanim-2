import PsyanimFSM from "../../../src/core/components/ai/PsyanimFSM.js";

import MyFleeState from './MyFleeState.js';
import MyIdleState from './MyIdleState.js';

export default class MyFleeFSM extends PsyanimFSM {

    target;

    fleePanicDistance;
    fleeSafetyDistance;

    constructor(entity) {

        super(entity);

        this._fleeState = this.addState(MyFleeState);
        this._idleState = this.addState(MyIdleState);

        this.initialState = this._fleeState;
    }

    afterCreate() {

        super.afterCreate();

        this.stop();
    }

    onResume() {

        super.onResume();

        this._fleeState.panicDistance = this.fleePanicDistance;
        this._fleeState.safetyDistance = this.fleeSafetyDistance;

        this._idleState.target = this.target;
        this._idleState.panicDistance = this.fleePanicDistance;
    }

    update(t, dt) {

        super.update(t, dt);
    }
}