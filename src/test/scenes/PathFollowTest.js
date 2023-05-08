import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimPathFollow from '../../core/components/steering/PsyanimPathFollow';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

export default class PathFollowTest extends PsyanimScene {

    constructor() {

        super('Path Follow Test');
    }

    create() {

        super.create();

        // setup keyboard controls for testing
        this._testKeys = {
            U: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U),
            I: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
            R: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        };

        // create agent that follows a path
        this.agent1 = this.addEntity('agent1', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        let predictionTime = 25;
        let targetOffset = 50;

        this.vehicle1 = this.agent1.addComponent(PsyanimVehicle);
        this.vehicle1.turnSpeed = Infinity;
        this.vehicle1.maxSpeed = 3;

        this.pathFollow1 = this.agent1.addComponent(PsyanimPathFollow);
        this.pathFollow1.p1 = new Phaser.Math.Vector2(30, 430);
        this.pathFollow1.p2 = new Phaser.Math.Vector2(770, 370);
        this.pathFollow1.predictionTime = predictionTime;
        this.pathFollow1.targetOffset = targetOffset;

        this.stoppingRadius = predictionTime + targetOffset;
    }

    update(t, dt) {

        super.update(t, dt);

        // process control inputs
        if (Phaser.Input.Keyboard.JustDown(this._testKeys.U))
        {
            this.pathFollow1.enabled = false;
        }
        else if (Phaser.Input.Keyboard.JustDown(this._testKeys.I))
        {
            this.pathFollow1.enabled = true;
        }

        let distanceToPathEnd = this.agent1.position.subtract(this.pathFollow1.p2).length();

        if (distanceToPathEnd < this.stoppingRadius)
        {
            this.pathFollow1.reverseDirection();
        }
    }
}