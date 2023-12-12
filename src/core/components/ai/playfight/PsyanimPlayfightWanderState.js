import PsyanimFSM from '../PsyanimFSM.js';
import PsyanimFSMState from '../PsyanimFSMState.js';

import PsyanimWanderBehavior from '../../steering/PsyanimWanderBehavior.js';

import PsyanimPlayfightChargeState from './PsyanimPlayfightChargeState.js';
import PsyanimVehicle from '../../steering/PsyanimVehicle.js';

import { PsyanimUtils, PsyanimDebug } from 'psyanim-utils';

export default class PsyanimPlayfightWanderState extends PsyanimFSMState {

    targetAgent;
    maxTargetDistanceForCharge;

    breakDurationAverage; // ms
    breakDurationVariance; // ms

    fleeWhenAttacked; // boolean
    panicDistance; // pixels
    fleeRate; // percentage

    constructor(fsm) {

        super(fsm);

        this.breakDurationAverage = 2000;
        this.breakDurationVariance = 1000;

        this.fleeWhenAttacked = false;
        this.fleeRate = 0.5;

        this.maxTargetDistanceForCharge = 500;

        this._breakDuration = this.breakDurationAverage 
            + PsyanimUtils.getRandomInt(-this.breakDurationVariance, this.breakDurationVariance);

        // set default state variables
        this.fsm.setStateVariable('wanderTimer', 0);
        this.fsm.setStateVariable('distanceToTarget', this.maxTargetDistanceForCharge);
        this.fsm.setStateVariable('flee', false);

        /**
         *  Setup transitions here
         */

        this.addTransition(PsyanimPlayfightChargeState, 'wanderTimer', this._isChargeTransitionTriggered.bind(this));
        this.addTransition
    }

    _isChargeTransitionTriggered(wanderTimer) {

        let distanceToTarget = this.fsm.getStateVariable('distanceToTarget');

        return (distanceToTarget < this.maxTargetDistanceForCharge)
            && (wanderTimer > this._breakDuration);
    }

    enter() {

        super.enter();

        this._targetChargeState = this.targetAgent.getComponent(PsyanimFSM)
            .getState(PsyanimPlayfightChargeState);

        this._wanderBehavior = this.entity.getComponent(PsyanimWanderBehavior);
        this._vehicle = this.entity.getComponent(PsyanimVehicle);

        // compute a new break duration with random variance
        this._breakDuration = this.breakDurationAverage 
            + PsyanimUtils.getRandomInt(-this.breakDurationVariance, this.breakDurationVariance);

        this.fsm.setStateVariable('wanderTimer', 0);
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run();

        // update state variables
        let updatedWanderTimer = this.fsm.getStateVariable('wanderTimer') + dt;
        
        let distanceToTarget = this.targetAgent.position
            .subtract(this.entity.position)
            .length();

        this.fsm.setStateVariable('distanceToTarget', distanceToTarget);

        if (distanceToTarget < this.maxTargetDistanceForCharge)
        {
            this.fsm.setStateVariable('wanderTimer', updatedWanderTimer);
        }

        if (this.fsm.debug && this._targetChargeState.isActive)
        {
            PsyanimDebug.log('target agent is CHARGING!');
        }

        // apply steering
        let steering = this._wanderBehavior.getSteering();

        this._vehicle.steer(steering);
    }
}