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
     */

    maxSpeed;
    maxAcceleration;

    panicDistance;

    wallSeparationDistance;

    constructor(entity) {

        super(entity);

        this.maxSpeed = 5;
        this.maxAcceleration = 0.2;
    
        this.panicDistance = 250;

        this.wallSeparationDistance = 30;

        this._wallCoords = {
            upperY: 0,
            lowerY: this.scene.game.canvas.height,
            leftX: 0,
            rightX: this.scene.game.canvas.width
        };

        this._timer = 0;
        this._angleOffset = 0;
        this._direction = 1;
    }

    getSteering(target) {

        let entityPosition = this.entity.position;
        let targetPosition = target.position;
        let distanceToTarget = this.entity.position.subtract(targetPosition).length();

        let distancesToWalls = {
            upperWall: entityPosition.y - this._wallCoords.upperY,
            lowerWall: this._wallCoords.lowerY - entityPosition.y,
            leftWall: entityPosition.x - this._wallCoords.leftX,
            rightWall: this._wallCoords.rightX - entityPosition.x
        };

        let desiredVelocityDirection = Phaser.Math.Vector2.ZERO.clone();

        if (distanceToTarget < this.panicDistance)
        {
            desiredVelocityDirection = this.entity.position.clone()
                .subtract(targetPosition)
                .normalize();
        }

        let isInsideWallBoundary = distancesToWalls.upperWall < this.wallSeparationDistance
            || distancesToWalls.lowerWall < this.wallSeparationDistance
            || distancesToWalls.leftWall < this.wallSeparationDistance
            || distancesToWalls.rightWall < this.wallSeparationDistance;

        if (isInsideWallBoundary && desiredVelocityDirection.length() > 1e-3)
        {
            desiredVelocityDirection.rotate(this._direction * this._angleOffset);
        }

        if (desiredVelocityDirection.length() < 1e-3)
        {
            return Phaser.Math.Vector2.ZERO.clone();
        }

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

    update(t, dt) {

        super.update(t, dt);

        this._timer += dt;

        if (this._timer > 1000)
        {
            let minAngle = 15;
            let maxAngle = 90;

            this._angleOffset = (Math.random() * (maxAngle - minAngle) + minAngle) * Math.PI / 180;
            this._direction = Math.random() > 0.5 ? -1 : 1;
            this._timer = 0;
        }
    }
}