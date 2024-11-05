import PsyanimApp from '../../../PsyanimApp.js';
import PsyanimFSM from '../PsyanimFSM.js';

import PsyanimPredatorWanderState from './PsyanimPredatorWanderState.js';
import PsyanimPredatorChargeState from './PsyanimPredatorChargeState.js';
import PsyanimPredatorMovementLagState from './PsyanimPredatorMovementLagState.js';

import PsyanimVehicle from '../../steering/PsyanimVehicle.js';
import PsyanimSeekBehavior from '../../steering/PsyanimSeekBehavior.js';
import PsyanimWanderBehavior from '../../steering/PsyanimWanderBehavior.js';
import PsyanimArriveBehavior from '../../steering/PsyanimArriveBehavior.js';

/**
 *  `PsyanimPredatorFSM` implements the `Predator v2` algorithm.
 * 
 *  Members marked with the `[advanced]` tag typically don't need to be modified. Although they can be modified, doing so can require tuning of several other parameters.
 */
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

    /**
     *  Delay time, in ms, before agent will begin moving initially.
     *  @type {Number}
     */
    movementLag;

    /**
     *  If user provides this, agent will not move initially until the target first moves.
     *  @type {PsyanimEntity}
     */
    movementLagDetectionTarget;

    /**
     *  NOTE: this optional parameter is specific to integration with jsPsych!
     * 
     *  Time duration, in ms, that this behavior will execute, once moving, before throwing an 
     *  event to tell jsPsych to end the current trial.
     *  @type {Number}
     */
    fixedDuration;

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
     *  [***advanced***]
     *  [Range: 25 - 200 ]
     *  [Default: 50 ]
     *  Radius of the wander circle.
     *  @type {Number}
     */
    wanderRadius;
    
    /**
     *  [***advanced***]
     *  [Range: 75 - 500 ]
     *  [Default: 250 ]
     *  Distance the wander circle is offset from the agent's position.
     *  @type {Number}
     */
    wanderOffset;
    
    /**
     *  [***advanced***]
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
     *  [***advanced***]
     *  [Range: 0 - 100 ]
     *  [Default: 12 ]
     *  Inner deceleration radius of 'Arrive behavior' used during charge.
     *  @type {Number}
     */
    innerDecelerationRadius;

    /**
     *  [***advanced***]
     *  [Range: 100 - 300 ]
     *  [Default: 30 ]
     *  Outer deceleration radius of 'Arrive behavior' used during charge.
     *  @type {Number}
     */
    outerDecelerationRadius;

    /***********************************************************************************************/
    /*********************************** Component Parameters **************************************/
    /***********************************************************************************************/

    /** 
     * [***advanced***]
     * Number of samples used for vehicle smoothing
     * @type {Number}
     */
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

        // movement lag state params
        this.movementLag = 0;
        this.movementLagDetectionTarget = null;

        this.fixedDuration = -1;

        // vehicle component
        this.nSamplesForLookSmoothing = 16;

        // attach behaviors for this FSM
        this._vehicle = this.entity.addComponent(PsyanimVehicle);
        this._seekBehavior = this.entity.addComponent(PsyanimSeekBehavior);
        this._wanderBehavior = this.entity.addComponent(PsyanimWanderBehavior);
        this._arriveBehavior = this.entity.addComponent(PsyanimArriveBehavior);

        this._behaviorExecutionTimer = 0;

        // setup FSM
        this._wanderState = this.addState(PsyanimPredatorWanderState);
        this._chargeState = this.addState(PsyanimPredatorChargeState);
        this._movementLagState = this.addState(PsyanimPredatorMovementLagState);

        this.initialState = this._movementLagState;
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    afterCreate() {

        // movement lag state
        this._movementLagState.movementLag = this.movementLag;
        this._movementLagState.movementLagDetectionTarget = this.movementLagDetectionTarget;

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

        if (this.currentStateName != 'PsyanimPredatorMovementLagState')
        {
            this._behaviorExecutionTimer += dt;

            if (this.fixedDuration > 0 && this._behaviorExecutionTimer > this.fixedDuration)
            {
                PsyanimApp.Instance.events.emit('psyanim-jspsych-endTrial');
            }
        }
    }
}