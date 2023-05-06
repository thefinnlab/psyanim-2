import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

export default class PsyanimVehicle extends PsyanimComponent {

    static STATE = {

        IDLE: 0x0001,
        SEEK: 0x0002,
        FLEE: 0x0004,
        ARRIVE: 0x0008,
        WANDER: 0x0010
        // 0x0020
        // 0x0040
    };

    state = PsyanimVehicle.STATE.IDLE;

    target = null;

    maxSpeed = 5;
    maxAcceleration = 0.2;

    turnSpeed = 0.2;

    smoothLookDirection = true;

    nSamplesForLookSmoothing = 10;

    innerDecelerationRadius = 25;
    outerDecelerationRadius = 140;

    constructor(entity) {

        super(entity);

        this._velocitySamples = [];

        this.setState(PsyanimVehicle.STATE.IDLE);
    }

    setState(state) {

        this.state = state;

        switch (this.state) {

            case PsyanimVehicle.STATE.IDLE:

                this._getSteering = (target) => new Phaser.Math.Vector2(0, 0);
                break;

            case PsyanimVehicle.STATE.SEEK:

                this._getSteering = this._seek;
                break;

            case PsyanimVehicle.STATE.FLEE:

                this._getSteering = this._flee;
                break;

            case PsyanimVehicle.STATE.ARRIVE:

                this._getSteering = this._arrive;
                break;

        }
    }

    _lookWhereYoureGoing() {

        let velocityXY = this.entity.getVelocity();

        let velocity = new Phaser.Math.Vector2(velocityXY.x, velocityXY.y);

        let direction = new Phaser.Math.Vector2(0, 0);

        if (this.smoothLookDirection)
        {
            if (this._velocitySamples.length == this.nSamplesForLookSmoothing)
            {
                this._velocitySamples.shift();
            }

            this._velocitySamples.push(velocity);

            for (let i = 0; i < this._velocitySamples.length; ++i)
            {
                direction.add(this._velocitySamples[i]);
            }
    
            direction.scale(1 / this._velocitySamples.length);    
        }
        else
        {
            direction = velocity;
        }

        if (direction.length() > 1e-3)
        {
            direction.normalize();

            let targetAngle = Math.atan2(direction.y, direction.x) * 180 / Math.PI;

            if (this.turnSpeed == Infinity)
            {
                this.entity.setAngle(targetAngle);
            }
            else
            {
                let lerpedAngle = Phaser.Math.Angle.RotateTo(
                    this.entity.angle * Math.PI / 180,
                    targetAngle,
                    this.turnSpeed);
    
                this.entity.setAngle(lerpedAngle);                    
            }
        }
    }

    _seek(target) {

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

    _flee(target) {

        let currentPosition = new Phaser.Math.Vector2(this.entity.x, this.entity.y);

        let desiredVelocity = new Phaser.Math.Vector2(target.x, target.y);
        desiredVelocity.subtract(currentPosition);
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

    _arrive(target) {

        /**
         *  NOTE: we define two concentric circles of radii, r1 and r2, where r1 < r2, such that the 
         *  desired speed of the vehicle at a distance of r1 from the target is zero and the desired 
         *  speed of the vehicle at a distance of r2 from the target is the v_max.
         * 
         *  Between r1 and r2, the velocity v varies linearly as a function of the distance r from 
         *  the target, according to the following equation:
         * 
         *  v(r) = ((v_max) / (r2 - r1)) * (r - r1)
         * 
         */

        let currentPosition = new Phaser.Math.Vector2(this.entity.x, this.entity.y);

        let targetRelativePosition = new Phaser.Math.Vector2(target.x, target.y);
        targetRelativePosition.subtract(currentPosition);

        let r = targetRelativePosition.length();

        let desiredSpeed = 0;

        let scaledMaxAcceleration = this.maxAcceleration;

        if (r <= this.innerDecelerationRadius)
        {
            this.entity.setVelocity(0, 0);

            return new Phaser.Math.Vector2(0, 0);
        }
        else if (r > this.outerDecelerationRadius)
        {
            desiredSpeed = this.maxSpeed;
        }
        else // ((r > this.innerDecelerationRadius) && r < this.r2)
        {
            desiredSpeed = ((this.maxSpeed) / (this.outerDecelerationRadius - this.innerDecelerationRadius)) * (r - this.innerDecelerationRadius);
            scaledMaxAcceleration = (r - this.innerDecelerationRadius) / (this.outerDecelerationRadius - this.innerDecelerationRadius) * this.maxAcceleration;
        }

        let desiredVelocity = targetRelativePosition.clone();

        desiredVelocity.setLength(desiredSpeed);

        let currentVelocityXY = this.entity.getVelocity();

        let currentVelocity = new Phaser.Math.Vector2(currentVelocityXY.x, currentVelocityXY.y);

        let acceleration = desiredVelocity.clone();
        acceleration.subtract(currentVelocity);

        if (acceleration.length() > scaledMaxAcceleration)
        {
            acceleration.setLength(scaledMaxAcceleration);
        }

        return acceleration;
    }

    update(t, dt) {

        // clamp velocity to max speed
        let velocity = new Phaser.Math.Vector2(this.entity.getVelocity());

        if (velocity.length() > this.maxSpeed)
        {
            velocity.setLength(this.maxSpeed);

            this.entity.setVelocity(velocity.x, velocity.y);    
        }

        // apply steering
        let steer = this._getSteering(this.target);

        this.entity.applyForce(steer);

        this._lookWhereYoureGoing();
    }
}