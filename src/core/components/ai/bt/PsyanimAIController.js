import Phaser from 'phaser';

import PsyanimEntity from '../../../PsyanimEntity.js';

import PsyanimComponent from '../../../PsyanimComponent.js';

import { PsyanimDebug } from 'psyanim-utils';

import PsyanimBehaviorTreeBlackboard from './PsyanimBehaviorTreeBlackboard.js';

import PsyanimVehicle from '../../steering/PsyanimVehicle.js';

import PsyanimArriveBehavior from '../../steering/PsyanimArriveBehavior.js';
import PsyanimFleeBehavior from '../../steering/PsyanimFleeBehavior.js';

import PsyanimSeekBehavior from '../../steering/PsyanimSeekBehavior.js';
import PsyanimWanderBehavior from '../../steering/PsyanimWanderBehavior.js';

import PsyanimBehaviorTree from './PsyanimBehaviorTree.js';

export default class PsyanimAIController extends PsyanimComponent {

    taskDefinitions;
    behaviorTreeDefinition;

    /**********************************************************************/
    /************************ General Parameters **************************/
    /**********************************************************************/

    /**
     *  Maximum speed this entity's vehicle can travel.
     *  @type {Number}
     */
    maxSpeed;

    /**
     *  Maximum acceleration this entity's vehicle can attain.
     */
    maxAcceleration;

    /**
     *  Distance, in px, from target which agent will come to rest.
     *  @type {Number}
     */
    innerDecelerationRadius;

    /**
     *  Distance, in px, from target which the agent will begin slowing down.
     *  @type {Number}
     */
    outerDecelerationRadius;

    /**********************************************************************/
    /************************* Seek Parameters ****************************/
    /**********************************************************************/

    /**
     *  [Range: 3 - 20 ]
     *  [Default: 9 ]
     *  Maximum speed at which this agent can move toward it's target.
     *  @type {Number}
     */
    maxSeekSpeed;

    /**
     *  [Range: 0.05 - 0.7 ]
     *  [Default: 0.4 ]
     *  Maximum acceleration this agent can reach when charging at it's target.
     *  @type {Number}
     */
    maxSeekAcceleration;

    /**********************************************************************/
    /************************* Arrive Parameters **************************/
    /**********************************************************************/

    /**
     *  [Range: 3 - 20 ]
     *  [Default: 9 ]
     *  Maximum speed at which this agent can move toward it's target.
     *  @type {Number}
     */
    maxArriveSpeed;

    /**
     *  [Range: 0.05 - 0.7 ]
     *  [Default: 0.4 ]
     *  Maximum acceleration this agent can reach when charging at it's target.
     *  @type {Number}
     */
    maxArriveAcceleration;

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

    /**********************************************************************/
    /************************ Wander Parameters **************************/
    /**********************************************************************/

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

    /**********************************************************************/
    /************************** Flee Parameters ***************************/
    /**********************************************************************/

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

    /**********************************************************************/
    /************************** Chase Parameters **************************/
    /**********************************************************************/

    subtlety; // degrees
    subtletyLag; // ms

    maxChaseSpeed;
    maxChaseAcceleration;

    chaseInnerDecelerationRadius;
    chaseOuterDecelerationRadius;

    /**********************************************************************/
    /************************ General Properties **************************/
    /**********************************************************************/

    get blackboard() {

        return this._blackboard;
    }

    get tree() {

        return this._tree;
    }

    /*************************************************************************************
     ******************************** Initialization *************************************
     *************************************************************************************/

    constructor(entity) {

        super(entity);

        /**
         *  Initialize default values
         */

        this.behaviorTreeDefinition = null;
        this.taskDefinitions = [];

        this._tree = null;
        this._blackboard = null;

        // seek behavior defaults
        this.maxSeekSpeed = 4;
        this.maxSeekAcceleration =  0.4;

        // arrive behavior defaults
        this.maxArriveSpeed = 8;
        this.maxArriveAcceleration = 0.3;

        this.innerDecelerationRadius = 25;
        this.outerDecelerationRadius = 140;

        // wander behavior defaults
        this.maxWanderSpeed = 4;
        this.maxWanderAcceleration = 0.4;
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;

        // flee behavior defaults
        this.maxFleeSpeed = 8;
        this.maxFleeAcceleration = 0.3;
        this.fleePanicDistance = 250;

        // chase behavior
        this.subtlety = 30; // degrees
        this.subtletyLag = 500; // ms

        this.maxChaseSpeed = 3;
        this.maxChaseAcceleration = 0.2;

        this.chaseInnerDecelerationRadius = 12;
        this.chaseOuterDecelerationRadius = 30;

        this._subtletyAngle = 0;
        this._subtletyUpdateTimer = 0;

        this._realChaseTarget = this.entity.scene.addEntity(this.entity.name + "_realChaseTarget");

        /**
         *  Add required components
         */

        // add vehicle
        this._vehicle = entity.addComponent(PsyanimVehicle);

        // add seek behavior
        this._seekBehavior = entity.addComponent(PsyanimSeekBehavior);

        // add wander behavior
        this._wanderBehavior = entity.addComponent(PsyanimWanderBehavior);

        // add arrive behavior
        this._arriveBehavior = entity.addComponent(PsyanimArriveBehavior);

        // add flee behavior
        this._fleeBehavior = entity.addComponent(PsyanimFleeBehavior);

        // empty target we'll use for 'moveTo'
        this._moveToTarget = this.scene.addEntity(this.entity.name + '_moveToTarget');

        this._state = PsyanimAIController.STATE.IDLE;
    }

    afterCreate() {

        super.afterCreate();

        this._blackboard = this.entity.getComponent(PsyanimBehaviorTreeBlackboard);

        this._blackboard.events.on('created', () => this._loadBehaviorTree());

        // seek behavior
        this._seekBehavior.maxSpeed = this.maxSeekSpeed;
        this._seekBehavior.maxAcceleration = this.maxSeekAcceleration;

        // wander behavior
        this._wanderBehavior.seekBehavior = this._seekBehavior;
        this._wanderBehavior.maxSeekSpeed = this.maxWanderSpeed;
        this._wanderBehavior.maxSeekAcceleration = this.maxWanderAcceleration;
        this._wanderBehavior.radius = this.wanderRadius;
        this._wanderBehavior.offset = this.wanderOffset;
        this._wanderBehavior.maxWanderAngleChangePerFrame = this.maxWanderAngleChangePerFrame;

        // arrive behavior
        this._arriveBehavior.maxSpeed = this.maxArriveSpeed;
        this._arriveBehavior.maxAcceleration = this.maxArriveAcceleration;
        this._arriveBehavior.innerDecelerationRadius = this.innerDecelerationRadius;
        this._arriveBehavior.outerDecelerationRadius = this.outerDecelerationRadius;

        // flee behavior
        this._fleeBehavior.maxSpeed = this.maxFleeSpeed;
        this._fleeBehavior.maxAcceleration = this.maxFleeAcceleration;
        this._fleeBehavior.panicDistance = this.fleePanicDistance;
    }

    /*************************************************************************************
     ******************************** Public Methods *************************************
     *************************************************************************************/

    wander() {

        this._reset();

        this._state = PsyanimAIController.STATE.WANDER;
    }

    arrive(targetEntity) {

        this._reset();

        this._arriveTarget = targetEntity;

        this._state = PsyanimAIController.STATE.ARRIVE;
    }

    seek(targetEntity, maxSpeed = -1, maxAcceleration = -1) {

        if (maxSpeed > 0)
        {
            this.maxSeekSpeed = maxSpeed;
        }

        if (maxAcceleration > 0)
        {
            this.maxSeekAcceleration = maxAcceleration;
        }

        this._seekBehavior.maxSpeed = this.maxSeekSpeed;
        this._seekBehavior.maxAcceleration = this.maxSeekAcceleration;

        this._seekTarget = targetEntity;

        this._state = PsyanimAIController.STATE.SEEK;
    }

    flee(targetEntity) {

        this._reset(true);

        this._fleeTarget = targetEntity;

        this._state = PsyanimAIController.STATE.FLEE;
    }

    moveTo(position) {

        this._reset(true);

        this._moveToTarget.x = position.x;
        this._moveToTarget.y = position.y;

        this._state = PsyanimAIController.STATE.MOVE_TO;
    }

    idle(stopImmediately = false) {

        this._reset();

        if (stopImmediately)
        {
            this._vehicle.stop();
        }

        this._state = PsyanimAIController.STATE.IDLE;
    }

    _recomputeSubtletyAngle() {

        this._subtletyAngle = this.subtlety * (2 * Math.random() - 1);
    }

    _calculateChaseTargetPosition() {

        let targetRelativePosition = this._chaseTarget.position
            .subtract(this.entity.position);

        targetRelativePosition.rotate(this._subtletyAngle * Math.PI / 180);

        return this.entity.position
            .add(targetRelativePosition);
    }

    _updateChaseTargetPosition() {

        let newTargetPosition = null;

        // attempt to keep the target within canvas
        for (let i = 0; i < 200; ++i)
        {
            newTargetPosition = this._calculateChaseTargetPosition();

            if (this.entity.scene.screenBoundary.isPointInBounds(newTargetPosition))
            {
                break;
            }

            this._recomputeSubtletyAngle();
        }

        this._chaseTarget.position = newTargetPosition;
    }

    _updateSubtlety(dt) {

        this._subtletyUpdateTimer += dt;

        if (this._subtletyUpdateTimer > this.subtletyLag)
        {
            this._subtletyUpdateTimer = 0;

            this._recomputeSubtletyAngle();
        }
    }

    chase(targetEntity) {

        this._reset();

        this._chaseTarget = targetEntity;

        this._subtletyUpdateTimer = 0;
        this._recomputeSubtletyAngle();

        this._state = PsyanimAIController.STATE.CHASE;
    }

    onEnable() {

        super.onEnable();
    }

    onDisable() {

        super.onDisable();
    }

    beforeShutdown() {

        super.beforeShutdown();
    }

    onSensorEnter(entity) {

        super.onSensorEnter(entity);
    }

    onSensorExit(entity) {

        super.onSensorExit(entity);
    }

    update(t, dt) {
        
        super.update(t, dt);

        if (!this._tree)
        {
            return;
        }

        // run behavior tree
        this._tree.tick(t, dt);

        if (this._state === PsyanimAIController.STATE.SEEK)
        {
            let steering = this._seekBehavior.getSteering(this._seekTarget);

            this._vehicle.steer(steering);
        }
        else if (this._state === PsyanimAIController.STATE.ARRIVE)
        {
            let steering = this._arriveBehavior.getSteering(this._arriveTarget);

            this._vehicle.steer(steering);
        }
        else if (this._state === PsyanimAIController.STATE.MOVE_TO)
        {
            let steering = this._arriveBehavior.getSteering(this._moveToTarget);

            this._vehicle.steer(steering);
        }
        else if (this._state === PsyanimAIController.STATE.FLEE)
        {
            let steering = this._fleeBehavior.getSteering(this._fleeTarget);

            this._vehicle.steer(steering);
        }
        else if (this._state === PsyanimAIController.STATE.WANDER)
        {
            let steering = this._wanderBehavior.getSteering();

            this._vehicle.steer(steering);
        }
        else if (this._state === PsyanimAIController.STATE.CHASE)
        {
            this._updateSubtlety(dt);
            this._updateChaseTargetPosition();

            let steering = this._arriveBehavior.getSteering(this._chaseTarget);

            this._vehicle.steer(steering);
        }
    }

    /*************************************************************************************
     ******************************* Private Methods *************************************
     *************************************************************************************/

    _reset() {

        this._seekTarget = null;
        this._arriveTarget = null;
        this._fleeTarget = null;
        this._chaseTarget = null;
    }

    _loadBehaviorTree() {

        this._tree = new PsyanimBehaviorTree('TODO Get BT Name From file', this);

        this._tree.load(this.behaviorTreeDefinition, this.taskDefinitions);
    }
}

const AI_CONTROLLER_STATE = {
    IDLE: 0x00,
    ARRIVE: 0x01,
    FLEE: 0x02,
    MOVE_TO: 0x04,
    WANDER: 0x08,
    SEEK: 0x10,
    CHASE: 0x11
};

PsyanimAIController.STATE = AI_CONTROLLER_STATE;