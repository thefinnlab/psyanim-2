import Phaser from 'phaser';

import PsyanimComponent from "../../PsyanimComponent";
import PsyanimClickToMove from './PsyanimClickToMove';

export default class PsyanimPlayerController extends PsyanimComponent {

    speed = 8;
    turnSpeed = 0.2;

    clickToMoveController = null;

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

    _handleKeyboardInput(horizontal, vertical) {

        let velocity = new Phaser.Math.Vector2(horizontal, vertical)
        .setLength(this.speed);

        this.entity.setVelocity(velocity.x, velocity.y);

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

    update(t, dt) {

        super.update(t, dt);

        let horizontal = (this._keys.A.isDown ? -1 : 0) + (this._keys.D.isDown ? 1 : 0);
        let vertical = (this._keys.W.isDown ? -1 : 0) + (this._keys.S.isDown ? 1 : 0);

        if (this.clickToMoveController)
        {
            if (this.clickToMoveController.state == PsyanimClickToMove.STATE.IDLE)
            {
                this._handleKeyboardInput(horizontal, vertical);
            }
            else if (this.clickToMoveController.state == PsyanimClickToMove.STATE.TRAVELING)
            {
                if (horizontal != 0 || vertical != 0)
                {
                    this.clickToMoveController.cancelMovementRequest();
                    this._handleKeyboardInput(horizontal, vertical);
                }
            }
        }
        else
        {
            this._handleKeyboardInput(horizontal, vertical);
        }
    }
}