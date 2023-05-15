import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimVehicle from './PsyanimVehicle';
import PsyanimWander from './PsyanimWander';

export default class PsyanimPlayfight extends PsyanimComponent {

    static STATE = {
        WANDERING: 0x0001,
        CHARGING: 0x0002,
        FLEEING: 0x0004
    }

    breakDuration = 1500;

    maxChargeSpeed = 8;
    maxChargeAcceleration = 0.4;

    maxWanderSpeed = 2;
    maxWanderAcceleration = 0.2;

    maxFleeSpeed = 4;
    maxFleeAcceleration = 0.4;

    vehicle = null;
    wander = null;

    constructor(entity) {

        super(entity);

        this._state = PsyanimPlayfight.STATE.WANDERING;

        this._breakTimer = 0;
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

        this.setState(PsyanimPlayfight.STATE.FLEEING);
    }

    setState(state) {

        this._state = state;

        switch (state) {

            case PsyanimPlayfight.STATE.CHARGING:

                this.wander.enabled = false;

                this.vehicle.target = this._chargeTarget;

                // this.vehicle.maxSpeed = 8;

                // let deltaPosition = this._chargeTarget.position
                //     .subtract(this.entity.position)
                //     .scale(0.5);

                // let chargeDuration = (this.breakDuration - this._breakTimer);

                // /**
                //  *  From: https://github.com/liabru/matter-js/issues/179
                //  * 
                //  *  "Internally the engine uses MKS (meters, kilograms, and seconds) units 
                //  *  and radians for angles.
                //  * 
                //  *  If you use the built in renderer and and built in runner, with default 
                //  *  settings this translates to:
                //  *  
                //  *      1 position = 1 px
                //  *      1 speed = 1 px per step
                //  *      1 step = 16.666ms"
                //  */
                // let chargeDurationSteps = chargeDuration / 16.666;

                // let acceleration = deltaPosition
                //     .subtract(this.entity.velocity.scale(chargeDurationSteps))
                //     .scale(2 / (chargeDurationSteps * chargeDurationSteps))
                //     .length();

                // this.vehicle.maxAcceleration = acceleration;

                this.vehicle.maxSpeed = this.maxChargeSpeed;
                this.vehicle.maxChargeAcceleration = this.maxChargeAcceleration;

                this.vehicle.setState(PsyanimVehicle.STATE.ARRIVE);

                break;

            case PsyanimPlayfight.STATE.WANDERING:

                this.wander.enabled = true;

                this.wander.maxSpeed = this.maxWanderSpeed;
                this.vehicle.maxAcceleration = this.maxWanderAcceleration;

                this._breakTimer = 0;

                break;

            case PsyanimPlayfight.STATE.FLEEING:

                this.wander.enabled = false;

                this.vehicle.target = this._chargeTarget;
                this.vehicle.maxSpeed = this.maxFleeSpeed;
                this.vehicle.maxAcceleration = this.maxFleeAcceleration;

                this.vehicle.setState(PsyanimVehicle.STATE.ADVANCED_FLEE);

                break;
        }
    }

    update(t, dt) {

        super.update(t, dt);

        if (this._state == PsyanimPlayfight.STATE.WANDERING)
        {
            this._breakTimer += dt;

            if (this._breakTimer >= this.breakDuration)
            {
                this.setState(PsyanimPlayfight.STATE.CHARGING);
            }
        }
        else if (this._state == PsyanimPlayfight.STATE.FLEEING)
        {
            this._breakTimer += dt;

            let distanceToTarget = this.entity.position
                .subtract(this._chargeTarget.position)
                .length();

            if (distanceToTarget > this.vehicle.panicDistance)
            {
                this.setState(PsyanimPlayfight.STATE.WANDERING);
            }
        }
    }
}