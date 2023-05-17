import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimSeekBehavior extends PsyanimComponent {

    maxSpeed = 5;
    maxAcceleration = 0.2;

    constructor(entity) {

        super(entity);
    }

    getSteering(target) {

        let currentPosition = new Phaser.Math.Vector2(this.entity.x, this.entity.y);

        let desiredVelocity = new Phaser.Math.Vector2(target.x, target.y);
        desiredVelocity.subtract(currentPosition);
        desiredVelocity.setLength(this.maxSpeed);

        let currentVelocityXY = this.entity.getVelocity();

        let currentVelocity = new Phaser.Math.Vector2(currentVelocityXY.x, currentVelocityXY.y);

        let acceleration = desiredVelocity.clone();
        acceleration.subtract(currentVelocity);

        if (acceleration.length() > this.maxAcceleration)
        {
            acceleration.setLength(this.maxAcceleration);
        }

        return acceleration;
    }
}