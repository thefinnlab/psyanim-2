import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimPathFollow from '../../core/components/steering/PsyanimPathFollow';

import PsyanimPlayerController from '../../core/components/controllers/PsyanimPlayerController';

export default class PathFollowTest extends PsyanimScene {

    constructor() {

        super('Path Follow Test');
    }

    create() {

        super.create();

        // setup keyboard controls for testing
        this._testKeys = {
            M: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M),
            N: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N),
            U: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U),
            I: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)
        };

        // create agent that follows a path
        this.agent1 = this.addEntity('agent1', 30, 30, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        this.pathFollow1 = this.agent1.addComponent(PsyanimPathFollow);
        this.pathFollow1.p1 = new Phaser.Math.Vector2(100, 500);
        this.pathFollow1.p2 = new Phaser.Math.Vector2(700, 100);
    }

    update(t, dt) {

        super.update(t, dt);

        // process control inputs
        if (this._testKeys.M.isDown)
        {
            this.pathFollow1.p2.x += 10;
        }
        else if (this._testKeys.N.isDown)
        {
            this.pathFollow1.p2.x -= 10;
        }
        else if (this._testKeys.U.isDown)
        {
            this.pathFollow1.enabled = false;
        }
        else if (this._testKeys.I.isDown)
        {
            this.pathFollow1.enabled = true;
        }
    }
}