import Phaser from 'phaser';

import PsyanimComponent from '../../../PsyanimComponent';

export default class PsyanimAdvancedArriveAgent extends PsyanimComponent {

    advancedArriveBehavior;
    vehicle;

    constructor(entity) {
        
        super(entity);

        this._target = this.entity.scene
            .addEntity(this.entity.name + "_target", 0, 0, {
                isEmpty: true
        });
    }

    setTargetPosition(position) {

        this._target.position = position;
        this.advancedArriveBehavior.computeMaxSpeed(this._target);
    }

    update(t, dt) {

        super.update(t, dt);

        this.vehicle.maxSpeed = this.advancedArriveBehavior.maxSpeed;

        let steering = this.advancedArriveBehavior.getSteering(this._target);

        this.vehicle.steer(steering);
    }
}