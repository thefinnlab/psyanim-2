import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimPlayfightAgent extends PsyanimComponent {

    playfightBehavior;
    vehicle;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        // update steering params
        this.vehicle.maxSpeed = this.playfightBehavior.maxSpeed;

        // compute steering
        this.playfightBehavior.updateBreakTimer(dt);

        let steering = this.playfightBehavior.getSteering();

        this.vehicle.steer(steering);
    }
}