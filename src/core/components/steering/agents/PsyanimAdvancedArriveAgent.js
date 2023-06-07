import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimAdvancedArriveAgent extends PsyanimComponent {

    advancedArriveBehavior = null;
    vehicle = null;

    constructor(entity) {
        
        super(entity);
    }

    setTarget(target) {

        this._target = target;
        this.advancedArriveBehavior.computeMaxSpeed(target);
    }

    update(t, dt) {

        super.update(t, dt);

        this.vehicle.maxSpeed = this.advancedArriveBehavior.maxSpeed;

        let steering = this.advancedArriveBehavior.getSteering(this._target);

        this.vehicle.steer(steering);
    }
}