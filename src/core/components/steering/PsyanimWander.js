import Phaser from 'phaser';

import PsyanimComponent from '../../PsyanimComponent';

import PsyanimVehicle from './PsyanimVehicle';

export default class PsyanimWander extends PsyanimComponent {

    radius = 20;
    offset = 150;

    constructor(entity) {

        super(entity);

        this._debug = false;

        this.vehicle = this.entity.getComponent(PsyanimVehicle);

        if (!this.vehicle)
        {
            this.vehicle = this.entity.addComponent(PsyanimVehicle);
        }

        this.target = entity.scene.addEntity(this.entity.name + 'wanderTarget', 0, 0, {
            isEmpty: true
        });

        this.vehicle.target = this.target;
        this.vehicle.setState(PsyanimVehicle.STATE.SEEK);

        this._angle = 45;
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

        this._debugCircleTargetLine = new Phaser.Geom.Line(
            this._debugCircle.x,
            this._debugCircle.y,
            this._debugCircle.x + this.radius,
            this._debugCircle.y
        );
    }

    _drawDebugGraphics() {

        // update render state
        let offsetVector = new Phaser.Math.Vector2(this.offset, 0);
        offsetVector.setAngle(this.entity.rotation);

        let newPosition = this.entity.position.add(offsetVector);

        this._debugCircle.setPosition(
            newPosition.x,
            newPosition.y
        );

        let circleCenterVector = new Phaser.Math.Vector2(this._debugCircle.x, this._debugCircle.y);
        
        let targetVector = this.entity.forward.setLength(this.radius);
        targetVector.rotate(this._angle * Math.PI / 180);
        targetVector.add(circleCenterVector);

        this._debugCircleTargetLine.setTo(
            circleCenterVector.x, circleCenterVector.y,
            targetVector.x, targetVector.y
        );

        // draw
        this.graphics.clear();

        this.graphics.strokeLineShape(this._debugCircleTargetLine);
        this.graphics.strokeCircleShape(this._debugCircle);
    }

    update(t, dt) {

        super.update(t, dt);

        if (this._debug) {
            this._drawDebugGraphics();
        }

        this.target.x = this.entity.scene.input.x;
        this.target.y = this.entity.scene.input.y;
    }
}