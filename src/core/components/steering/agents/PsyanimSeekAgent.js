import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimSeekAgent extends PsyanimComponent {

    target = null;
    seekBehavior = null;
    vehicle = null;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        this.vehicle.maxSpeed = this.seekBehavior.maxSpeed;

        let steering = this.seekBehavior.getSteering(this.target);

        this.vehicle.steer(steering);
    }
}