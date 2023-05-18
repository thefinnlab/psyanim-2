import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimSensor from '../physics/PsyanimSensor';
import PsyanimConstants from '../../PsyanimConstants';

export default class PsyanimVehicle extends PsyanimComponent {

    /**
     *  NOTES: 
     * 
     *  Default params for friction are:
     * 
     *      this.entity.body.friction = 0.1;
     *      this.entity.body.frictionAir = 0.01;
     *      this.entity.body.frictionStatic = 0.5;
     * 
     */

    maxSpeed = 5;
    maxAcceleration = 0.2;

    turnSpeed = 0.2;

    smoothLookDirection = true;

    nSamplesForLookSmoothing = 6;

    useAcceleration = false;

    // TODO: these need to move into their respective behavior components:

    chargeDuration = 2.0;

    constructor(entity) {

        super(entity);

        this._velocitySamples = [];

        // TODO: these are all for collision avoidance
        this._collisionAvoidanceEnabled = false;
    }

    onDisable() {

        this.entity.setVelocity(0, 0);
        this.entity.body.force = { x: 0, y: 0 };
    }

    setState(state) {

        this.state = state;

        switch (this.state) {

            case PsyanimVehicle.STATE.CHARGE:

                this.useAcceleration = true;

                this.entity.body.friction = 0;
                this.entity.body.frictionAir = 0;
                this.entity.body.frictionStatic = 0;

                this._computeChargeAcceleration();

                this._getSteering = this._charge;
                break;
        }
    }

    setTarget(newTarget) {

        this.target = newTarget;

        if (this.state == PsyanimVehicle.STATE.CHARGE)
        {
            this._computeChargeAcceleration();
        }
    }

    _computeChargeAcceleration() {

        let t_ms = 1000 * this.chargeDuration;

        this._chargeAcceleration = this.target.position
            .subtract(this.entity.position)
            .scale(2 / (t_ms * t_ms));

        // TODO: this should be named _computeChargeParams()
        this._maxChargeSpeed = this.entity.velocity
            .scale(1/16.666) // convert to px/ms
            .add(this._chargeAcceleration.clone().scale(t_ms))
            .scale(16.666); // convert back to px/step

        // give it some initial velocity proportional to the distance so it's not so sluggish starting out... 
        // for starters, maybe we do a fraction of the average velocity as the initial velocity... 
        let v0 = this.target.position
            .subtract(this.entity.position)
            .scale(1 / (this.chargeDuration * 1000)) // avg velocity in px/ms
            .scale(16.666); // convert to px/step
        
        v0.scale(0.05); // take a fraction of avg. velocity as v0

        this.entity.setVelocity(v0.x, v0.y);

    }

    _lookWhereYoureGoing() {

        let velocity = this.entity.velocity;

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

    _charge(target) {

        let currentPosition = new Phaser.Math.Vector2(this.entity.x, this.entity.y);

        let targetRelativePosition = new Phaser.Math.Vector2(target.x, target.y);
        targetRelativePosition.subtract(currentPosition);

        let r = targetRelativePosition.length();

        let desiredSpeed = 0;

        let scaledMaxAcceleration = this._chargeAcceleration;

        if (r <= this.innerDecelerationRadius)
        {
            this.entity.setVelocity(0, 0);

            return new Phaser.Math.Vector2(0, 0);
        }
        else if (r > this.outerDecelerationRadius)
        {
            return this._chargeAcceleration;
        }
        else // ((r > this.innerDecelerationRadius) && r < this.r2)
        {
            //  v(r) = ((v_max) / (r2 - r1)) * (r - r1)
            desiredSpeed = ((this._maxChargeSpeed) / (this.outerDecelerationRadius - this.innerDecelerationRadius)) * (r - this.innerDecelerationRadius);
            scaledMaxAcceleration = (r - this.innerDecelerationRadius) / (this.outerDecelerationRadius - this.innerDecelerationRadius) * this._chargeAcceleration.length();
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

    steer(steering) {

        // clamp velocity to max speed
        let velocity = new Phaser.Math.Vector2(this.entity.getVelocity());

        if (velocity.length() > this.maxSpeed)
        {
            velocity.setLength(this.maxSpeed);

            this.entity.setVelocity(velocity.x, velocity.y);    
        }

        // apply steering
        if (this.useAcceleration) // interpret steering as acceleration
        {
            let dv = steering.clone().scale(dt);

            let newVelocity = this.entity.velocity.scale(1/16.666)
                .add(dv)
                .scale(16.666);

            this.entity.setVelocity(newVelocity.x, newVelocity.y);
        }
        else // interpret steering as force
        {
            this.entity.applyForce(steering);
        }

        this._lookWhereYoureGoing();
    }
}