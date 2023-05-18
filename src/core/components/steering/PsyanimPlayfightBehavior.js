import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimPlayfightBehavior extends PsyanimComponent {

    static STATE = {
        WANDERING: 0x0001,
        CHARGING: 0x0002,
        FLEEING: 0x0004
    }

    breakDuration = 1500;

    fleeBehavior = null;
    arriveBehavior = null;
    wanderBehavior = null;

    constructor(entity) {

        super(entity);

        this._breakTimer = 0;

        this.setState(PsyanimPlayfightBehavior.STATE.WANDERING);
    }

    setTarget(target) {

        if (this._target != null)
        {
            this.setOnCollideWith(this._target.body, null);   
        }

        this._target = target;

        this.entity.setOnCollideWith(this._target.body, () => this._handleCollision());
    }

    _handleCollision() {

        this.playfightBehavior.setState(PsyanimPlayfightBehavior.STATE.FLEEING);
    }

    get maxSpeed() {

        switch (this._state) {

            case PsyanimPlayfightBehavior.STATE.CHARGING:

                return this.arriveBehavior.maxSpeed;

            case PsyanimPlayfightBehavior.STATE.WANDERING:

                return this.wanderBehavior.seekBehavior.maxSpeed;

            case PsyanimPlayfightBehavior.STATE.FLEEING:

                return this.fleeBehavior.maxSpeed;
        }
    }

    get maxAcceleration() {

        switch (this._state) {

            case PsyanimPlayfightBehavior.STATE.CHARGING:

                return this.arriveBehavior.maxAcceleration;

            case PsyanimPlayfightBehavior.STATE.WANDERING:

                return this.wanderBehavior.seekBehavior.maxAcceleration;

            case PsyanimPlayfightBehavior.STATE.FLEEING:

                return this.fleeBehavior.maxAcceleration;
            }
    }

    setState(state) {

        this._state = state;

        switch (this._state) {

            case PsyanimPlayfightBehavior.STATE.CHARGING:

                break;

            case PsyanimPlayfightBehavior.STATE.WANDERING:

                break;

            case PsyanimPlayfightBehavior.STATE.FLEEING:

                this._breakTimer = 0;

                break;
        }
    }

    updateBreakTimer(dt) {

        if (this._state == PsyanimPlayfightBehavior.STATE.WANDERING)
        {
            this._breakTimer += dt;

            if (this._breakTimer >= this.breakDuration)
            {
                this.setState(PsyanimPlayfightBehavior.STATE.CHARGING);
            }
        }
        else if (this._state == PsyanimPlayfightBehavior.STATE.FLEEING)
        {
            this._breakTimer += dt;

            let distanceToTarget = this.entity.position
                .subtract(this._target.position)
                .length();

            if (distanceToTarget > this.fleeBehavior.panicDistance)
            {
                this.setState(PsyanimPlayfightBehavior.STATE.WANDERING);
            }
        }
    }

    getSteering(target) {

        switch (this._state) {

            case PsyanimPlayfightBehavior.STATE.CHARGING:

                return this.arriveBehavior.getSteering(target);

            case PsyanimPlayfightBehavior.STATE.WANDERING:

                return this.wanderBehavior.getSteering();

            case PsyanimPlayfightBehavior.STATE.FLEEING:

                return this.fleeBehavior.getSteering(target);
        }
    }
}