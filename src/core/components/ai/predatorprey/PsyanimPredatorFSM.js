import PsyanimFSM from './PsyanimFSM.js';

import PsyanimPredatorWanderState from './PsyanimPredatorWanderState.js';
import PsyanimPredatorChargeState from './PsyanimPredatorChargeState.js';
import PsyanimPredatorWallAvoidanceState from './PsyanimPredatorWallAvoidanceState.js';

export default class PsyanimPredatorFSM extends PsyanimFSM {

    // predator agent parameters
    target;
    debug;

    // wander state params

    // charge state params

    // wall avoidance params

    // arrive behavior params

    // wander behavior params

    constructor(entity) {

        super(entity);

        this._wanderState = this.addState(PsyanimPredatorWanderState);
        this._chargeState = this.addState(PsyanimPredatorChargeState);
        this._wallAvoidanceState = this.addState(PsyanimPredatorWallAvoidanceState);

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