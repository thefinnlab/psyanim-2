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

        this.behaviorTreeDefinition = null;
        this.taskDefinitions = [];

        this._tree = null;
        this._blackboard = null;

        this.innerDecelerationRadius = 25;
        this.outerDecelerationRadius = 140;

        // seek behavior defaults
        this.maxSeekSpeed = 4;
        this.maxSeekAcceleration =  0.4;

        // arrive behavior defaults
        this.maxArriveSpeed = 8;
        this.maxArriveAcceleration = 0.3;

        // wander behavior defaults
        this.wanderRadius = 50;
        this.wanderOffset = 250;
        this.maxWanderAngleChangePerFrame = 20;

        console.warn('TODO: should move AI controller component initialization to afterCreate()!');

        // TODO: should be able to set maxFleeSpeed/Accel and maxArriveSpeed/Accel
        // to values smaller than maxSpeed and maxAcceleration

        // add vehicle
        this._vehicle = entity.addComponent(PsyanimVehicle);

        // add seek behavior
        this._seekBehavior = entity.addComponent(PsyanimSeekBehavior);
        this._seekBehavior.maxSpeed = this.maxSeekSpeed;
        this._seekBehavior.maxAcceleration = this.maxSeekAcceleration;

        // add wander behavior
        this._wanderBehavior = entity.addComponent(PsyanimWanderBehavior);

        this._wanderBehavior.seekBehavior = this._seekBehavior;
        this._wanderBehavior.maxSeekSpeed = this.maxSeekSpeed;
        this._wanderBehavior.maxSeekAcceleration = this.maxSeekAcceleration;
        this._wanderBehavior.radius = this.wanderRadius;
        this._wanderBehavior.offset = this.wanderOffset;
        this._wanderBehavior.maxWanderAngleChangePerFrame = this.maxWanderAngleChangePerFrame;

        // add arrive behavior
        this._arriveBehavior = entity.addComponent(PsyanimArriveBehavior);

        this._arriveBehavior.maxSpeed = this.maxArriveSpeed;
        this._arriveBehavior.innerDecelerationRadius = this.innerDecelerationRadius;
        this._arriveBehavior.outerDecelerationRadius = this.outerDecelerationRadius;

        // add flee behavior
        this._fleeBehavior = entity.addComponent(PsyanimFleeBehavior);

        this._fleeBehavior.maxSpeed = this.maxArriveSpeed;
        this._fleeBehavior.maxAcceleration = this.maxArriveAcceleration;
        this._fleeBehavior.panicDistance = 250; // TODO: don't hardcode!

        // empty target we'll use for 'moveTo'
        this._moveToTarget = this.scene.addEntity(this.entity.name + '_moveToTarget');

        this._state = PsyanimAIController.STATE.IDLE;
    }

    afterCreate() {

        super.afterCreate();

        this._blackboard = this.entity.getComponent(PsyanimBehaviorTreeBlackboard);

        this._blackboard.events.on('created', () => this._loadBehaviorTree());
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
        this._tree.tick();

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
    }

    /*************************************************************************************
     ******************************* Private Methods *************************************
     *************************************************************************************/

    _reset() {

        this._seekTarget = null;
        this._arriveTarget = null;
        this._fleeTarget = null;
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
};

PsyanimAIController.STATE = AI_CONTROLLER_STATE;