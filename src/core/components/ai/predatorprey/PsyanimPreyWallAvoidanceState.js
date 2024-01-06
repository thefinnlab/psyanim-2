import PsyanimFSMState from "../PsyanimFSMState.js";

import PsyanimVehicle from "../../steering/PsyanimVehicle.js";
import PsyanimSeekBehavior from "../../steering/PsyanimSeekBehavior.js";
import PsyanimFleeBehavior from "../../steering/PsyanimFleeBehavior.js";
import PsyanimArriveBehavior from "../../steering/PsyanimArriveBehavior.js";

import PsyanimPreyWanderState from './PsyanimPreyWanderState.js';

import { PsyanimUtils } from 'psyanim-utils';

export default class PsyanimPreyWallAvoidanceState extends PsyanimFSMState {

    target;

    seekTargetStoppingDistance;

    seekTargetLocations;

    constructor(fsm) {

        super(fsm);

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

        this.fsm.setStateVariable('wander', false);

        this._canvasHeight = this.entity.scene.game.config.height;
        this._canvasWidth = this.entity.scene.game.config.width;

        this._seekTarget = this.entity.scene.addEntity(this.entity.name + '_wallAvoidanceState');

        this.addTransition(PsyanimPreyWanderState, 'wander', (value) => value === true);
    }

    afterCreate() {

        super.afterCreate();

        this._vehicle = this.entity.getComponent(PsyanimVehicle);
        this._fleeBehavior = this.entity.getComponent(PsyanimFleeBehavior);
        this._seekBehavior = this.entity.getComponent(PsyanimSeekBehavior);
    }

    enter() {

        super.enter();

        this.fsm.setStateVariable('wander', false);

        this._seekBehavior.maxSpeed = this._fleeBehavior.maxSpeed;
        this._seekBehavior.maxAcceleration = this._fleeBehavior.maxAcceleration;

        let index = PsyanimUtils.getRandomInt(0, this.seekTargetLocations.length - 1);

        this._seekTarget.position = this.seekTargetLocations[index];

        if (this.fsm.debug)
        {
            this.entity.color = 0xffff00;
        }
    }

    exit() {

        super.exit();
    }

    _canTransitionToWander() {

        let distanceToSeekTarget = this.entity.position
            .subtract(this._seekTarget.position)
            .length();

        let distanceToTarget = this.entity.position
            .subtract(this.target.position)
            .length();

        let hasReachedSeekTarget = distanceToSeekTarget < this.seekTargetStoppingDistance;

        let surroundingAreaIsSafe = distanceToTarget > this._fleeBehavior.panicDistance;

        return (hasReachedSeekTarget || surroundingAreaIsSafe);
    }

    run(t, dt) {

        super.run(t, dt);

        let steering = this._seekBehavior.getSteering(this._seekTarget);

        if (this._canTransitionToWander())
        {
            this.fsm.setStateVariable('wander', true);
        }
        else
        {
            this._vehicle.steer(steering);
        }
    }
}