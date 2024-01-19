import PsyanimFSM from '../../../src/core/components/ai/PsyanimFSM.js';

import MyFleeState from './MyFleeState.js';
import MyPatrolState from './MyPatrolState.js';
import MyIdleState from './MyIdleState.js';

export default class MyPatrolFleeAgentFSM extends PsyanimFSM {

    constructor(entity) {

        super(entity);

        this._patrolState = this.addState(MyPatrolState);
        this._fleeState = this.addState(MyFleeState);
        this._idleState = this.addState(MyIdleState);

        this.initialState = this._patrolState;
    }

    onResume() {

        super.onResume();

        this.setStateVariable('itemInScene', false);
    }

    update(t, dt) {

        super.update(t, dt);

        let item = this.scene.getEntityByName('item');

        if (item)
        {
            this.setStateVariable('itemInScene', true);
        }
        else
        {
            this.setStateVariable('itemInScene', false);
        }
    }
}