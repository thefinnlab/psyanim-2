import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimVehicle from './PsyanimVehicle';

export default class PsyanimWanderBehavior extends PsyanimComponent {

    radius = 50;
    offset = 150;

    maxAngleChangePerFrame = 20;

    seekBehavior = null;

    constructor(entity) {

        super(entity);

        this._debug = false;

        this._angle = 270;
        this._targetVector = null;

        this.target = this.entity.scene.addEntity(this.entity.name + '_wanderTarget', 0, 0, { isEmpty: true });
    }

    onEnable() {

        this.vehicle.enabled = true;

        this.vehicle.maxSpeed = 4;
        this.vehicle.target = this.target;
        this.vehicle.setState(PsyanimVehicle.STATE.SEEK);
    }

    getSteering() {

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

        return this.seekBehavior.getSteering(this.target);
    }
}