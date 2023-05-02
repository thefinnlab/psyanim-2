import Phaser from 'phaser';

import PsyanimEntity from '../PsyanimEntity';

import PsyanimConstants from "../PsyanimConstants";
import PsyanimGeomUtils from '../PsyanimGeomUtils';

export default class PsyanimVehicle extends PsyanimEntity {

    static STATE = {

        IDLE: 0x0001,
        SEEK: 0x0002,
        FLEE: 0x0004,
        ARRIVE: 0x0008,
        WANDER: 0x0010
        // 0x0020
        // 0x0040
    };

    constructor(scene, name, x = 200, y = 200, shapeParams = {}) {

        /**
         *  Setup vehicle rendering + physics
         */

        const defaultShapeParams = {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            base: 30, altitude: 60, 
            width: 20, height: 20, 
            radius: 30, 
            color: 0xffff00};

        let textureKey = 'vehicle_' + name;

        let matterConfig = {};

        let matterOptions = {
            label: name,
            collisionFilter: {
                category: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT,
                mask: PsyanimConstants.COLLISION_CATEGORIES.DEFAULT | 
                    PsyanimConstants.COLLISION_CATEGORIES.SCREEN_BOUNDARY
            }
        };

        let shapeType = (shapeParams.shapeType) ? shapeParams.shapeType : defaultShapeParams.shapeType;
        let color = (shapeParams.color) ? shapeParams.color : defaultShapeParams.color;

        switch(shapeType)
        {
            case PsyanimConstants.SHAPE_TYPE.CIRCLE:

                let radius = (shapeParams.radius) ? shapeParams.radius : defaultShapeParams.radius;

                let circleGeomParams = {
                    radius: radius
                };

                PsyanimGeomUtils.generateCircleTexture(scene, textureKey, circleGeomParams, color);

                matterConfig.type = 'circle';
                matterConfig.radius = circleGeomParams.radius;

                break;

            case PsyanimConstants.SHAPE_TYPE.TRIANGLE:

                let base = (shapeParams.base) ? shapeParams.base : defaultShapeParams.base;
                let altitude = (shapeParams.altitude) ? shapeParams.altitude : defaultShapeParams.altitude;
    
                let triangleGeomParams = {
                    base: base, altitude: altitude
                };

                PsyanimGeomUtils.generateTriangleTexture(scene, textureKey, triangleGeomParams, color);
    
                matterConfig.type = 'fromVertices';
                matterConfig.verts = PsyanimGeomUtils.computeTriangleVertices(base, altitude);
    
                break;

            case PsyanimConstants.SHAPE_TYPE.RECTANGLE:

                let width = (shapeParams.width) ? shapeParams.width : defaultShapeParams.width;
                let height = (shapeParams.height) ? shapeParams.height : defaultShapeParams.height;

                let rectangleGeomParams = {
                    width: width, height: height
                };

                PsyanimGeomUtils.generateRectangleTexture(scene, textureKey, rectangleGeomParams, color);

                matterConfig.type = 'rectangle';
                matterConfig.width = width;
                matterConfig.height = height;

                break;
        }

        super(scene.matter.world, x, y, textureKey);

        this.setBody(matterConfig, matterOptions);

        let mass = 100;

        this.body.mass = mass;
        this.body.inverseMass = 1/mass;

        this.body.inertia = Infinity;
        this.body.inverseInertia = 0;

        scene.add.existing(this);

        /**
         *  Setup vehicle steering state
         */

        this.setState(PsyanimVehicle.STATE.IDLE);

        this.target = null;

        this.maxSpeed = 5;
        this.maxAcceleration = 0.2;

        this.turnSpeed = 0.2;

        this.smoothLookDirection = true;

        this.nSamplesForLookSmoothing = 5
        this._velocitySamples = [];

        this.innerDecelerationRadius = 25;
        this.outerDecelerationRadius = 140;
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

        let velocityXY = this.getVelocity();

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

            let newAngle = Phaser.Math.Angle.RotateTo(
                this.angle * Math.PI / 180,
                targetAngle,
                this.turnSpeed);

            this.setAngle(newAngle);
        }
    }

    _seek(target) {

        let currentPosition = new Phaser.Math.Vector2(this.x, this.y);

        let desiredVelocity = new Phaser.Math.Vector2(target.x, target.y);
        desiredVelocity.subtract(currentPosition);
        desiredVelocity.setLength(this.maxSpeed);

        let currentVelocityXY = this.getVelocity();

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

        let currentPosition = new Phaser.Math.Vector2(this.x, this.y);

        let desiredVelocity = new Phaser.Math.Vector2(target.x, target.y);
        desiredVelocity.subtract(currentPosition);
        desiredVelocity.setLength(this.maxSpeed);
        desiredVelocity.scale(-1);

        let currentVelocityXY = this.getVelocity();

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

        let currentPosition = new Phaser.Math.Vector2(this.x, this.y);

        let targetRelativePosition = new Phaser.Math.Vector2(target.x, target.y);
        targetRelativePosition.subtract(currentPosition);

        let r = targetRelativePosition.length();

        let desiredSpeed = 0;

        let scaledMaxAcceleration = this.maxAcceleration;

        if (r <= this.innerDecelerationRadius)
        {
            this.setVelocity(0, 0);

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

        let currentVelocityXY = this.getVelocity();

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
        let velocity = new Phaser.Math.Vector2(this.getVelocity());

        if (velocity.length() > this.maxSpeed)
        {
            velocity.setLength(this.maxSpeed);

            this.setVelocity(velocity.x, velocity.y);    
        }

        // apply steering
        let steer = this._getSteering(this.target);

        this.applyForce(steer);

        this._lookWhereYoureGoing(4);
    }
}