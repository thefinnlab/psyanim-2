import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimAdvancedFleeBehavior extends PsyanimComponent {

    /**
     * 
     *  Advanced Flee is essentially Flee blended with some basic obstacle avoidance.
     * 
     *  Advanced Flee will attempt to do some simple obstacle avoidance by picking a flee direction
     *  that's not along the path from the target to this entity, but also not in the direction of
     *  nearby obstacles (like the world screen boundary).
     * 
     *  A fundamental limitation of the algorithm here, however, is that the target must either be
     *  actively pursuing this entity any time it is within the panic distance when there are 
     *  obstacles also blocking potential flee directions.
     * 
     *  So, when using this behavior, it is advisable to have the target remain outside the panic 
     *  radius of this entity or otherwise be actively pursuing the entity.
     * 
     *  It's also better to keep the panic distance radius smaller (maybe < 2-4 times the vehicle
     *  size) to avoid the situation where the target is sitting still inside the panic radius.
     * 
     * @param {*} target 
     * @returns 
     */

    maxSpeed = 5;
    maxAcceleration = 0.2;

    panicDistance = 250;

    constructor(entity) {

        super(entity);

        this.setAdvancedFleeSearchDirection(true);

        this._advancedFleeDirection = Phaser.Math.Vector2.ZERO.clone();

        this._advancedFleeRaycastBodies = [
            this.entity.scene.screenBoundary.topBoundary.body, 
            this.entity.scene.screenBoundary.bottomBoundary.body, 
            this.entity.scene.screenBoundary.leftBoundary.body, 
            this.entity.scene.screenBoundary.rightBoundary.body
        ];
    }

    setAdvancedFleeSearchDirection(clockwise) {

        const counterClockwiseAngles = [
            0, Math.PI / 4, Math.PI / 2, Math.PI * 3 / 4,
            -Math.PI * 3 / 4, -Math.PI / 2, -Math.PI / 4
        ];

        const clockwiseAngles = [
            0, -Math.PI / 4, -Math.PI / 2, -Math.PI * 3 / 4,
            Math.PI * 3 / 4, Math.PI / 2, Math.PI / 4
        ];

        this.anglesToCheck = (clockwise) ? clockwiseAngles : counterClockwiseAngles;
    }

    getSteering(target) {

        let targetPosition = target.position;
        let distanceToTarget = this.entity.position.subtract(targetPosition).length();

        if (distanceToTarget > this.panicDistance)
        {
            return new Phaser.Math.Vector2(0, 0);
        }

        let desiredVelocityDirection = this.entity.position.clone()
            .subtract(targetPosition)
            .normalize();

        let desiredVelocityAngle = desiredVelocityDirection.angle();

        const distance = 100;

        for (let i = 0; i < this.anglesToCheck.length; ++i)
        {
            let newAngle = desiredVelocityAngle + this.anglesToCheck[i];

            let newVelocityDirection = desiredVelocityDirection
                .clone()
                .setAngle(newAngle);

            if (!this._isPathBlocked(newVelocityDirection))
            {
                desiredVelocityDirection = newVelocityDirection;
                break;
            }
        }

        this._advancedFleeDirection = desiredVelocityDirection.clone()
            .setLength(distance);

        let desiredVelocity = desiredVelocityDirection.clone()
            .setLength(this.maxSpeed);

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

    _isPathBlocked(directionVector, distance = 100) {

        let start = { x: this.entity.x, y: this.entity.y };

        let endPositionRelative = directionVector.clone()
            .setLength(distance);

        let endVector = this.entity.position.add(endPositionRelative);

        let end = { x: endVector.x, y: endVector.y };

        let collisions = this.entity.scene.matter.query.ray(
            this._advancedFleeRaycastBodies, start, end
        );

        if (collisions && collisions.length != 0)
        {
            return true;
        }

        return false;
    }
}