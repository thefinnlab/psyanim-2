import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimVehicle from './PsyanimVehicle';
import PsyanimWander from './PsyanimWander';

export default class PsyanimPlayfight extends PsyanimComponent {

    static STATE = {
        WANDERING: 0x0001,
        CHARGING: 0x0002
    }

    breakDuration = 1500;

    vehicle = null;
    wander = null;

    constructor(entity) {

        super(entity);

        this._state = PsyanimPlayfight.STATE.WANDERING;

        this._wanderTimer = 0;
    }

    setChargeTarget(target) {

        if (this._chargeTarget != null)
        {
            this.setOnCollideWith(this._chargeTarget.body, null);   
        }

        this._chargeTarget = target;

        this.entity.setOnCollideWith(this._chargeTarget.body, () => this._handleCollision());
    }

    _handleCollision() {

        this.setState(PsyanimPlayfight.STATE.WANDERING);
    }

    setState(state) {

        this._state = state;

        switch (state) {

            case PsyanimPlayfight.STATE.CHARGING:

                this.wander.enabled = false;

                this.vehicle.target = this._chargeTarget;
                this.vehicle.maxSpeed = 8;
                this.vehicle.setState(PsyanimVehicle.STATE.ARRIVE);

                break;

            case PsyanimPlayfight.STATE.WANDERING:

                this.wander.enabled = true;

                this._wanderTimer = 0;

                break;
        }
    }

    update(t, dt) {

        super.update(t, dt);

        if (PsyanimPlayfight.STATE.WANDERING)
        {
            this._wanderTimer += dt;

            if (this._wanderTimer >= this.breakDuration)
            {
                this.setState(PsyanimPlayfight.STATE.CHARGING);
            }
        }
    }
}