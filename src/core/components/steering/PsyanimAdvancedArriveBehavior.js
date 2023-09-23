import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimAdvancedArriveBehavior extends PsyanimComponent {

    arriveBehavior;
    obstacleAvoidanceBehavior;

    constructor(entity) {

        super(entity);

        // TODO: let's have this class do the arrive, but with obstacle avoidance

        this._state = PsyanimAdvancedArriveBehavior.STATE.IDLE;
    }

    afterCreate() {

        super.afterCreate();
    }

    getSteering(target) {

        switch(this._state) {

            case PsyanimAdvancedArriveBehavior.STATE.IDLE:

                return new Phaser.Math.Vector2(0, 0);

            case PsyanimAdvancedArriveBehavior.STATE.AVOIDING:

                return this.obstacleAvoidanceBehavior.getSteering();
                
            case PsyanimAdvancedArriveBehavior.STATE.ARRIVING:

                return this.arriveBehavior.getSteering(target);
        }
    }
}

PsyanimAdvancedArriveBehavior.STATE = {
    IDLE: 0x0001,
    ARRIVING: 0x0002,
    AVOIDING: 0x0003
};