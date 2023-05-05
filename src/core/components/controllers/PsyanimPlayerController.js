import Phaser from 'phaser';

import PsyanimComponent from "../../PsyanimComponent";

export default class PsyanimPlayerController extends PsyanimComponent {

    speed = 6;
    turnSpeed = 0.2;

    constructor(entity) {

        super(entity);

        this._keys = {
            W: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }
    }

    onEnable() {

    }

    onDisable() {

        this.entity.setVelocity(0, 0);
    }

    update(t, dt) {

        let horizontal = (this._keys.A.isDown ? -1 : 0) + (this._keys.D.isDown ? 1 : 0);
        let vertical = (this._keys.W.isDown ? -1 : 0) + (this._keys.S.isDown ? 1 : 0);

        this.entity.setVelocity(horizontal * this.speed, vertical * this.speed);

        if (Math.abs(horizontal) > 1e-3 || Math.abs(vertical) > 1e-3)
        {
            let targetAngle = Math.atan2(vertical, horizontal);

            let newAngle = Phaser.Math.Angle.RotateTo(
                this.entity.angle * Math.PI / 180,
                targetAngle,
                this.turnSpeed);

            this.entity.setAngle(newAngle * 180 / Math.PI);
        }
    }
}