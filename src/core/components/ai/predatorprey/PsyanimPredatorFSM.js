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
     *  [Range: 0 - 180]
     *  [Default: 30]
     *  Maximum number of degrees which this agent will offset its chase direction.
     *  @type {Number}
     */
    subtlety;

    /**
     *  [Range: 0 - 1000 ]
     *  [Default: 500 ]
     *  Determines how often the agent will recompute its chase direction offset based on the `subtlety` parameter.
     *  @type {Number}
     */
    subtletyLag;

    /***********************************************************************************************/
    /********************************** Wander State Parameters ************************************/
    /***********************************************************************************************/

    /**
     *  [Range:  1000 - 10000 ]
     *  [Default: 2000 ]
     *  Amount of time, in millseconds, this agent will wander before attempting another charge.
     *  @type {Number}
     */
    averageWanderDuration;

    /**
     *  [Range: 0 - 10000 ]
     *  [Default: 500 ]
     *  Variance in wander duration, which gets recomputed each time agent enters wander state.
     *  @type {Number}
     */
    wanderDurationVariance;

    /**
     *  [Range: 0.5 - 10.0 ]
     *  [Default: 3 ]
     *  Maximum speed at which the agent will wander.
     *  @type {Number}
     */
    maxWanderSpeed;

    /**
     *  [Range: 0.05 - 0.4 ]
     *  [Default: 0.2]
     *  Maximum acceleration the agent can attain during wander.
     *  @type {Number}
     */
    maxWanderAcceleration;
    
    /**
     *  [Range: 25 - 200 ]
     *  [Default: 50 ]
     *  Radius of the wander circle.
     *  @type {Number}
     */
    wanderRadius;
    
    /**
     *  [Range: 75 - 500 ]
     *  [Default: 250 ]
     *  Distance the wander circle is offset from the agent's position.
     *  @type {Number}
     */
    wanderOffset;
    
    /**
     *  [Range: 5 - 90 ]
     *  [Default: 10 ]
     *  Maximum number of degrees the wander target can move around the wander circle per frame.
     *  @type {Number}
     */
    maxWanderAngleChangePerFrame;

    /***********************************************************************************************/
    /********************************* Charge State Parameters *************************************/
    /***********************************************************************************************/

    /**
     *  [Range: 1000 - 10000 ]
     *  [Default: 2000 ]
     *  Average time which the agent will remain in a charge state.
     *  @type {Number} - milliseconds
     */
    averageChargeDuration;

    /**
     *  [Range: 0 - 10000 ]
     *  [Default: 500 ]
     *  Variance in charge duration, which is recomputed every time agent enters charge state.
     *  @type {Number} - milliseconds
     */
    chargeDurationVariance;

    /**
     *  [Range: 1.5 - 10.0 ]
     *  [Default: 3 ]
     *  Maximum speed agent can reach during charge.
     *  @type {Number}
     */
    maxChargeSpeed;

    /**
     *  [Range: 0.05 - 0.4 ]
     *  [Default: 0.2 ]
     *  Maximum acceleration agent can attain during a charge.
     *  @type {Number}
     */
    maxChargeAcceleration;

    /**
     *  [Range: 0 - 100 ]
     *  [Default: 12 ]
     *  Inner deceleration radius of 'Arrive behavior' used during charge.
     *  @type {Number}
     */
    innerDecelerationRadius;

    /**
     *  [Range: 100 - 300 ]
     *  [Default: 30 ]
     *  Outer deceleration radius of 'Arrive behavior' used during charge.
     *  @type {Number}
     */
    outerDecelerationRadius;

    /***********************************************************************************************/
    /*********************************** Component Parameters **************************************/
    /***********************************************************************************************/

    /** Vehicle params */
    nSamplesForLookSmoothing;

    constructor(entity) {

        super(entity);

        // predator FSM params
        this.subtlety = 30;
        this.subtletyLag = 500;

        // wander state params
        this.averageWanderDuration = 2000;
        this.wanderDurationVariance = 500;

        this.maxWanderSpeed = 3;
        this.maxWanderAcceleration = 0.2;
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;    

        // charge state params
        this.averageChargeDuration = 2000;
        this.chargeDurationVariance = 500;

        this.maxChargeSpeed = 3;
        this.maxChargeAcceleration = 0.2;

        this.innerDecelerationRadius = 12;
        this.outerDecelerationRadius = 30;

        // vehicle component
        this.nSamplesForLookSmoothing = 16;

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

        // wander state
        this._wanderState.target = this.target;
        this._wanderState.averageWanderDuration = this.averageWanderDuration;
        this._wanderState.wanderDurationVariance = this.wanderDurationVariance;

        // charge state
        this._chargeState.target = this.target;
        this._chargeState.subtlety = this.subtlety;
        this._chargeState.subtletyLag = this.subtletyLag;
        this._chargeState.averageChargeDuration = this.averageChargeDuration;
        this._chargeState.chargeDurationVariance = this.chargeDurationVariance;

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

        // vehicle component
        this._vehicle.nSamplesForLookSmoothing = this.nSamplesForLookSmoothing;
    }

    beforeShutdown() {

        super.beforeShutdown();
    }

    update(t, dt) {

        super.update(t, dt);
    }
}