import PsyanimApp from '../../../PsyanimApp.js';

import PsyanimFSMState from "../PsyanimFSMState.js";

import PsyanimPredatorWanderState from "./PsyanimPredatorWanderState.js";

export default class PsyanimPredatorMovementLagState extends PsyanimFSMState {

    /**
     *  Delay time, in ms, before agent will begin moving initially.
     *  @type {Number}
     */
    movementLag;

    /**
     *  If user provides this, agent will not move initially until the target first moves.
     *  @type {PsyanimEntity}
     */
    movementLagDetectionTarget;

    constructor(fsm) {

        super(fsm);

        this._movementLagTimer = 0;
        this._movementLagTargetInitialPosition = null;

        this.addTransition(PsyanimPredatorWanderState, 'movementLagComplete', (value) => value === true);

        this.fsm.setStateVariable('movementLagComplete', false);
    }

    afterCreate() {

        super.afterCreate();

        if (this.movementLagDetectionTarget)
        {
            this._movementLagTargetInitialPosition = this.movementLagDetectionTarget.position;
        }
    }

    enter() {

        super.enter();

    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run(t, dt);

        this._movementLagTimer += dt;

        if (this.movementLagDetectionTarget)
        {
            if (!this._movementLagTargetInitialPosition.fuzzyEquals(
                this.movementLagDetectionTarget.position))
            {
                this.fsm.setStateVariable('movementLagComplete', true);
            }
            else if (this.movementLag != 0 && this._movementLagTimer > this.movementLag)
            {
                PsyanimApp.Instance.events.emit('psyanim-jspsych-endTrial');                    
            }
        }
        else if (this._movementLagTimer > this.movementLag)
        {
            this.fsm.setStateVariable('movementLagComplete', true);
        }
    }
}