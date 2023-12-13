import PsyanimFSMState from '../PsyanimFSMState.js';

import { PsyanimDebug } from 'psyanim-utils';

import PsyanimFleeBehavior from '../../steering/PsyanimFleeBehavior.js';
import PsyanimVehicle from '../../steering/PsyanimVehicle.js';

import PsyanimPlayfightFSM from './PsyanimPlayfightFSM.js';

import PsyanimPlayfightWanderState from './PsyanimPlayfightWanderState.js';
import PsyanimPlayfightChargeState from './PsyanimPlayfightChargeState.js';

export default class PsyanimPlayfightFleeState extends PsyanimFSMState {

    target;

    maxFleeDuration;

    constructor(fsm) {

        super(fsm);

        this.maxFleeDuration = 1000;

        this.fsm.setStateVariable('fleeTimer', 0);
        this.fsm.setStateVariable('wander', false);

        /**
         *  Setup transitions here
         */
        this.addTransition(PsyanimPlayfightWanderState, 'fleeTimer', (value) => value > this.maxFleeDuration);
        this.addTransition(PsyanimPlayfightWanderState, 'wander', (value) => value === true);
    }

    afterCreate() {

        this._vehicle = this.entity.getComponent(PsyanimVehicle);
        this._fleeBehavior = this.entity.getComponent(PsyanimFleeBehavior);

        // this._targetAgentChargeState = this.target.getComponent(PsyanimPlayfightFSM)
        //     .getState(PsyanimPlayfightChargeState);

        this._targetAgentWanderState = this.target.getComponent(PsyanimPlayfightFSM)
            .getState(PsyanimPlayfightWanderState);
    }

    enter() {

        super.enter();

        this.fsm.setStateVariable('fleeTimer', 0);
        this.fsm.setStateVariable('wander', false);
    }

    exit() {

        super.exit();

        console.warn('flee duration = ', this.fsm.getStateVariable('fleeTimer'));
    }

    run(t, dt) {

        super.run();

        // update flee timer
        let updatedFleeTimer = this.fsm.getStateVariable('fleeTimer') + dt;

        this.fsm.setStateVariable('fleeTimer', updatedFleeTimer);

        // TODO: for some reason this is only running for 1 frame before the target agent's wander
        // state becomes active or the charge state becomes inactive... doesn't make sense for it to
        // be consistently 1 frame tho - need to debug...

        // if (!this._targetAgentChargeState.isActive)
        if (this._targetAgentWanderState.isActive)
        {
            this.fsm.setStateVariable('wander', true);
        }

        // apply steering
        let steering = this._fleeBehavior.getSteering(this.target);

        this._vehicle.steer(steering);
    }
}