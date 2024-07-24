import Phaser from 'phaser';

import PsyanimEntity from '../../../PsyanimEntity.js';

import PsyanimComponent from '../../../PsyanimComponent.js';

import { PsyanimDebug } from 'psyanim-utils';

import PsyanimBehaviorTreeBlackboard from './PsyanimBehaviorTreeBlackboard.js';

import PsyanimBehaviorTree from 'PsyanimBehaviorTree.js';

import PsyanimVehicle from '../../steering/PsyanimVehicle.js';

import PsyanimArriveBehavior from '../../steering/PsyanimArriveBehavior.js';

export default class PsyanimAIController extends PsyanimComponent {

    taskDefinitions;
    behaviorTreeFilePath;

    /**
     *  Maximum speed this entity's vehicle can travel.
     *  @type {Number}
     */
    maxSpeed;

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

        this.behaviorTreeFilePath = '';
        this.taskDefinitions = [];

        this._tree = null;
        this._blackboard = null;

        this.maxSpeed = 8;
        this.innerDecelerationRadius = 25;
        this.outerDecelerationRadius = 140;

        this._vehicle = entity.addComponent(PsyanimVehicle);

        this._arriveBehavior = entity.addComponent(PsyanimArriveBehavior);

        this._arriveBehavior.maxSpeed = this.maxSpeed;
        this._arriveBehavior.innerDecelerationRadius = this.innerDecelerationRadius;
        this._arriveBehavior.outerDecelerationRadius = this.outerDecelerationRadius;

        // empty target we'll use for 'moveTo'
        this._moveToTarget = this.scene.addEntity(this.entity.name + '_moveToTarget');

        this._state = PsyanimAIController.STATE.IDLE;
    }

    afterCreate() {

        super.afterCreate();

        this._blackboard = this.getComponent(PsyanimBehaviorTreeBlackboard);

        this._loadBehaviorTree();
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

        console.warn('TODO: implement flee on AI controller!');

        this._reset();

        this._state = PsyanimAIController.STATE.FLEE;
    }

    moveTo(position) {

        console.log('Moving to position:', position);

        this._reset();

        this._moveToTarget.x = position.x;
        this._moveToTarget.y = position.y;

        this._state = PsyanimAIController.STATE.MOVE_TO;
    }

    idle() {
        
        console.log('Idling');

        this._reset();

        this._vehicle.stop();

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
    }

    /*************************************************************************************
     ******************************* Private Methods *************************************
     *************************************************************************************/

    _reset() {

        this._followTarget = null;
    }

    _loadBehaviorTree() {

        // TODO: see if we can import a js object from a json file so we don't have to request it 
        // from the server... should be something that vite does at build time:

        // https://stackoverflow.com/questions/67822238/how-to-import-a-json-file-using-vite-dynamicly

        // this poster says you should be able to simply use a normal import:
        // https://github.com/vitejs/vite/discussions/8242



        // let jsonData = 

        // this._tree = PsyanimBehaviorTree.fromJson(jsonData);

        // TODO: validation
    }
}

const AI_CONTROLLER_STATE = {
    IDLE: 0x00,
    FOLLOW_TARGET: 0x01,
    FLEE: 0x02,
    MOVE_TO: 0x04,
};

PsyanimAIController.STATE = AI_CONTROLLER_STATE;