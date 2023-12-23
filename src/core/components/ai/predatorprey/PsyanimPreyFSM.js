import PsyanimFSM from './PsyanimFSM.js';

import PsyanimPreyWanderState from './PsyanimPreyWanderState.js';
import PsyanimPreyFleeState from './PsyanimPreyFleeState.js';
import PsyanimPreyWallAvoidanceState from './PsyanimPreyWallAvoidanceState.js';

export default class PsyanimPreyFSM extends PsyanimFSM {

    // prey agent parameters
    target;
    debug;

    // wander state params

    // flee state params

    // wall avoidance state params

    // arrive behavior params

    // wander behavior params

    constructor(entity) {

        super(entity);

        this._wanderState = this.addState(PsyanimPreyWanderState);
        this._fleeState = this.addState(PsyanimPreyFleeState);
        this._wallAvoidanceState = this.addState(PsyanimPreyWallAvoidanceState);

        this.initialState = this._wanderState;
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    afterCreate() {

        super.afterCreate();
    }

    beforeShutdown() {

        super.beforeShutdown();
    }

    update(t, dt) {

        super.update(t, dt);
    }
}