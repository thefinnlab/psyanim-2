import PsyanimFSMState from '../PsyanimFSMState.js';

import PsyanimWanderBehavior from '../../steering/PsyanimWanderBehavior.js';

import PsyanimPlayfightChargeState from './PsyanimPlayfightChargeState.js';
import PsyanimVehicle from '../../steering/PsyanimVehicle.js';

import { PsyanimUtils } from 'psyanim-utils';

export default class PsyanimPlayfightWanderState extends PsyanimFSMState {

    maxBreakDuration; // ms
    breakDurationVariance; // ms

    constructor(fsm) {

        super(fsm);

        this.maxBreakDuration = 3500;
        this.breakDurationVariance = 1500;

        this._breakDuration = this.maxBreakDuration 
            + PsyanimUtils.getRandomInt(-this.breakDurationVariance, this.breakDurationVariance);

        // set default state variables
        this.fsm.setStateVariable('wanderTimer', 0);

        /**
         *  Setup transitions here
         */

        this.addTransition(PsyanimPlayfightChargeState, 'wanderTimer', (value) => value > this._breakDuration);
    }

    enter() {

        super.enter();

        this._wanderBehavior = this.entity.getComponent(PsyanimWanderBehavior);
        this._vehicle = this.entity.getComponent(PsyanimVehicle);

        // compute a new break duration with random variance
        this._breakDuration = this.maxBreakDuration 
            + PsyanimUtils.getRandomInt(-this.breakDurationVariance, this.breakDurationVariance);

        this.fsm.setStateVariable('wanderTimer', 0);
    }

    exit() {

        super.exit();


    }

    run(t, dt) {

        super.run();

        // update state variables
        let wanderTimer = this.fsm.getStateVariable('wanderTimer');

        this.fsm.setStateVariable('wanderTimer', wanderTimer + dt);

        // apply steering
        let steering = this._wanderBehavior.getSteering();

        this._vehicle.steer(steering);
    }
}