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

        this._targetAgentChargeState = this.target.getComponent(PsyanimPlayfightFSM)
            .getState(PsyanimPlayfightChargeState);
    }

    enter() {

        super.enter();

        this.fsm.setStateVariable('fleeTimer', 0);
        this.fsm.setStateVariable('wander', false);

        if (this.fsm.debug)
        {
            this.entity.setTintFill(0x0000ff);            
        }
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run();

        // update flee timer
        let updatedFleeTimer = this.fsm.getStateVariable('fleeTimer') + dt;

        this.fsm.setStateVariable('fleeTimer', updatedFleeTimer);

        if (!this._targetAgentChargeState.isActive)
        {
            this.fsm.setStateVariable('wander', true);
        }

        // apply steering
        let steering = this._fleeBehavior.getSteering(this.target);

        this._vehicle.steer(steering);
    }
}