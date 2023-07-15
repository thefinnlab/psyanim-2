import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimPredatorAgent extends PsyanimComponent {

    target = null;

    vehicle = null;

    predatorBehavior = null;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        // update steering params
        this.vehicle.maxSpeed = this.predatorBehavior.maxSpeed;

        // compute steering
        let steering = this.predatorBehavior.getSteering(this.target);

        this.vehicle.steer(steering);
    }
}