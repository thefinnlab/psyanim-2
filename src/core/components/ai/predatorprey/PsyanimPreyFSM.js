import PsyanimFSM from '../PsyanimFSM.js';

import PsyanimVehicle from '../../steering/PsyanimVehicle.js';
import PsyanimSeekBehavior from '../../steering/PsyanimSeekBehavior.js';
import PsyanimArriveBehavior from '../../steering/PsyanimArriveBehavior.js';
import PsyanimWanderBehavior from '../../steering/PsyanimWanderBehavior.js';
import PsyanimFleeBehavior from '../../steering/PsyanimFleeBehavior.js';


import PsyanimPreyWanderState from './PsyanimPreyWanderState.js';
import PsyanimPreyFleeState from './PsyanimPreyFleeState.js';
import PsyanimPreyWallAvoidanceState from './PsyanimPreyWallAvoidanceState.js';

export default class PsyanimPreyFSM extends PsyanimFSM {

    // prey agent parameters
    target;

    /**
     *  Maximum number of degrees which this agent will offset it's flee direction.
     *  @type {Number}
     */
    subtlety;

    /**
     *  Determines how often the agent will recompute it's flee direction based on the `subtlety` parameter.
     *  @type {Number}
     */    
    subtletyLag;

    /**
     *  Min. distance, in 'px', to target in which this agent will flee to maintain.
     *  @type {Number}
     */
    safetyDistance;

    // wander state params

    // flee state params
    maxFleeSpeed;
    maxFleeAcceleration;

    // wall avoidance state params

    // flee behavior params
    maxFleeSpeed;
    maxFleeAcceleration;
    panicDistance;

    // wander behavior params
    maxWanderSpeed;
    maxWanderAcceleration;
    wanderRadius;
    wanderOffset;
    maxWanderAngleChangePerFrame;
    
    constructor(entity) {

        super(entity);

        // wander state

        // flee state

        // wall avoidance state
    
        // flee behavior
        this.maxFleeSpeed = 8;
        this.maxFleeAcceleration = 0.2;
        this.panicDistance = 250;

        // wander behavior
        this.maxWanderSpeed = 4;
        this.maxWanderAcceleration = 0.2;
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;

        // attach behaviors for this FSM
        this._vehicle = this.entity.addComponent(PsyanimVehicle);
        this._seekBehavior = this.entity.addComponent(PsyanimSeekBehavior);
        this._arriveBehavior = this.entity.addComponent(PsyanimArriveBehavior);
        this._wanderBehavior = this.entity.addComponent(PsyanimWanderBehavior);
        this._fleeBehavior = this.entity.addComponent(PsyanimFleeBehavior);

        // setup fsm
        this._wanderState = this.addState(PsyanimPreyWanderState);
        this._fleeState = this.addState(PsyanimPreyFleeState);
        this._wallAvoidanceState = this.addState(PsyanimPreyWallAvoidanceState);

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

        // fsm-level parameters

        // wander state
        this._wanderState.target = this.target;

        // flee state
        this._fleeState.target = this.target;

        // wall avoidance state

        // wander behavior
        this._wanderBehavior.seekBehavior = this._seekBehavior;
        this._wanderBehavior.maxSeekSpeed = this.maxWanderSpeed;
        this._wanderBehavior.maxSeekAcceleration = this.maxWanderAcceleration;
        this._wanderBehavior.radius = this.wanderRadius;
        this._wanderBehavior.offset = this.wanderOffset;
        this._wanderBehavior.maxWanderAngleChangePerFrame = this.maxWanderAngleChangePerFrame;

        // arrive behavior
        this._arriveBehavior.maxSpeed = this.maxFleeSpeed;
        this._arriveBehavior.maxAcceleration = this.maxFleeAcceleration;
        // TODO: configure inner and outer deceleration radii

        // flee behavior
        this._fleeBehavior.maxSpeed = this.maxFleeSpeed;
        this._fleeBehavior.maxAcceleration = this.maxFleeAcceleration;
        this._fleeBehavior.panicDistance = this.panicDistance;
    }

    beforeShutdown() {

        super.beforeShutdown();
    }

    update(t, dt) {

        super.update(t, dt);
    }
}