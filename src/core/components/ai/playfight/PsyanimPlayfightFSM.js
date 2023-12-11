import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent.js';

import PsyanimVehicle from '../../steering/PsyanimVehicle.js';
import PsyanimArriveBehavior from '../../steering/PsyanimArriveBehavior.js';
import PsyanimSeekBehavior from '../../steering/PsyanimSeekBehavior.js';
import PsyanimWanderBehavior from '../../steering/PsyanimWanderBehavior.js';

import PsyanimFSM from '../PsyanimFSM.js';

import PsyanimPlayfightChargeState from './PsyanimPlayfightChargeState.js';
import PsyanimPlayfightWanderState from './PsyanimPlayfightWanderState.js';

export default class PsyanimPlayfightFSM extends PsyanimComponent {

    /** playfight params */
    target;
    breakDuration;

    /** arrive params */
    maxChargeSpeed;
    maxChargeAcceleration;
    innerDecelerationRadius;
    outerDecelerationRadius;

    /** wander params */
    maxWanderSpeed;
    maxWanderAcceleration;
    wanderRadius;
    wanderOffset;
    maxWanderAngleChangePerFrame;

    /** general params */
    debug;

    constructor(entity) {

        super(entity);

        // default parameters
        this.breakDuration = 2000;
        this.debug = false;

        this.maxChargeSpeed = 9;
        this.maxChargeAcceleration = 0.4;

        this.innerDecelerationRadius = 12;
        this.outerDecelerationRadius = 30;

        this.maxWanderSpeed = 4;
        this.maxWanderAcceleration = 0.2;
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;

        // attach behaviors for this FSM
        this._vehicle = this.entity.addComponent(PsyanimVehicle);
        this._arriveBehavior = this.entity.addComponent(PsyanimArriveBehavior);
        this._seekBehavior = this.entity.addComponent(PsyanimSeekBehavior);
        this._wanderBehavior = this.entity.addComponent(PsyanimWanderBehavior);
        
        // setup FSM
        this._fsm = this.entity.addComponent(PsyanimFSM);

        this._chargeState = this._fsm.addState(PsyanimPlayfightChargeState);
        this._wanderState = this._fsm.addState(PsyanimPlayfightWanderState);

        this._fsm.initialState = this._wanderState;
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    afterCreate() {

        super.afterCreate();

        // configure defaults for fsm & components
        this._fsm.debug = this.debug;
        this._chargeState.setTarget(this.target);
        this._wanderState.breakDuration = this.breakDuration;

        this._arriveBehavior.maxSpeed = this.maxChargeSpeed;
        this._arriveBehavior.maxAcceleration = this.maxChargeAcceleration;
        this._arriveBehavior.innerDecelerationRadius = this.innerDecelerationRadius;
        this._arriveBehavior.outerDecelerationRadius = this.outerDecelerationRadius;

        this._wanderBehavior.seekBehavior = this._seekBehavior;
        this._wanderBehavior.maxSeekSpeed = this.maxWanderSpeed;
        this._wanderBehavior.maxSeekAcceleration = this.maxWanderAcceleration;
        this._wanderBehavior.radius = this.wanderRadius;
        this._wanderBehavior.offset = this.wanderOffset;
        this._wanderBehavior.maxWanderAngleChangePerFrame = this.maxWanderAngleChangePerFrame;
    }

    beforeShutdown() {

        super.beforeShutdown();
    }

    update(t, dt) {
        
        super.update(t, dt);
    }
}