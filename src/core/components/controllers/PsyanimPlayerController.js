import Phaser from 'phaser';

import PsyanimComponent from "../../PsyanimComponent";

export default class PsyanimPlayerController extends PsyanimComponent {

    constructor(entity, options = {}) {

        super(entity);

        this.keys = {
            W: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: entity.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }

        this.speed = 6;
        this.turnSpeed = 0.2;
    }

    update(t, dt) {

        let horizontal = (this.keys.A.isDown ? -1 : 0) + (this.keys.D.isDown ? 1 : 0);
        let vertical = (this.keys.W.isDown ? -1 : 0) + (this.keys.S.isDown ? 1 : 0);

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