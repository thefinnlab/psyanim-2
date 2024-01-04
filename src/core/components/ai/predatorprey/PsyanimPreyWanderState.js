import PsyanimFSMState from "../PsyanimFSMState.js";

import PsyanimPreyFleeState from './PsyanimPreyFleeState.js';
import PsyanimPreyWallAvoidanceState from './PsyanimPreyWallAvoidanceState.js';

import PsyanimVehicle from "../../steering/PsyanimVehicle.js";
import PsyanimFleeBehavior from "../../steering/PsyanimFleeBehavior.js";
import PsyanimWanderBehavior from "../../steering/PsyanimWanderBehavior.js";

export default class PsyanimPreyWanderState extends PsyanimFSMState {

    target;

    constructor(fsm) {

        super(fsm);

        this.fsm.setStateVariable('distanceToTarget', Infinity);
        this.fsm.setStateVariable('distanceToWall', Infinity);

        this.addTransition(PsyanimPreyFleeState, 'distanceToTarget', this._canTransitionToFleeState.bind(this));
        this.addTransition(PsyanimPreyWallAvoidanceState, 'distanceToWall', this._canTransitionToWallAvoidance.bind(this));
    }

    _canTransitionToFleeState(distanceToTarget) {

        return distanceToTarget < this._fleeBehavior.panicDistance;
    }

    _canTransitionToWallAvoidance(distanceToWall) {

        return false;
    }

    afterCreate() {

        super.afterCreate();

        this._vehicle = this.entity.getComponent(PsyanimVehicle);
        this._fleeBehavior = this.entity.getComponent(PsyanimFleeBehavior);
        this._wanderBehavior = this.entity.getComponent(PsyanimWanderBehavior);
    }

    _computeDistanceToTarget() {

        let distanceToTarget = this.target.position
            .subtract(this.entity.position)
            .length();

        this.fsm.setStateVariable('distanceToTarget', distanceToTarget);
    }

    enter() {

        super.enter();

        if (this.fsm.debug)
        {
            this.entity.color = 0x00ff00;
        }

        this._computeDistanceToTarget();

        this.fsm.setStateVariable('distanceToWall', Infinity);
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run(t, dt);

        this._computeDistanceToTarget();

        let steering = this._wanderBehavior.getSteering(this.target);

        this._vehicle.steer(steering);
    }
}