import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimAdvancedArriveBehavior extends PsyanimComponent {

    arriveBehavior;
    obstacleAvoidanceBehavior;

    constructor(entity) {

        super(entity);
    }

    afterCreate() {

        super.afterCreate();
    }

    getSteering(target) {

        let steering = this.obstacleAvoidanceBehavior.getSteering();

        if (steering.length() > 1e-3)
        {
            return steering;
        }

        return this.arriveBehavior.getSteering(target);
    }
}

PsyanimAdvancedArriveBehavior.STATE = {
    IDLE: 0x0001,
    ARRIVING: 0x0002,
};