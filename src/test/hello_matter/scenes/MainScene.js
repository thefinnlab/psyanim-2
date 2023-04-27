import Phaser from 'phaser';

import PsyanimConstants from '../../../gameobjects/PsyanimConstants';
import MouseFollowTarget from '../../../gameobjects/input/MouseFollowTarget';
import PsyanimGeomUtils from '../../../gameobjects/PsyanimGeomUtils';
import ScreenBoundary from '../../../gameobjects/world/ScreenBoundary';

export default class MainScene extends Phaser.Scene {

    constructor() {

        super('main');
    }

    init() {

        this.speed = 7;
        this.turnSpeed = 0.15;
    }

    preload() {

        this.keys = {
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        }
    }

    create() {

        // setup wrapping with screen boundary
        this.screenBoundary = new ScreenBoundary(this);

        // create player
        let triangleTextureKey = 'triangle';

        let playerGeomParams = {
            x: 400, y: 300,
            base: 30, altitude: 60
        };

        PsyanimGeomUtils.generateTriangleTexture(this, triangleTextureKey, playerGeomParams);
        
        this.player = PsyanimGeomUtils.createTriangleSprite(this, triangleTextureKey, playerGeomParams);

        // setup mouse follow target
        this.mouseFollowTarget = new MouseFollowTarget(this);
    }

    update(t, dt) {

        let horizontal = (this.keys.A.isDown ? -1 : 0) + (this.keys.D.isDown ? 1 : 0);
        let vertical = (this.keys.W.isDown ? -1 : 0) + (this.keys.S.isDown ? 1 : 0);

        this.player.setVelocity(horizontal * this.speed, vertical * this.speed);

        if (Math.abs(horizontal) > 1e-3 || Math.abs(vertical) > 1e-3)
        {
            let targetAngle = Math.atan2(vertical, horizontal);

            let newAngle = Phaser.Math.Angle.RotateTo(
                this.player.angle * Math.PI / 180,
                targetAngle,
                this.turnSpeed);

            this.player.setAngle(newAngle * 180 / Math.PI);
        }
    }
}