import PsyanimFSM from '../PsyanimFSM.js';

import PsyanimPredatorWanderState from './PsyanimPredatorWanderState.js';
import PsyanimPredatorChargeState from './PsyanimPredatorChargeState.js';

import PsyanimVehicle from '../../steering/PsyanimVehicle.js';
import PsyanimSeekBehavior from '../../steering/PsyanimSeekBehavior.js';
import PsyanimWanderBehavior from '../../steering/PsyanimWanderBehavior.js';
import PsyanimArriveBehavior from '../../steering/PsyanimArriveBehavior.js';

export default class PsyanimPredatorFSM extends PsyanimFSM {

    /***********************************************************************************************/
    /********************************* Predator FSM Parameters *************************************/
    /***********************************************************************************************/

    /**
     *  Agent which this predator will watch and pursue.
     *  @type {PsyanimEntity}
     */
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

    /***********************************************************************************************/
    /********************************** Wander State Parameters ************************************/
    /***********************************************************************************************/

    averageWanderTime;

    /**
     *  Maximum speed at which the agent will wander.
     *  @type {Number}
     */
    maxWanderSpeed;

    /**
     *  Maximum acceleration the agent can attain during wander.
     *  @type {Number}
     */
    maxWanderAcceleration;
    
    /**
     *  Radius of the wander circle.
     *  @type {Number}
     */
    wanderRadius;
    
    /**
     *  Distance the wander circle is offset from the agent's position.
     *  @type {Number}
     */
    wanderOffset;
    
    /**
     *  Maximum number of degrees the wander target can move around the wander circle per frame.
     *  @type {Number}
     */
    maxWanderAngleChangePerFrame;

    /***********************************************************************************************/
    /********************************* Charge State Parameters *************************************/
    /***********************************************************************************************/

    maxChargeDuration;
    maxChargeSpeed;
    maxChargeAcceleration;

    innerDecelerationRadius;
    outerDecelerationRadius;

    constructor(entity) {

        super(entity);

        // predator FSM params
        this.subtlety = 30;
        this.subtletyLag = 500;

        // wander state params
        this.averageWanderTime = 2000;
        this.maxWanderSpeed = 4;
        this.maxWanderAcceleration = 0.2;
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;    

        // charge state params
        this.maxChargeDuration = 1400;
        this.maxChargeSpeed = 4;
        this.maxChargeAcceleration = 0.2;

        this.innerDecelerationRadius = 12;
        this.outerDecelerationRadius = 30;

        // attach behaviors for this FSM
        this._vehicle = this.entity.addComponent(PsyanimVehicle);
        this._seekBehavior = this.entity.addComponent(PsyanimSeekBehavior);
        this._wanderBehavior = this.entity.addComponent(PsyanimWanderBehavior);
        this._arriveBehavior = this.entity.addComponent(PsyanimArriveBehavior);

        // setup FSM
        this._wanderState = this.addState(PsyanimPredatorWanderState);
        this._chargeState = this.addState(PsyanimPredatorChargeState);

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
        this._wanderState.averageWanderTime = this.averageWanderTime;

        // charge state
        this._chargeState.target = this.target;
        this._chargeState.subtlety = this.subtlety;
        this._chargeState.subtletyLag = this.subtletyLag;
        this._chargeState.maxChargeDuration = this.maxChargeDuration;

        // arrive behavior
        this._arriveBehavior.maxSpeed = this.maxChargeSpeed;
        this._arriveBehavior.maxAcceleration = this.maxChargeAcceleration;
        this._arriveBehavior.innerDecelerationRadius = this.innerDecelerationRadius;
        this._arriveBehavior.outerDecelerationRadius = this.outerDecelerationRadius;

        // wander behavior
        this._wanderBehavior.averageWanderTime = this.averageWanderTime;
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