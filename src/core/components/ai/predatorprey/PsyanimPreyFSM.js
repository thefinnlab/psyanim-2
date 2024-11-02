import PsyanimFSM from '../PsyanimFSM.js';

import PsyanimVehicle from '../../steering/PsyanimVehicle.js';
import PsyanimSeekBehavior from '../../steering/PsyanimSeekBehavior.js';
import PsyanimWanderBehavior from '../../steering/PsyanimWanderBehavior.js';
import PsyanimFleeBehavior from '../../steering/PsyanimFleeBehavior.js';


import PsyanimPreyWanderState from './PsyanimPreyWanderState.js';
import PsyanimPreyFleeState from './PsyanimPreyFleeState.js';
import PsyanimPreyWallAvoidanceState from './PsyanimPreyWallAvoidanceState.js';
import PsyanimPreyMovementLagState from './PsyanimPreyMovementLagState.js';

/**
 *  `PsyanimPreyFSM` implements the `Prey v2` algorithm.
 * 
 *  Members marked with the `[advanced]` tag typically don't need to be modified. Although they can be modified, doing so can require tuning of several other parameters.
 */
export default class PsyanimPreyFSM extends PsyanimFSM {

    /***********************************************************************************************/
    /************************************ Prey FSM Parameters **************************************/
    /***********************************************************************************************/

    /**
     *  Agent which this prey will watch and avoid.
     *  @type {PsyanimEntity}
     */
    target;

    /**
     *  [Range: 0 - 180 ]
     *  [Default: 30 ]
     *  Maximum number of degrees which this agent will offset it's flee direction.
     *  @type {Number}
     */
    subtlety;

    /**
     *  [Range: 0 - 10000 ]
     *  [Default: 500 ]
     *  Determines how often the agent will recompute it's flee direction based on the `subtlety` parameter.
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

    /***********************************************************************************************/
    /********************************** Wander State Parameters ************************************/
    /***********************************************************************************************/

    /**
     *  [Range: 0.5 - 10.0 ]
     *  [Default: 3 ]
     *  Maximum speed at which the agent will wander.
     *  @type {Number}
     */
    maxWanderSpeed;

    /**
     *  [Range: 0.05 - 0.4 ]
     *  [Default: 0.2 ]
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
     *  [Default: 20 ]
     *  Maximum number of degrees the wander target can move around the wander circle per frame.
     *  @type {Number}
     */
    maxWanderAngleChangePerFrame;

    /***********************************************************************************************/
    /*********************************** Flee State Parameters *************************************/
    /***********************************************************************************************/

    /**
     *  [Range: 50 - 600 ]
     *  [Default: 250 ]
     *  Min. distance, in 'px', to target in which this agent will flee to maintain.
     *  @type {Number}
     */
    panicDistance;

    /**
     *  [Range: 0.5 - 10.0 ]
     *  [Default: 3 ]
     *  Max. speed agent can travel at when fleeing from target agent
     *  @type {Number}
     */
    maxFleeSpeed;

    /**
     *  [Range: 0.05 - 4.0 ]
     *  [Default: 0.2 ]
     *  Max. rate at which agent can accelerate when fleeing from target agent
     *  @type {Number}
     */
    maxFleeAcceleration;

    /**
     *  [***advanced***]
     *  [Range: 25 - 200 ]
     *  [Default: 50 ]
     *  Minimum distance from all screen boundaries required for this agent to remain in 'Flee' state.
     * 
     *  If distance to any screen boundary is less than this distance, agent will transition to wall avoidance.
     *  @type {Number}
     */
    minimumWallSeparation;

    /***********************************************************************************************/
    /******************************** Wall Avoidance State Parameters ******************************/
    /***********************************************************************************************/

    /**
     *  [***advanced***]
     *  [Range: 5 - 90]
     *  [Default: 10]
     *  Maximum number of degrees which this agent will offset it's flee direction during wall avoidance.
     *  @type {Number}
     */
    wallAvoidanceSubtlety;

    /**
     *  [***advanced***]
     *  [Range: 0 - 10000 ]
     *  [Default: 1000 ]
     *  Determines how often the agent will recompute it's flee direction based on the `wallAvoidanceSubtlety` parameter.
     *  @type {Number}
     */    
    wallAvoidanceSubtletyLag;

    /**
     *  [***advanced***]
     *  List of points in the world where agent can seek away from wall before returning to a wander state.
     * 
     *  @type {Object[]}
     *  @property {Number} x
     *  @property {Number} y
     */
    seekTargetLocations;

    /**
     *  [***advanced***]
     *  Distance from current seek target before agent is considered to have reached it 
     *  and transitions back to wander state.
     * 
     *  @type {Number}
     */
    seekTargetStoppingDistance;

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

        // prey FSM params
        this.subtlety = 30;
        this.subtletyLag = 500;

        // wander state params
        this.maxWanderSpeed = 3;
        this.maxWanderAcceleration = 0.2;
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;

        // flee state params
        this.panicDistance = 250;
        this.maxFleeSpeed = 3;
        this.maxFleeAcceleration = 0.2;
        this.minimumWallSeparation = 50;

        // movement lag state params
        this.movementLag = 0;
        this.movementLagDetectionTarget = null;

        // wall avoidance params
        this.wallAvoidanceSubtlety = 10;
        this.wallAvoidanceSubtletyLag = 1000;

        this.seekTargetStoppingDistance = 50;

        this.seekTargetLocations = [
            { x: 400, y: 450 }, // bottom middle
            { x: 150, y: 450 }, // bottom left
            { x: 650, y: 450 }, // bottom right
            { x: 400, y: 150 }, // top middle
            { x: 150, y: 150 }, // top left
            { x: 650, y: 150 }, // top right
            { x: 150, y: 300 }, // left middle
            { x: 650, y: 300 }, // right middle
        ];

        // vehicle component
        this.nSamplesForLookSmoothing = 16;

        // attach behaviors for this FSM
        this._vehicle = this.entity.addComponent(PsyanimVehicle);
        this._seekBehavior = this.entity.addComponent(PsyanimSeekBehavior);
        this._wanderBehavior = this.entity.addComponent(PsyanimWanderBehavior);
        this._fleeBehavior = this.entity.addComponent(PsyanimFleeBehavior);

        // setup fsm
        this._wanderState = this.addState(PsyanimPreyWanderState);
        this._fleeState = this.addState(PsyanimPreyFleeState);
        this._wallAvoidanceState = this.addState(PsyanimPreyWallAvoidanceState);
        this._movementLagState = this.addState(PsyanimPreyMovementLagState);

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

        // flee state
        this._fleeState.target = this.target;
        this._fleeState.subtlety = this.subtlety;
        this._fleeState.subtletyLag = this.subtletyLag;

        // wall avoidance state
        this._wallAvoidanceState.target = this.target;
        this._wallAvoidanceState.subtlety = this.wallAvoidanceSubtlety;
        this._wallAvoidanceState.subtletyLag = this.wallAvoidanceSubtletyLag;

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
        this._fleeBehavior.panicDistance = this.panicDistance;

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