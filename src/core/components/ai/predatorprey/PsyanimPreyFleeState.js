import PsyanimFSMState from "../PsyanimFSMState.js";

import PsyanimVehicle from "../../steering/PsyanimVehicle.js";
import PsyanimFleeBehavior from "../../steering/PsyanimFleeBehavior.js";

import PsyanimPreyWanderState from "./PsyanimPreyWanderState.js";
import PsyanimPreyWallAvoidanceState from "./PsyanimPreyWallAvoidanceState.js";

export default class PsyanimPreyFleeState extends PsyanimFSMState {

    target;

    minimumWallSeparation;

    constructor(fsm) {

        super(fsm);

        this.minimumWallSeparation = 50;

        this.fsm.setStateVariable('distanceToTarget', Infinity);
        this.fsm.setStateVariable('avoidWalls', false);

        this.addTransition(PsyanimPreyWanderState, 'distanceToTarget', this._canTransitionToWander.bind(this));
        this.addTransition(PsyanimPreyWallAvoidanceState, 'avoidWalls', (value) => value === true);
    }

    _canTransitionToWander(distanceToTarget) {

        return distanceToTarget > this._fleeBehavior.panicDistance;
    }

    afterCreate() {

        super.afterCreate();

        this._vehicle = this.entity.getComponent(PsyanimVehicle);
        this._fleeBehavior = this.entity.getComponent(PsyanimFleeBehavior);
    }

    enter() {

        super.enter();

        this._computeDistanceToTarget();

        this.fsm.setStateVariable('avoidWalls', false);

        if (this.fsm.debug)
        {
            this.entity.color = 0x0000ff;
        }
    }

    exit() {

        super.exit();
    }

    _computeDistanceToTarget() {

        let distanceToTarget = this.target.position
            .subtract(this.entity.position)
            .length();

        this.fsm.setStateVariable('distanceToTarget', distanceToTarget);
    }

    run(t, dt) {

        super.run(t, dt);

        this._computeDistanceToTarget();

        let closesetWallDistance = Math.min(...(this.entity.computeDistancesToScreenBoundaries()));

        if (closesetWallDistance < this.minimumWallSeparation)
        {
            this.fsm.setStateVariable('avoidWalls', true);
        }

        let steering = this._fleeBehavior.getSteering(this.target);

        this._vehicle.steer(steering);
    }
}