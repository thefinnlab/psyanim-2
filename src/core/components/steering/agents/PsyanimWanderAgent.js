import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimWanderAgent extends PsyanimComponent {

    vehicle = null;

    wanderBehavior = null;

    constructor(entity) {

        super(entity);
    }

    update(t, dt) {

        super.update(t, dt);

        // compute steering
        let steering = this.wanderBehavior.getSteering();

        this.vehicle.steer(steering);
    }
}