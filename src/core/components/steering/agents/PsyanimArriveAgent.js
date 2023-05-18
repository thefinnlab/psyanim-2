import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimArriveAgent extends PsyanimComponent {

    target = null;
    arriveBehavior = null;
    vehicle = null;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        this.arriveBehavior.maxSpeed = this.vehicle.maxSpeed;
        this.arriveBehavior.maxAcceleration = this.vehicle.maxAcceleration;

        let steering = this.arriveBehavior.getSteering(this.target);

        this.vehicle.steer(steering);
    }
}