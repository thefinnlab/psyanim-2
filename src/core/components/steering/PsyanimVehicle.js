import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimSensor from '../physics/PsyanimSensor';
import PsyanimConstants from '../../PsyanimConstants';

export default class PsyanimVehicle extends PsyanimComponent {

    static STATE = {

        IDLE: 0x0001,
        SEEK: 0x0002,
        FLEE: 0x0004,
        EVADE: 0x0008,
        ARRIVE: 0x0010,
        WANDER: 0x0020
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

    panicDistance = 250;

    maxPredictionTime = 1.0;

    sensorRadius = 75;

    constructor(entity) {

        super(entity);

        this._velocitySamples = [];

        this._collisionAvoidanceEnabled = false;

        this._nearbyAgents = [];

        this.setState(PsyanimVehicle.STATE.IDLE);
    }

    enableCollisionAvoidance() {

        if (this.sensor)
        {
            this.sensor.enabled = true;
        }
        else // setup collision avoidance for the first time
        {
            this.sensor = this.entity.addComponent(PsyanimSensor);

            this.sensor.setBody({
                shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                radius: this.sensorRadius
            });
    
            this.sensor.events.on('triggerEnter', (entity) => {
                this._nearbyAgents.push(entity);
            });
    
            this.sensor.events.on('triggerExit', (entity) => {

                this._nearbyAgents = this._nearbyAgents.filter(e => {
                    e.name != entity.name;
                });
            });    
        }

        this._collisionAvoidanceEnabled = true;
    }

    disableCollisionAvoidance() {

        if (this.sensor)
        {
            this.sensor.enabled = false;
        }

        this._collisionAvoidanceEnabled = false;
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

            case PsyanimVehicle.STATE.EVADE:

                this._getSteering = this._evade;
                break;

            case PsyanimVehicle.STATE.ARRIVE:

                this._getSteering = this._arrive;
                break;
        }
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

    _evade(target) {

        let targetPosition = target.position;
        let distanceToTarget = this.entity.position.subtract(targetPosition).length();

        let targetVelocity = target.velocity;
        let targetSpeed = targetVelocity.length();

        let predictionTime = this.maxPredictionTime;

        if (targetSpeed > distanceToTarget / this.maxPredictionTime)
        {
            predictionTime = distanceToTarget / targetSpeed;

            // don't project too far out, predicted position can go past character.
            // Unity Movement AI package uses this magic number.  can adjust if needed.
            predictionTime *= 0.9;
        }

        let evadeTargetPosition = targetVelocity.clone();
        evadeTargetPosition.scale(predictionTime);
        evadeTargetPosition.add(targetPosition);

        let evadeTarget = {
            position: evadeTargetPosition,
        }

        return this._flee(evadeTarget);
    }

    collisionRadius = 8;

    _avoidCollisions() {

        /**
         *  Algorithm here is lifted mostly straight from 'Artificial Inteligence for Games'
         *  by Ian Millington, 3rd ed.
         */

        if (this._nearbyAgents.length == 0)
        {
            return new Phaser.Math.Vector2(0, 0);
        }

        let shortestTime = Infinity;
        let firstTarget = null;
        let firstMinSeparation = 0;
        let firstDistance = 0;
        let firstRelativePosition = null;
        let firstRelativeVelocity = null;

        // find target for collision avoidance
        for (let i = 0; i < this._nearbyAgents.length; ++i)
        {
            let agent = this._nearbyAgents[i];
            let relativePosition = agent.position.subtract(this.entity.position);
            let relativeVelocity = agent.velocity.subtract(this.entity.velocity);
            let relativeSpeed = relativeVelocity.length();

            let timeToCollision = -1 * relativePosition.dot(relativeVelocity) / (relativeSpeed * relativeSpeed);

            let distance = relativePosition.length();

            let minSeparation = relativeVelocity.clone()
                .scale(timeToCollision)
                .add(relativePosition)
                .length();

            if (minSeparation > 2 * this.collisionRadius)
            {
                continue;
            }

            if (timeToCollision > 0 && timeToCollision < shortestTime)
            {
                shortestTime = timeToCollision;
                firstTarget = agent;
                firstMinSeparation = minSeparation;
                firstDistance = distance;
                firstRelativePosition = relativePosition;
                firstRelativeVelocity = relativeVelocity;
            }
        }

        // calculate steering
        if (firstTarget == null)
        {
            return new Phaser.Math.Vector2(0, 0);
        }

        let finalRelativePosition = null;

        if (firstMinSeparation <= 0 || firstDistance < 2 * this.collisionRadius)
        {
            finalRelativePosition = firstTarget.position.subtract(this.entity.position);
        }
        else
        {
            finalRelativePosition = firstRelativePosition.add(firstRelativeVelocity.scale(shortestTime));
        }

        finalRelativePosition.normalize();

        let steering = finalRelativePosition.scale(-1 * this.maxAcceleration);

        return steering;
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

        super.update(t, dt);

        // clamp velocity to max speed
        let velocity = new Phaser.Math.Vector2(this.entity.getVelocity());

        if (velocity.length() > this.maxSpeed)
        {
            velocity.setLength(this.maxSpeed);

            this.entity.setVelocity(velocity.x, velocity.y);    
        }

        // apply steering
        let steer = null;

        if (this._collisionAvoidanceEnabled)
        {
            steer = this._avoidCollisions();

            if (steer.length() < 0.00001)
            {
                steer = this._getSteering(this.target);
            }    
        }
        else
        {
            steer = this._getSteering(this.target);
        }

        this.entity.applyForce(steer);

        this._lookWhereYoureGoing();
    }
}