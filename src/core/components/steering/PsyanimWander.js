import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimVehicle from './PsyanimVehicle';

export default class PsyanimWander extends PsyanimComponent {

    vehicle = null;
    target = null;

    maxSpeed = 3;

    radius = 50;
    offset = 150;

    maxAngleChangePerFrame = 20;

    constructor(entity) {

        super(entity);

        this._debug = false;

        this._angle = 270;
        this._targetVector = null;
    }

    get debug() {
        return this._debug;
    }

    set debug(value) {

        if (this._debug == value)
        {
            return;
        }

        this._debug = value;

        if (this._debug)
        {
            this._setupDebugGraphics();
        }
        else
        {
            this.graphics.destroy();
            this.graphics = null;
        }
    }

    onEnable() {

        this.vehicle.enabled = true;

        this.vehicle.maxSpeed = 4;
        this.vehicle.target = this.target;
        this.vehicle.setState(PsyanimVehicle.STATE.SEEK);
    }

    _setupDebugGraphics() {

        this.graphics = this.entity.scene.add.graphics({ 
            lineStyle: {
                width: 2, color: 0xa020f0, alpha: 0.6
            }
        });

        this._debugCircle = new Phaser.Geom.Circle(
            this.entity.x,
            this.entity.y,
            this.radius
        );

        this._debugCircleAngleLine = new Phaser.Geom.Line(
            this._debugCircle.x,
            this._debugCircle.y,
            this._debugCircle.x + this.radius,
            this._debugCircle.y
        );

        this._debugTargetLine = new Phaser.Geom.Line(
            0,
            0,
            this.entity.x,
            this.entity.y,
        )
    }

    _drawDebugGraphics() {

        // update render state
        this._debugCircle.radius = this.radius;

        this._debugCircle.setPosition(
            this._circleCenterVector.x,
            this._circleCenterVector.y
        );

        this._debugCircleAngleLine.setTo(
            this._circleCenterVector.x, 
            this._circleCenterVector.y,
            this._targetVector.x, 
            this._targetVector.y
        );

        this._debugTargetLine.setTo(
            this.entity.x, this.entity.y,
            this._targetVector.x, this._targetVector.y
        );

        // draw
        this.graphics.clear();

        this.graphics.strokeLineShape(this._debugCircleAngleLine);
        this.graphics.strokeLineShape(this._debugTargetLine);
        this.graphics.strokeCircleShape(this._debugCircle);
    }

    update(t, dt) {

        super.update(t, dt);

        // compute angle change
        this._angle += (Math.random() * 2 - 1) * this.maxAngleChangePerFrame;

        if (this._angle > 360)
        {
            this._angle - 360;
        }
        else if (this._angle < 0)
        {
            this._angle + 360;
        }

        // update target vector
        let offsetVector = new Phaser.Math.Vector2(this.offset, 0);
        offsetVector.setAngle(this.entity.rotation);

        this._circleCenterVector = this.entity.position.add(offsetVector);

        this._targetVector = this.entity.forward.setLength(this.radius);
        this._targetVector.rotate(this._angle * Math.PI / 180);
        this._targetVector.add(this._circleCenterVector);

        this.target.position = this._targetVector;

        if (this._debug) {
            this._drawDebugGraphics();
        }
    }
}