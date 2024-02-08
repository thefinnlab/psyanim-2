import PsyanimFSM from '../../../src/core/components/ai/PsyanimFSM.js';

import MyMoveToItemState from "./MyMoveToItemState.js";
import MyPatrolState from './MyPatrolState.js';

export default class MyItemPatrolFSM extends PsyanimFSM {

    target;

    fleePanicDistance;

    constructor(entity) {

        super(entity);

        this._patrolState = this.addState(MyPatrolState);
        this._moveToItemState = this.addState(MyMoveToItemState);

        this.initialState = this._patrolState;
    }

    afterCreate() {

        super.afterCreate();
    }

    onResume() {

        super.onResume();

        this._patrolState.target = this.target;

        this._computeDistanceToTarget();
    }

    _computeDistanceToTarget() {

        let distanceToTarget = this.entity.position.subtract(this.target.position).length();

        this.setStateVariable('distanceToTarget', distanceToTarget);
    }

    update(t, dt) {

        super.update(t, dt);

        this._computeDistanceToTarget();
    }
}