import PsyanimConstants from '../../../PsyanimConstants.js';

import PsyanimVehicle from '../../steering/PsyanimVehicle.js';
import PsyanimArriveBehavior from '../../steering/PsyanimArriveBehavior.js';
import PsyanimSeekBehavior from '../../steering/PsyanimSeekBehavior.js';
import PsyanimWanderBehavior from '../../steering/PsyanimWanderBehavior.js';
import PsyanimFleeBehavior from '../../steering/PsyanimFleeBehavior.js';

import PsyanimFSM from '../PsyanimFSM.js';

import PsyanimPlayfightChargeState from './PsyanimPlayfightChargeState.js';
import PsyanimPlayfightChargeDelayState from './PsyanimPlayfightChargeDelayState.js';
import PsyanimPlayfightWanderState from './PsyanimPlayfightWanderState.js';
import PsyanimPlayfightFleeState from './PsyanimPlayfightFleeState.js';

import PsyanimSensor from '../../physics/PsyanimSensor.js';

/**
 *  `PsyanimPlayfightFSM` implements the `Playfight v2` algorithm.
 * 
 *  Members marked with the `[advanced]` tag typically don't need to be modified. Although they can be modified, doing so can require tuning of several other parameters.
 */
export default class PsyanimPlayfightFSM extends PsyanimFSM {

    /***********************************************************************************************/
    /********************************* Playfight FSM Parameters ************************************/
    /***********************************************************************************************/

    /**
     *  Required field specifies the target entity this agent will playfight with.
     *  @type {PsyanimEntity}
     */
    target;

    /***********************************************************************************************/
    /********************************** Wander State Parameters ************************************/
    /***********************************************************************************************/

    /**
     *  [Range: 500 - 50000 ]
     *  [Default: 2000 ]
     *  Average time, in milliseconds, the agents will wander before attacking target again.
     *  @type {Number}
     */
    breakDurationAverage; 

    /**
     *  [Range: 500 - 50000 ]
     *  [Default: 1000 ]
     *  Allowed variance in break duration.
     *  @type {Number}
     */
    breakDurationVariance;

    /**
     *  [***advanced***]
     *  [Range: 50 - 50000 ]
     *  [Default: 150 ]
     *  Minimum time, in milliseconds, the agent must remain in wander state before it can transition out.
     *  @type {Number}
     */
    minWanderDuration;

    /**
     *  [Range: 50 - 1000 ]
     *  [Default: 200 ]
     *  Minimum distance from target from which this agent will initiate a charge.
     *  @type {Number}
     */
    minTargetDistanceForCharge;

    /**
     *  [Range: 200 - 1000 ]
     *  [Default: 500 ]
     *  Maximum distance from target which this agent will initiate a charge.
     *  @type {Number}
     */
    maxTargetDistanceForCharge;

    /**
     *  [Range: true/false ]
     *  [Default: true ]
     *  Controls whether the agent can flee or charge from wander state if attacked.
     *  @type {boolean}
     */
    wanderFleeOrChargeWhenAttacked;

    /**
     *  [Range: 200 - 1000 ]
     *  [Default: 250 ]
     *  Distance from attacker which this agent will transition to flee or charge delay state, if allowed.
     *  @type {Number}
     */
    wanderPanicDistance;

    /**
     *  [Range: 0.0 - 1.0 ]
     *  [Default: 0.5 ]
     *  Probability that agent will flee vs. charge when attacker is within panicDistance.
     *  @type {Number}
     */
    wanderFleeRate;

    /**
     *  [Range: 500 - 50000 ]
     *  [Default: 600 ]
     *  Average time, in milliseconds, the agents will wander before charging.
     *  @type {Number}
     */
    averageChargeDelay;

    /**
     *  [Range: 50 - 50000 ]
     *  [Default: 400 ]
     *  Allowed variance in charge delay.
     *  @type {Number}
     */
    chargeDelayVariance;

    /**
     *  [***advanced***]
     *  [Default: 75 ]
     *  @type {Number}
     */
    wanderSensorRadiusPadding;

    /***********************************************************************************************/
    /*********************************** Flee State Parameters *************************************/
    /***********************************************************************************************/

    /**
     *  [Range: 500 - 50000 ]
     *  [Default: 500 ]
     *  Maximum time this agent can remain in flee state since entering.
     *  @type {Number}
     */
    maxFleeDuration;

    /***********************************************************************************************/
    /********************************** Charge State Parameters ************************************/
    /***********************************************************************************************/

    /**
     *  [Range: 500 - 50000 ]
     *  [Default: 1500 ]
     *  Maximum time the agent can stay in charge state.
     *  @type {Number}
     */
    maxChargeDuration;

    /***********************************************************************************************/
    /******************************** Arrive Behavior Parameters ***********************************/
    /***********************************************************************************************/

    /**
     *  [Range: 3 - 20 ]
     *  [Default: 9 ]
     *  Maximum speed at which this agent can charge at it's target.
     *  @type {Number}
     */
    maxChargeSpeed;

    /**
     *  [Range: 0.05 - 0.7 ]
     *  [Default: 0.4 ]
     *  Maximum acceleration this agent can reach when charging at it's target.
     *  @type {Number}
     */
    maxChargeAcceleration;

    /**
     *  [***advanced***]
     *  [Range: 5 - 500 ]
     *  [Default: 12 ]
     *  Distance, in px, from target which the agent will come to rest.
     *  @type {Number}
     */
    innerDecelerationRadius;

    /**
     *  [***advanced***]
     *  [Range: 5 - 500 ]
     *  [Default: 30 ]
     *  Distance, in px, from target which the agent will begin slowing down.
     *  @type {Number}
     */
    outerDecelerationRadius;

    /***********************************************************************************************/
    /******************************** Wander Behavior Parameters ***********************************/
    /***********************************************************************************************/

    /**
     *  [Range: 3 - 20 ]
     *  [Default: 4 ]
     *  Maximum speed at which the agent will wander.
     *  @type {Number}
     */
    maxWanderSpeed;

    /**
     *  [Range: 0.05 - 0.7 ]
     *  [Default: 0.2 ]
     *  Maximum acceleration the agent can attain during wander.
     *  @type {Number}
     */
    maxWanderAcceleration;

    /**
     *  [***advanced***]
     *  [Range: 5 - 500 ]
     *  [Default: 50 ]
     *  Radius of the wander circle.
     *  @type {Number}
     */
    wanderRadius;

    /**
     *  [***advanced***]
     *  [Range: 5 - 500 ]
     *  [Default: 250 ]
     *  Distance the wander circle is offset from the agent's position.
     *  @type {Number}
     */
    wanderOffset;

    /**
     *  [***advanced***]
     *  [Range: 3 - 360 ]
     *  [Default: 20 ]
     *  Maximum number of degrees the wander target can move around the wander circle per frame.
     *  @type {Number}
     */
    maxWanderAngleChangePerFrame;

    /***********************************************************************************************/
    /********************************* Flee Behavior Parameters ************************************/
    /***********************************************************************************************/

    /**
     *  [Range: 3 - 20 ]
     *  [Default: 12 ]
     *  Maximum speed this agent can flee from the target.
     *  @type {Number}
     */
    maxFleeSpeed;

    /**
     *  [Range: 0.05 - 0.7 ]
     *  [Default: 0.5 ]
     *  Maximum acceleration this agent can reach during flee from target.
     *  @type {Number}
     */
    maxFleeAcceleration;

    /**
     *  [Range: - ]
     *  [Default: ]
     *  @type {Number}
     */
    fleePanicDistance;

    constructor(entity) {

        super(entity);

        // default parameters
        this.debugLogging = false;

        // wander state
        this.breakDurationAverage = 2000;
        this.breakDurationVariance = 1000;
        this.minWanderDuration = 150;

        this.minTargetDistanceForCharge = 200;
        this.maxTargetDistanceForCharge = 500;

        this.wanderFleeOrChargeWhenAttacked = true;
        this.wanderPanicDistance = 250;
        this.wanderFleeRate = 0.5;

        this.averageChargeDelay = 600;
        this.chargeDelayVariance = 400;

        this.wanderSensorRadiusPadding = 75;

        // flee state
        this.maxFleeDuration = 500;

        // charge state
        this.maxChargeDuration = 1500;

        // arrive behavior
        this.maxChargeSpeed = 9;
        this.maxChargeAcceleration = 0.4;

        this.innerDecelerationRadius = 12;
        this.outerDecelerationRadius = 30;

        // wander behavior
        this.maxWanderSpeed = 4;
        this.maxWanderAcceleration = 0.2;
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;

        // flee behavior
        this.maxFleeSpeed = 12;
        this.maxFleeAcceleration = 0.5;
        this.fleePanicDistance = 200;

        // attach components for this FSM
        this.sensorTightRadius = this.entity.shapeParams.radius + 2;

        this._sensor = this.entity.addComponent(PsyanimSensor);
        this._sensor.bodyShapeParams = {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: this.sensorTightRadius
        };

        this._sensor.events.on("triggerEnter", (entity) => {

            if (entity.name === this.target.name)
            {
                this.setStateVariable('chargeContact', true);
            }
        });

        // attach behaviors for this FSM
        this._vehicle = this.entity.addComponent(PsyanimVehicle);
        this._arriveBehavior = this.entity.addComponent(PsyanimArriveBehavior);
        this._seekBehavior = this.entity.addComponent(PsyanimSeekBehavior);
        this._wanderBehavior = this.entity.addComponent(PsyanimWanderBehavior);
        this._fleeBehavior = this.entity.addComponent(PsyanimFleeBehavior);
        
        // setup FSM
        this._chargeState = this.addState(PsyanimPlayfightChargeState);
        this._chargeDelayState = this.addState(PsyanimPlayfightChargeDelayState);
        this._wanderState = this.addState(PsyanimPlayfightWanderState);
        this._fleeState = this.addState(PsyanimPlayfightFleeState);

        this.initialState = this._wanderState;
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    onPause() {

        super.onPause();

        this.setStateVariable('chargeContact', false);
    }

    onStop() {

        super.onStop();

        this.setStateVariable('chargeContact', false);
    }

    onResume() {

        super.onResume();
    }

    afterCreate() {

        // charge state
        this._chargeState.sensor = this._sensor;
        this._chargeState.setTarget(this.target);
        this._chargeState.maxChargeDuration = this.maxChargeDuration;

        // charge delay state
        this._chargeDelayState.averageDelay = this.averageChargeDelay;
        this._chargeDelayState.delayVariance = this.chargeDelayVariance;

        // wander state
        this._wanderState.targetAgent = this.target;
        this._wanderState.breakDurationAverage = this.breakDurationAverage;
        this._wanderState.breakDurationVariance = this.breakDurationVariance;
        this._wanderState.minWanderDuration = this.minWanderDuration;
        this._wanderState.minTargetDistanceForCharge = this.minTargetDistanceForCharge;
        this._wanderState.maxTargetDistanceForCharge = this.maxTargetDistanceForCharge;
        this._wanderState.fleeOrChargeWhenAttacked = this.wanderFleeOrChargeWhenAttacked;
        this._wanderState.panicDistance = this.wanderPanicDistance;
        this._wanderState.fleeRate = this.wanderFleeRate;

        this._wanderState.sensorTightRadius = this.sensorTightRadius;
        this._wanderState.sensorAvoidanceRadius = this.entity.shapeParams.radius + this.wanderSensorRadiusPadding;

        // flee state
        this._fleeState.target = this.target;
        this._fleeState.maxFleeDuration = this.maxFleeDuration;
        this._fleeState.maxSpeed = this.maxFleeSpeed;
        this._fleeState.maxAcceleration = this.maxFleeAcceleration;

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

        // flee behavior
        this._fleeBehavior.maxSpeed = this.maxFleeSpeed;
        this._fleeBehavior.maxAcceleration = this.maxFleeAcceleration;
        this._fleeBehavior.panicDistance = this.fleePanicDistance;

        super.afterCreate();
    }

    beforeShutdown() {

        super.beforeShutdown();
    }

    update(t, dt) {
        
        super.update(t, dt);
    }
}