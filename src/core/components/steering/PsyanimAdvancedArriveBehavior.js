import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimAdvancedArriveBehavior extends PsyanimComponent {

    seekBehavior;
    obstacleAvoidanceBehavior;

    constructor(entity) {

        super(entity);

        // TODO: let's have this class do the arrive, but with obstacle avoidance
    }

    afterCreate() {

        super.afterCreate();
    }

    update(t, dt) {

        super.update(t, dt);


    }
}