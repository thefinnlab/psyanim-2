import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

export default class ChargeTest extends PsyanimScene {

    constructor() {

        super('Charge Test');
    }

    create() {

        super.create();

        this.target = this.addEntity('target', 750, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4, color: 0x0000ff
        },
        {
            isSensor: true,
            isSleeping: true
        });

        this.agent1 = this.addEntity('agent1', 50, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4, color: 0x00ff00
        });

        // this._initConstantVelocity();
        this._initConstantAcceleration();
        
        this._timer = 0;
        this._running = true;
    }

    _initConstantVelocity() {

        let t_seconds = 2.0;
        let t_ms = t_seconds * 1000;

        let constantSpeed = this.target.position
            .subtract(this.agent1.position)
            .length() / t_ms;

        this.constantVelocity = this.target.position
            .subtract(this.agent1.position)
            .setLength(constantSpeed);

        this.isConstantVelocity = true;
    }

    _initConstantAcceleration() {

        let t_seconds = 2.2;
        let t_ms = 1000 * t_seconds;

        this.constantAcceleration = this.target.position
            .subtract(this.agent1.position)
            .scale((2 / (t_ms * t_ms)));

        this.currentVelocity = new Phaser.Math.Vector2(0, 0);

        this.isConstantAcceleration = true;
    }

    _initVehicle() {

        this.vehicle1 = this.agent1.addComponent(PsyanimVehicle);

        let t_seconds = 2.0;

        // /**
        //  *  From: https://github.com/liabru/matter-js/issues/179
        //  * 
        //  *  "Internally the engine uses MKS (meters, kilograms, and seconds) units 
        //  *  and radians for angles.
        //  * 
        //  *  If you use the built in renderer and and built in runner, with default 
        //  *  settings this translates to:
        //  *  
        //  *      1 position = 1 px
        //  *      1 speed = 1 px per step
        //  *      1 step = 16.666ms"
        //  */

        let t = t_seconds * 1000 / 16.666;

        this.vehicle1.maxSpeed = 100;

        this.vehicle1.maxAcceleration = (2 / (t * t)) * 
            this.target.position
                .subtract(this.agent1.position)
                .length();

        this.vehicle1.target = this.target;
        this.vehicle1.setState(PsyanimVehicle.STATE.CHARGE);
    }

    update(t, dt) {

        super.update(t, dt);

        this._timer += dt;

        // update object acceleration
        if (this._running && this.isConstantVelocity)
        {
            let currentPosition = this.agent1.position;

            let dx = this.constantVelocity.clone().scale(dt);

            let newPosition = currentPosition
                .add(dx);

            this.agent1.position = newPosition;
        }
        else if (this._running && this.isConstantAcceleration)
        {
            let newVelocity = this.currentVelocity
                .add(this.constantAcceleration.clone()
                    .scale(dt));

            let currentPosition = this.agent1.position;

            let dx = newVelocity.clone().scale(dt);

            let newPosition = currentPosition
                .add(dx);

            this.agent1.position = newPosition;
            this.currentVelocity = newVelocity;

            // TODO: after converting newVelocity to 'px / step', these two funcs give same result
            // newVelocity.scale(16.666);
            // this.agent1.setVelocity(newVelocity.x, newVelocity.y);
            // this.matter.body.setVelocity(this.agent1.body, { x: newVelocity.x, y: newVelocity.y});
        }

        // check end condition
        let distanceToTarget = this.target.position
            .subtract(this.agent1.position)
            .length();

        if (this._running && distanceToTarget < 5)
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
            else
            {
                this.vehicle1.entity.body.isSleeping = true;
                this.vehicle1.maxAcceleration = 0;
                this.vehicle1.entity.setVelocity(0, 0);                    
            }

            this._running = false;
        }
    }
}