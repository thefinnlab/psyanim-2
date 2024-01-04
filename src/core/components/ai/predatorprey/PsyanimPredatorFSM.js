import PsyanimFSM from '../PsyanimFSM.js';

import PsyanimPredatorWanderState from './PsyanimPredatorWanderState.js';
import PsyanimPredatorChargeState from './PsyanimPredatorChargeState.js';
import PsyanimPredatorWallAvoidanceState from './PsyanimPredatorWallAvoidanceState.js';

import PsyanimVehicle from '../../steering/PsyanimVehicle.js';
import PsyanimSeekBehavior from '../../steering/PsyanimSeekBehavior.js';
import PsyanimWanderBehavior from '../../steering/PsyanimWanderBehavior.js';
import PsyanimArriveBehavior from '../../steering/PsyanimArriveBehavior.js';

export default class PsyanimPredatorFSM extends PsyanimFSM {

    // predator agent parameters
    target;

    /**
     *  Maximum number of degrees which this agent will offset its chase direction.
     *  @type {Number}
     */
    subtlety;

    /**
     *  Determines how often the agent will recompute its chase direction offset based on the `subtlety` parameter.
     *  @type {Number}
     */
    subtletyLag;

    /**
     *  Max. distance, in 'px', to target beyond which this predator will no longer chase it
     *  @type {Number}
     */
    boredomDistance;

    // wander state params

    // charge state params
    maxChargeSpeed;
    maxChargeAcceleration;

    // wall avoidance state params

    // arrive behavior params
    innerDecelerationRadius;
    outerDecelerationRadius;

    // wander behavior params
    maxWanderSpeed;
    maxWanderAcceleration;
    wanderRadius;
    wanderOffset;
    maxWanderAngleChangePerFrame;
    
    constructor(entity) {

        super(entity);

        // fsm-level parameters

        // wander state

        // charge state
        this.maxChargeSpeed = 9;
        this.maxChargeAcceleration = 0.4;

        // wall avoidance state

        // arrive behavior
        this.innerDecelerationRadius = 12;
        this.outerDecelerationRadius = 30;

        // wander behavior
        this.maxWanderSpeed = 4;
        this.maxWanderAcceleration = 0.2;
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;    

        // attach behaviors for this FSM
        this._vehicle = this.entity.addComponent(PsyanimVehicle);
        this._seekBehavior = this.entity.addComponent(PsyanimSeekBehavior);
        this._wanderBehavior = this.entity.addComponent(PsyanimWanderBehavior);
        this._arriveBehavior = this.entity.addComponent(PsyanimArriveBehavior);

        // setup FSM
        this._wanderState = this.addState(PsyanimPredatorWanderState);
        this._chargeState = this.addState(PsyanimPredatorChargeState);
        this._wallAvoidanceState = this.addState(PsyanimPredatorWallAvoidanceState);

        this.initialState = this._wanderState;
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    afterCreate() {

        super.afterCreate();

        // fsm-level params

        // wander state
        this._wanderState.target = this.target;

        // charge state
        this._chargeState.target = this.target;

        // wall avoidance state

        // arrive behavior
        this._arriveBehavior.maxSpeed = this.maxChargeSpeed;
        this._arriveBehavior.maxAcceleration = this.maxChargeAcceleration;
        this._arriveBehavior.innerDecelerationRadius = this.innerDecelerationRadius;
        this._arriveBehavior.outerDecelerationRadius = this.outerDecelerationRadius;

        // wander behavior
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