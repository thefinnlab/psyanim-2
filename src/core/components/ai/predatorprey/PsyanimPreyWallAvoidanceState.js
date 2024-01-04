import PsyanimFSMState from "../PsyanimFSMState.js";

import PsyanimVehicle from "../../steering/PsyanimVehicle.js";
import PsyanimFleeBehavior from "../../steering/PsyanimFleeBehavior.js";

import PsyanimPreyFleeState from "./PsyanimPreyFleeState.js";

export default class PsyanimPreyWallAvoidanceState extends PsyanimFSMState {

    minimumWallSeparation;

    constructor(fsm) {

        super(fsm);

        this.minimumWallSeparation = 200;

        this.fsm.setStateVariable('distanceToWall', 0);

        this._canvasHeight = this.entity.scene.game.config.height;
        this._canvasWidth = this.entity.scene.game.config.width;

        console.log('canvas size = (', this._canvasHeight, ', ', this._canvasWidth, ')');

        this.addTransition(PsyanimPreyFleeState, 'distanceToWall', this._canTransitionToFleeState.bind(this));
    }

    _canTransitionToFleeState(distanceToWall) {

        return distanceToWall > this.minimumWallSeparation;
    }

    afterCreate() {

        super.afterCreate();

        this._vehicle = this.entity.getComponent(PsyanimVehicle);
        this._fleeBehavior = this.entity.getComponent(PsyanimFleeBehavior);
    }

    enter() {

        super.enter();

        if (this.fsm.debug)
        {
            this.entity.color = 0xffff00;
        }
    }

    exit() {

        super.exit();
    }

    _computeClosestDistanceToWall() {

        let leftDistance = this.entity.position.x;
        let rightDistance = this._canvasWidth - this.entity.position.x;
        let topDistance = this.entity.position.y;
        let bottomDistance = this._canvasHeight - this.entity.position.y;

        let closestDistance = Math.max(leftDistance, rightDistance, topDistance, bottomDistance);

        // TODO: need to compute which wall was closest too!

        this.fsm.setStateVariable('distanceToWall', closestDistance);
    }

    run(t, dt) {

        super.run(t, dt);

        this._computeClosestDistanceToWall();

        // TODO: need to compute a flee target location based on wall calcs


        let steering = this._fleeBehavior.getSteering(/** TODO: see last TODO */);

        this._vehicle.steer(steering);
    }
}