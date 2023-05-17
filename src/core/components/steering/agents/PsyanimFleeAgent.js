import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimFleeAgent extends PsyanimComponent {

    target = null;
    fleeBehavior = null;
    vehicle = null;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        this.fleeBehavior.maxSpeed = this.vehicle.maxSpeed;
        this.fleeBehavior.maxAcceleration = this.vehicle.maxAcceleration;

        let steering = this.fleeBehavior.getSteering(this.target);

        this.vehicle.steer(steering);
    }
}