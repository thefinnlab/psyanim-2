import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimDebug from '../../utils/PsyanimDebug';

export default class PsyanimAdvancedArriveBehavior extends PsyanimComponent {

    arriveBehavior;
    obstacleAvoidanceBehavior;

    constructor(entity) {

        super(entity);

        PsyanimDebug.warn('PsyanimAdvancedArriveBehavior is in a prototype state and really should be used ' + 
            'with a pathfinder to get cleaner / more believable obstacle avoidance behavior.')
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