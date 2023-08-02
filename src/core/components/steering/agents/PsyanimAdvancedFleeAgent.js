import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimAdvancedFleeAgent extends PsyanimComponent {

    target;
    advancedFleeBehavior;
    vehicle;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        this.vehicle.maxSpeed = this.advancedFleeBehavior.maxSpeed;

        let steering = this.advancedFleeBehavior.getSteering(this.target);

        this.vehicle.steer(steering);
    }
}