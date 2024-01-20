import PsyanimFSM from '../PsyanimFSM.js';

import PsyanimPlayfightSeparationState from './PsyanimPlayfightSeparationState.js';

export default class PsyanimPlayfightSeparationFSM extends PsyanimFSM {

    constructor(entity) {

        super(entity);

        this._separationState = this.addState(PsyanimPlayfightSeparationState);

        this.initialState = this._separationState;
    }

    afterCreate() {

        super.afterCreate();

        this.stop();
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