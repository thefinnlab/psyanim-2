import Phaser from 'phaser';

import PsyanimEntity from '../../../PsyanimEntity.js';

import PsyanimComponent from '../../../PsyanimComponent.js';

import { PsyanimDebug } from 'psyanim-utils';

import PsyanimBehaviorTreeBlackboard from './PsyanimBehaviorTreeBlackboard.js';

import PsyanimVehicle from '../../steering/PsyanimVehicle.js';

import PsyanimArriveBehavior from '../../steering/PsyanimArriveBehavior.js';
import PsyanimFleeBehavior from '../../steering/PsyanimFleeBehavior.js';

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

        this.maxSpeed = 8;
        this.maxAcceleration = 0.3;

        this.innerDecelerationRadius = 25;
        this.outerDecelerationRadius = 140;

        // TODO: should be able to set maxFleeSpeed/Accel and maxArriveSpeed/Accel
        // to values smaller than maxSpeed and maxAcceleration

        // add vehicle
        this._vehicle = entity.addComponent(PsyanimVehicle);

        // add arrive behavior
        this._arriveBehavior = entity.addComponent(PsyanimArriveBehavior);

        this._arriveBehavior.maxSpeed = this.maxSpeed;
        this._arriveBehavior.innerDecelerationRadius = this.innerDecelerationRadius;
        this._arriveBehavior.outerDecelerationRadius = this.outerDecelerationRadius;

        // add flee behavior
        this._fleeBehavior = entity.addComponent(PsyanimFleeBehavior);

        this._fleeBehavior.maxSpeed = this.maxSpeed;
        this._fleeBehavior.maxAcceleration = this.maxAcceleration;
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

    follow(targetEntity) {

        console.log('Following entity:', targetEntity.name);

        this._reset();

        this._followTarget = targetEntity;

        this._state = PsyanimAIController.STATE.FOLLOW_TARGET;
    }

    flee(targetEntity) {

        console.log('Fleeing from entity:', targetEntity.name);

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
        
        console.log('Idling');

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

        if (this._state === PsyanimAIController.STATE.FOLLOW_TARGET)
        {
            let steering = this._arriveBehavior.getSteering(this._followTarget);

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
    }

    /*************************************************************************************
     ******************************* Private Methods *************************************
     *************************************************************************************/

    _reset() {

        this._followTarget = null;
        this._fleeTarget = null;
    }

    _loadBehaviorTree() {

        this._tree = new PsyanimBehaviorTree('TODO Get BT Name From file', this);

        this._tree.load(this.behaviorTreeDefinition, this.taskDefinitions);
    }
}

const AI_CONTROLLER_STATE = {
    IDLE: 0x00,
    FOLLOW_TARGET: 0x01,
    FLEE: 0x02,
    MOVE_TO: 0x04,
};

PsyanimAIController.STATE = AI_CONTROLLER_STATE;