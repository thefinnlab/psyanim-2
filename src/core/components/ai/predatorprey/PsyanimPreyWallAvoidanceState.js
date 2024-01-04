import PsyanimFSMState from "../PsyanimFSMState.js";

import PsyanimVehicle from "../../steering/PsyanimVehicle.js";
import PsyanimFleeBehavior from "../../steering/PsyanimFleeBehavior.js";
import PsyanimArriveBehavior from "../../steering/PsyanimArriveBehavior.js";

import PsyanimPreyWanderState from './PsyanimPreyWanderState.js';

export default class PsyanimPreyWallAvoidanceState extends PsyanimFSMState {

    minimumWallSeparation;

    useSeekTargets;

    seekTargetLocations;

    constructor(fsm) {

        super(fsm);

        this.minimumWallSeparation = 200;

        this.useSeekTargets = true;

        this.seekTargetLocations = [
            { x: 400, y: 450 }, // bottom middle
            { x: 400, y: 150 }, // top middle
            { x: 150, y: 300 }, // left middle
            { x: 650, y: 300 }, // right middle
        ];

        this.fsm.setStateVariable('wander', false);

        this._canvasHeight = this.entity.scene.game.config.height;
        this._canvasWidth = this.entity.scene.game.config.width;

        this._target = this.entity.scene.addEntity(this.entity.name + '_wallAvoidanceState');

        this.addTransition(PsyanimPreyWanderState, 'wander', (value) => value === true);
    }

    afterCreate() {

        super.afterCreate();

        this._vehicle = this.entity.getComponent(PsyanimVehicle);
        this._fleeBehavior = this.entity.getComponent(PsyanimFleeBehavior);
        this._arriveBehavior = this.entity.getComponent(PsyanimArriveBehavior);
    }

    enter() {

        super.enter();

        this.fsm.setStateVariable('wander', false);

        if (this.fsm.debug)
        {
            this.entity.color = 0xffff00;
        }
    }

    exit() {

        super.exit();
    }

    _computeWallDistances() {

        let walls = [
            {
                location: 'left',
                distance: this.entity.position.x
            },
            {
                location: 'right',
                distance: this._canvasWidth - this.entity.position.x
            },
            {
                location: 'top',
                distance: this.entity.position.y
            },
            {
                location: 'bottom',
                distance: this._canvasHeight - this.entity.position.y
            }
        ];

        walls.sort((a, b) => a.distance - b.distance);
    }

    _computeSeekTargetLocation(walls) {

        let closestWall = walls[0];
        let targetLocation = null;

        let centerX = this._canvasWidth / 2;
        let centerY = this._canvasHeight / 2;

        // TODO: don't hard-code seek target selection - randomly select a seek target
        if (closestWall.distance < this.minimumWallSeparation)
        {
            if (wall.location === 'left')
            {
                if (this.entity.position.y > centerY)
                {
                    targetLocation = this.seekTargetLocations[0];
                }
                else
                {
                    targetLocation = this.seekTargetLocations[1];
                }
            }
            else if (wall.location === 'right')
            {
                if (this.entity.position.y > centerY)
                {
                    targetLocation = this.seekTargetLocations[0];
                }
                else
                {
                    targetLocation = this.seekTargetLocations[1];
                }
            }
            else if (wall.location === 'top')
            {
                if (this.entity.position.x > centerX)
                {
                    targetLocation = this.seekTargetLocations[2];
                }
                else
                {
                    targetLocation = this.seekTargetLocations[3];
                }
            }
            else if (wall.location === 'bottom')
            {
                if (this.entity.position.x > centerX)
                {
                    targetLocation = this.seekTargetLocations[2];
                }
                else
                {
                    targetLocation = this.seekTargetLocations[3];
                }
            }
        }

        return targetLocation;
    }

    _computeFleeTargetLocation(walls) {

        /**
         * TODO: we have enough information here to let the agent flee from corners + middle points,
         * depending on what the situation is...
         * 
         * could also try seeking a different point on the canvas instead of fleeing from a wall!
         */

        let closestWall = walls[0];

        let targetLocation = null;

        if (closestWall.distance < this.minimumWallSeparation)
        {
            if (wall.location === 'left')
            {
                targetLocation = new Phaser.Math.Vector2(0, this._canvasHeight / 2);
            }
            else if (wall.location === 'right')
            {
                targetLocation = new Phaser.Math.Vector2(this._canvasWidth, this._canvasHeight / 2);
            }
            else if (wall.location === 'top')
            {
                targetLocation = new Phaser.Math.Vector2(this._canvasWidth / 2, 0);
            }
            else if (wall.location === 'bottom')
            {
                targetLocation = new Phaser.Math.Vector2(this._canvasWidth / 2, this._canvasHeight);
            }
        }

        return targetLocation;
    }

    run(t, dt) {

        super.run(t, dt);

        let walls = this._computeWallDistances();

        let steering = null;

        if (this.useSeekTargets)
        {
            let seekTargetLocation = this._computeSeekTargetLocation(walls);

            if (seekTargetLocation)
            {
                this._target.position = seekTargetLocation;

                steering = this._arriveBehavior.getSteering(this._target);
            }
        }
        else
        {
            let fleeTargetLocation = this._computeFleeTargetLocation(walls);

            if (fleeTargetLocation)
            {
                this._target.position = fleeTargetLocation;
    
                steering = this._fleeBehavior.getSteering(this._target);
            }
        }

        if (steering)
        {
            this._vehicle.steer(steering);
        }
        else
        {
            this.fsm.setStateVariable('wander', true);
        }    
    }
}