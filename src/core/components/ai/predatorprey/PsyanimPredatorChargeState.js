import PsyanimFSMState from "../PsyanimFSMState.js";

import PsyanimVehicle from "../../steering/PsyanimVehicle.js";
import PsyanimArriveBehavior from "../../steering/PsyanimArriveBehavior.js";

import PsyanimPredatorWanderState from "./PsyanimPredatorWanderState.js";

export default class PsyanimPredatorChargeState extends PsyanimFSMState {

    target;

    maxChargeDuration;

    constructor(fsm) {

        super(fsm);

        this.maxChargeDuration = 1000;

        this.fsm.setStateVariable('chargeDuration', 0);

        this.addTransition(PsyanimPredatorWanderState, 'chargeDuration', this._canTransitionToWanderState.bind(this));
    }

    _canTransitionToWanderState(chargeDuration) {

        return chargeDuration > this.maxChargeDuration;
    }

    afterCreate() {

        super.afterCreate();

        this._vehicle = this.entity.getComponent(PsyanimVehicle);
        this._arriveBehavior = this.entity.getComponent(PsyanimArriveBehavior);
    }

    enter() {

        super.enter();

        this.fsm.setStateVariable('chargeDuration', 0);

        if (this.fsm.debug)
        {
            this.entity.color = 0xff0000;
        }
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run(t, dt);

        let updatedChargeDuration = this.fsm.getStateVariable('chargeDuration') + dt;

        this.fsm.setStateVariable('chargeDuration', updatedChargeDuration);

        let steering = this._arriveBehavior.getSteering(this.target);

        this._vehicle.steer(steering);
    }
}