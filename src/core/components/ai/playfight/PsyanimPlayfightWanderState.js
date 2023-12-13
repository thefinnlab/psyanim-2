import PsyanimFSMState from '../PsyanimFSMState.js';

import PsyanimWanderBehavior from '../../steering/PsyanimWanderBehavior.js';

import PsyanimPlayfightFSM from './PsyanimPlayfightFSM.js';

import PsyanimPlayfightChargeState from './PsyanimPlayfightChargeState.js';
import PsyanimPlayfightFleeState from './PsyanimPlayfightFleeState.js';
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

        this.fleeWhenAttacked = true;
        this.panicDistance = 300;
        this.fleeRate = 0.5;

        this.maxTargetDistanceForCharge = 500;

        this._breakDuration = this.breakDurationAverage 
            + PsyanimUtils.getRandomInt(-this.breakDurationVariance, this.breakDurationVariance);

        // set default state variables
        this.fsm.setStateVariable('wanderTimer', 0);
        this.fsm.setStateVariable('distanceToTarget', this.maxTargetDistanceForCharge);
        this.fsm.setStateVariable('flee', false);

        this._fleeOnPanic = false;

        /**
         *  Setup transitions here
         */

        this.addTransition(PsyanimPlayfightChargeState, 'wanderTimer', this._isChargeTransitionTriggered.bind(this));
        this.addTransition(PsyanimPlayfightFleeState, 'flee', (value) => value === true);
    }

    _handleTargetAgentStateEntered(state) {

        if (this.isActive && state === PsyanimPlayfightChargeState.name)
        {
            let chargeRate = 1.0 - this.fleeRate;

            this._fleeOnPanic = Math.random() > chargeRate;

            if (this.fsm.debug)
            {
                this.entity.setTintFill(0xffff00);
            }
        }
    }

    _handleTargetAgentStateExited(state) {

        if (this.isActive && state === PsyanimPlayfightChargeState.name)
        {
            if (this.fsm.debug)
            {
                this.entity.setTintFill(0x00ff00);
            }

            this._fleeOnPanic = false;
        }
    }

    _isChargeTransitionTriggered(wanderTimer) {

        let distanceToTarget = this.fsm.getStateVariable('distanceToTarget');

        return (distanceToTarget < this.maxTargetDistanceForCharge)
            && (wanderTimer > this._breakDuration);
    }

    afterCreate() {

        this._wanderBehavior = this.entity.getComponent(PsyanimWanderBehavior);
        this._vehicle = this.entity.getComponent(PsyanimVehicle);

        // subscribe to fsm events
        let targetAgentFSM = this.targetAgent.getComponent(PsyanimPlayfightFSM);

        targetAgentFSM.events.on('enter', this._handleTargetAgentStateEntered.bind(this));
        targetAgentFSM.events.on('exit', this._handleTargetAgentStateExited.bind(this));

        super.afterCreate();
    }

    enter() {

        super.enter();

        // compute a new break duration with random variance
        this._breakDuration = this.breakDurationAverage 
            + PsyanimUtils.getRandomInt(-this.breakDurationVariance, this.breakDurationVariance);

        this.fsm.setStateVariable('wanderTimer', 0);
        this.fsm.setStateVariable('flee', false);

        this._fleeOnPanic = false;

        if (this.fsm.debug)
        {
            this.entity.setTintFill(0x00ff00);
        }
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

        if (this.fleeWhenAttacked && distanceToTarget < this.panicDistance && this._fleeOnPanic)
        {
            this.fsm.setStateVariable('flee', true);
        }

        // apply steering
        let steering = this._wanderBehavior.getSteering();

        this._vehicle.steer(steering);
    }
}