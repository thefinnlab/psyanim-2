import PsyanimFSMState from "../PsyanimFSMState.js";

import PsyanimPredatorChargeState from './PsyanimPredatorChargeState.js';
import PsyanimPredatorWallAvoidanceState from "./PsyanimPredatorWallAvoidanceState.js";

import PsyanimVehicle from "../../steering/PsyanimVehicle.js";
import PsyanimWanderBehavior from "../../steering/PsyanimWanderBehavior.js";

export default class PsyanimPredatorWanderState extends PsyanimFSMState {

    target;
    averageWanderTime;

    constructor(fsm) {

        super(fsm);

        this.averageWanderTime = 2000;

        this.fsm.setStateVariable('wanderTimer', 0);
        this.fsm.setStateVariable('distanceToWall', Infinity);

        this.addTransition(PsyanimPredatorChargeState, 'wanderTimer', this._canTransitionToChargeState.bind(this));
        this.addTransition(PsyanimPredatorWallAvoidanceState, 'distanceToWall', this._canTransitionToWallAvoidance.bind(this));
    }

    _canTransitionToChargeState(wanderTimer) {

        return wanderTimer > this.averageWanderTime;
    }

    _canTransitionToWallAvoidance(distanceToWall) {

        return false;
    }

    afterCreate() {

        super.afterCreate();

        this._vehicle = this.entity.getComponent(PsyanimVehicle);
        this._wanderBehavior = this.entity.getComponent(PsyanimWanderBehavior);
    }

    enter() {

        super.enter();

        if (this.fsm.debug)
        {
            this.entity.color = 0x00ff00;
        }

        this.fsm.setStateVariable('wanderTimer', 0);
        this.fsm.setStateVariable('distanceToWall', Infinity);
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run(t, dt);

        let updatedWanderTimer = this.fsm.getStateVariable('wanderTimer') + dt;

        this.fsm.setStateVariable('wanderTimer', updatedWanderTimer);

        let steering = this._wanderBehavior.getSteering(this.target);

        this._vehicle.steer(steering);
    }
}