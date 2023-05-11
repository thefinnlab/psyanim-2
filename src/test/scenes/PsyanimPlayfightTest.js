import Phaser from 'phaser';

import PsyanimScene from "../../core/scene/PsyanimScene";

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimPlayerController from '../../core/components/controllers/PsyanimPlayerController';

import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimWander from '../../core/components/steering/PsyanimWander';

export default class PsyanimPlayfightTest extends PsyanimScene {

    constructor() {

        super('Playfight Test');
    }

    create() {

        super.create();

        // create player
        this.player = this.addEntity('player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, color: 0x0000ff });

        this.player.addComponent(PsyanimPlayerController);

        // add agents as vehicles to this scene
        let wanderAgent = this.addEntity('wanderAgent', 0, 0, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, color: 0xff0000         
        });

        let wanderTarget = this.addEntity('wanderTarget', 0, 0, { isEmpty: true });

        this.wanderVehicle = wanderAgent.addComponent(PsyanimVehicle);
        this.wanderVehicle.target = wanderTarget;
        this.wanderVehicle.setState(PsyanimVehicle.STATE.SEEK);

        this.wander = wanderAgent.addComponent(PsyanimWander);
        this.wander.vehicle = this.wanderVehicle;
        this.wander.target = wanderTarget;
        this.wander.maxSpeed = 4;

        // setup inputs
        this._testKeys = {
            ZERO: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO),
        }
    }

    update(t, dt) {

        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this._testKeys.ZERO))
        {
            this.wander.enabled = !this.wander.enabled;
            this.wanderVehicle.enabled = !this.wanderVehicle.enabled;
        }
    }
}