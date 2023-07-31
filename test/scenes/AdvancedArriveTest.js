import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';
import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimAdvancedArriveBehavior from '../../src/core/components/steering/PsyanimAdvancedArriveBehavior';
import PsyanimAdvancedArriveAgent from '../../src/core/components/steering/agents/PsyanimAdvancedArriveAgent';

import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';

export default class AdvancedArriveTest extends PsyanimScene {

    constructor() {

        super('Advanced Arrive Test');
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        this.target = this.addEntity('target', 0, 0, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4, color: 0x0000ff
        },
        {
            isSensor: true,
            isSleeping: true
        });

        this.target.addComponent(PsyanimMouseFollowTarget);

        this.agent1 = this.addEntity('agent1', 50, 50, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 12, altitude: 20, color: 0x00ff00
        });

        // give it a random initial velocity
        let v0_x = Phaser.Math.Between(0.0, 6.0);
        let v0_y = Phaser.Math.Between(0.0, 6.0);

        this.agent1.setVelocity(v0_x, v0_y);

        this.agent1.body.friction = 0;
        this.agent1.body.frictionAir = 0;
        this.agent1.body.frictionStatic = 0;

        let vehicle1 = this.agent1.addComponent(PsyanimVehicle);

        let advancedArrive = this.agent1.addComponent(PsyanimAdvancedArriveBehavior);

        advancedArrive.chargeDuration = 0.9;
        advancedArrive.innerDecelerationRadius = 10;
        advancedArrive.outerDecelerationRadius = 40;
        advancedArrive.maxAcceleration = 1;

        this.advancedArriveAgent = this.agent1.addComponent(PsyanimAdvancedArriveAgent);

        this.advancedArriveAgent.vehicle = vehicle1;
        this.advancedArriveAgent.advancedArriveBehavior = advancedArrive;

        this._timer = 0;
        this._running = true;

        this._keys = {
            C: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
        }
    }

    update(t, dt) {

        super.update(t, dt);

        this._timer += dt;

        if (Phaser.Input.Keyboard.JustDown(this._keys.C))
        {
            this.advancedArriveAgent.setTargetPosition(this.target.position);

            this._running = true;
            this._timer = 0;
        }

        if (this._running)
        {
            // check end condition
            let distanceToTarget = this.target.position
                .subtract(this.agent1.position)
                .length();

            if (distanceToTarget < 20)
            {
                console.log("reached target in " + (this._timer / 1000) + " seconds!");

                this._running = false;
            }
        }
    }
}