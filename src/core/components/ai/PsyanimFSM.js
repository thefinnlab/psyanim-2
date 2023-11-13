import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimFSM extends PsyanimComponent {

    initialState;

    constructor(entity) {

        super(entity);
    }

    afterCreate() {

        this._currentState = this.initialState;

        super.afterCreate();
    }

    update(t, dt) {

        super.update(t, dt);

        let currentTransition = null;

        // see if we have any transition conditions met
        for (let i = 0; i < this._currentState.transitions.length; ++i)
        {
            let t = this._currentState.transitions[i];

            if (t.isTriggered)
            {
                currentTransition = t;
                break;
            }
        }

        // if a transition is triggered, switch states
        if (currentTransition)
        {
            this._currentState.exit();

            t.targetState.enter();

            this._currentState = t.targetState;
        }

        // let the current state run
        this._currentState.run();
    }
}