import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';
import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimAdvancedArriveAgent from '../../src/core/components/steering/agents/PsyanimAdvancedArriveAgent';

import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimAdvancedArriveAgentPrefab from '../../src/core/prefabs/PsyanimAdvancedArriveAgentPrefab';

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

        // setup mouse controller
        this.target = this.addEntity('target', 0, 0, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4, color: 0x0000ff
        },
        {
            isSensor: true,
            isSleeping: true
        });

        this.mouseFollowTarget = this.target.addComponent(PsyanimMouseFollowTarget);

        // setup advanced arrive agent
        let advancedArriveAgentPrefab = new PsyanimAdvancedArriveAgentPrefab({
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 12, altitude: 20, color: 0x00ff00
        });

        advancedArriveAgentPrefab.target = this.target;

        this.agent1 = this.instantiatePrefab(advancedArriveAgentPrefab,'agent1', 50, 50);

        this.advancedArriveAgent = this.agent1.getComponent(PsyanimAdvancedArriveAgent);

        this.advancedArriveAgent.enabled = false;

        this._timer = 0;

        this._keys = {
            C: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
        }
    }

    update(t, dt) {

        super.update(t, dt);

        this._timer += dt;

        if (Phaser.Input.Keyboard.JustDown(this._keys.C))
        {
            this.advancedArriveAgent.enabled = true;
            this.mouseFollowTarget.enabled = false;

            this._timer = 0;
        }

        if (this.advancedArriveAgent.enabled)
        {
            // check end condition
            let distanceToTarget = this.target.position
                .subtract(this.agent1.position)
                .length();

            if (distanceToTarget < 20)
            {
                console.log("reached target in " + (this._timer / 1000) + " seconds!");

                this.advancedArriveAgent.enabled = false;
                this.mouseFollowTarget.enabled = true;
            }
        }
    }
}