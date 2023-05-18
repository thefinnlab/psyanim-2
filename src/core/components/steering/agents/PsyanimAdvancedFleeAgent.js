import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimAdvancedFleeAgent extends PsyanimComponent {

    target = null;
    advancedFleeBehavior = null;
    vehicle = null;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        this.advancedFleeBehavior.maxSpeed = this.vehicle.maxSpeed;
        this.advancedFleeBehavior.maxAcceleration = this.vehicle.maxAcceleration;

        let steering = this.advancedFleeBehavior.getSteering(this.target);

        this.vehicle.steer(steering);
    }
}