import PsyanimFSM from '../PsyanimFSM.js';

import PsyanimPlayfightSeparationState from './PsyanimPlayfightSeparationState.js';

export default class PsyanimPlayfightSeparationFSM extends PsyanimFSM {

    target;

    maxSeparationSpeed;
    maxSeparationAcceleration;

    constructor(entity) {

        super(entity);

        this._separationState = this.addState(PsyanimPlayfightSeparationState);

        this.initialState = this._separationState;
    }

    afterCreate() {

        super.afterCreate();

        this._separationState.target = this.target;
        this._separationState.maxAcceleration = this.maxSeparationAcceleration;
    }

    setMaxSeparationSpeed(value) {

        this.maxSeparationSpeed = value;

        this._separationState.maxSpeed = this.maxSeparationSpeed;
    }

    setMaxSeparationAcceleration(value) {

        this.maxSeparationAcceleration = value;
        
        this._separationState.maxAcceleration = this.maxSeparationAcceleration;
    }

    onPause() {

        super.onPause();
    }

    onStop() {

        super.onStop();
    }

    onResume() {

        super.onResume();
    }

    update(t, dt) {

        super.update(t, dt);
    }
}