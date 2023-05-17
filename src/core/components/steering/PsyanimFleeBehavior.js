import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimFleeBehavior extends PsyanimComponent {

    maxSpeed = 5;
    maxAcceleration = 0.2;

    panicDistance = 250;

    constructor(entity) {

        super(entity);
    }

    getSteering(target) {

        let targetPosition = target.position;
        let distanceToTarget = this.entity.position.subtract(targetPosition).length();

        if (distanceToTarget > this.panicDistance)
        {
            return new Phaser.Math.Vector2(0, 0);
        }

        let desiredVelocity = new Phaser.Math.Vector2(targetPosition.x, targetPosition.y);
        desiredVelocity.subtract(this.entity.position);
        desiredVelocity.setLength(this.maxSpeed);
        desiredVelocity.scale(-1);

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