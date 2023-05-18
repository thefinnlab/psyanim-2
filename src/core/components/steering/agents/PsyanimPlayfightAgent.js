import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';
import PsyanimPlayfightBehavior from '../PsyanimPlayfightBehavior';

export default class PsyanimPlayfightAgent extends PsyanimComponent {

    playfightBehavior = null;
    vehicle = null;

    constructor(entity) {

        super(entity);
    }

    setTarget(target) {

        this.playfightBehavior.setTarget(target);
    }

    update(t, dt) {

        super.update(t, dt);

        // update steering params
        this.vehicle.maxSpeed = this.playfightBehavior.maxSpeed;

        // compute steering
        this.playfightBehavior.updateBreakTimer(dt);

        let steering = this.playfightBehavior.getSteering(this._target);

        this.vehicle.steer(steering);
    }
}