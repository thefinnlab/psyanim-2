import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimPathFollowAgent extends PsyanimComponent {

    vehicle = null;

    pathFollowBehavior = null;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        let steering = this.pathFollowBehavior.getSteering(this.target);

        this.vehicle.steer(steering);
    }
}