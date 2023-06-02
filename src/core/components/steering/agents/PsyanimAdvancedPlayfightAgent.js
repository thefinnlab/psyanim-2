import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';
import PsyanimPlayfightBehavior from '../PsyanimPlayfightBehavior';

export default class PsyanimAdvancedPlayfightAgent extends PsyanimComponent {

    playfightBehavior = null;
    vehicle = null;

    constructor(entity) {

        super(entity);
    }

    setTarget(target) {

        this._target = target;

        this.playfightBehavior.setTarget(target);
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