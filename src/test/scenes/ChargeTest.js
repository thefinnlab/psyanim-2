import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

import PsyanimPhysicsSettingsController from '../../core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../core/components/controllers/PsyanimSceneController';

export default class ChargeTest extends PsyanimScene {

    constructor() {

        super('Charge Test');
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        this.target = this.addEntity('target', 750, 550, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4, color: 0x0000ff
        },
        {
            isSensor: true,
            isSleeping: true
        });

        this.agent1 = this.addEntity('agent1', 50, 50, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 12, altitude: 20, color: 0x00ff00
        });

        // this._initConstantVelocity();
        // this._initConstantAcceleration();
        this._initVehicle()
        
        this._timer = 0;
        this._running = true;
    }

    _initConstantVelocity() {

        let t_seconds = 3.2;
        let t_ms = t_seconds * 1000;

        let constantSpeed = this.target.position
            .subtract(this.agent1.position)
            .length() / t_ms;

        // note that this is 'px / ms'
        this.constantVelocity = this.target.position
            .subtract(this.agent1.position)
            .setLength(constantSpeed);

        this.isConstantVelocity = true;
    }

    _initConstantAcceleration() {

        let t_seconds = 2.35;
        let t_ms = 1000 * t_seconds;

        // note that this is 'px / ms^2'
        this.constantAcceleration = this.target.position
            .subtract(this.agent1.position)
            .scale((2 / (t_ms * t_ms)));

        this.isConstantAcceleration = true;

        // need to set friction to zero for this!
        this.agent1.body.friction = 0;
        this.agent1.body.frictionAir = 0;
        this.agent1.body.frictionStatic = 0;
    }

    _initVehicle() {

        this.vehicle1 = this.agent1.addComponent(PsyanimVehicle);

        this.vehicle1.chargeDuration = 1.2;

        // leave the max speed unconstrained (large value)
        this.vehicle1.maxSpeed = 100;

        this.vehicle1.innerDecelerationRadius = 10;
        this.vehicle1.outerDecelerationRadius = 300;

        this.vehicle1.setTarget(this.target);

        this.vehicle1.setState(PsyanimVehicle.STATE.CHARGE);
    }

    update(t, dt) {

        super.update(t, dt);

        this._timer += dt;

        // update object acceleration
        if (this._running && this.isConstantVelocity)
        {
            let newVelocity = this.constantVelocity.clone();

            // we need to convert the velocity from (px / ms) to (px / step)
            newVelocity.scale(16.666);

            this.agent1.setVelocity(newVelocity.x, newVelocity.y);
        }
        else if (this._running && this.isConstantAcceleration)
        {
            // the following is an example of how to do the euler integration by hand for comparison:

            let dv = this.constantAcceleration.clone().scale(dt);

            let newVelocity = this.agent1.velocity.scale(1/16.666)
                .add(dv)
                .scale(16.666);

            this.agent1.setVelocity(newVelocity.x, newVelocity.y);
        }

        // check end condition
        let distanceToTarget = this.target.position
            .subtract(this.agent1.position)
            .length();

        if (this._running && distanceToTarget < 20)
        {
            console.log("reached target in " + (this._timer / 1000) + " seconds!");

            if (this.isConstantAcceleration)
            {
                this.agent1.setVelocity(0, 0);
            }
            else if (this.isConstantVelocity)
            {
                this.agent1.setVelocity(0, 0);
            }

            this._running = false;
        }
    }
}