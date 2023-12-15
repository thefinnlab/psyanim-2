import PsyanimFSMState from '../PsyanimFSMState.js';

import { PsyanimDebug } from 'psyanim-utils';

import PsyanimVehicle from '../../steering/PsyanimVehicle.js';
import PsyanimArriveBehavior from '../../steering/PsyanimArriveBehavior.js';

import PsyanimPlayfightWanderState from './PsyanimPlayfightWanderState.js'

export default class PsyanimPlayfightChargeState extends PsyanimFSMState {

    maxChargeDuration;

    constructor(fsm) {

        super(fsm);

        this.maxChargeDuration = 1500;

        this.fsm.setStateVariable('charge', false);
        this.fsm.setStateVariable('chargeTimer', 0);

        /**
         *  Setup transitions here
         */

        this.addTransition(PsyanimPlayfightWanderState, 'charge', (value) => value === false);
    }

    afterCreate() {

    }

    setTarget(target) {

        if (target) 
        {
            this.entity.setOnCollideWith(target.body, (matterCollisionData) => {
                this._handleCollision(matterCollisionData);
            });

            this._target = target;
        }
        else
        {
            PsyanimDebug.error('target field is null!');
        }
    }

    _handleCollision(matterCollisionData) {

        this.fsm.setStateVariable('charge', false);
    }

    enter() {

        super.enter();

        this._vehicle = this.entity.getComponent(PsyanimVehicle);
        this._arriveBehavior = this.entity.getComponent(PsyanimArriveBehavior);

        this.fsm.setStateVariable('charge', true);
        this.fsm.setStateVariable('chargeTimer', 0);

        if (this.fsm.debug)
        {
            this.entity.color = 0xff0000;
        }
    }

    exit() {

        super.exit();
    }

    run(t, dt) {

        super.run();

        let updatedChargeTimer = this.fsm.getStateVariable('chargeTimer') + dt;

        this.fsm.setStateVariable('chargeTimer', updatedChargeTimer);

        if (updatedChargeTimer > this.maxChargeDuration)
        {
            this.fsm.setStateVariable('charge', false);
        }

        let steering = this._arriveBehavior.getSteering(this._target);

        this._vehicle.steer(steering);
    }
}