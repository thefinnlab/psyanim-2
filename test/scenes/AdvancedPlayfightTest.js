import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimAdvancedPlayfightAgent from '../../src/core/components/steering/agents/PsyanimAdvancedPlayfightAgent';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimPlayfightAgentPrefab from '../prefabs/PsyanimPlayfightAgentPrefab';

export default class AdvancedPlayfightTest extends PsyanimScene {

    constructor() {

        super('Advanced Playfight Test');
    }

    create() {

        super.create();

        /**
         *  Create playfight agents
         */

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // setup agents from prefab
        let playfightAgentPrefab = new PsyanimPlayfightAgentPrefab();
        playfightAgentPrefab.collisionFrequency = 2000;
        playfightAgentPrefab.breakDuration = 1650;

        playfightAgentPrefab.color = 0xff0000;
        playfightAgentPrefab.initialPosition = new Phaser.Math.Vector2(200, 300);

        let agent1 = playfightAgentPrefab.instantiate(this, 'agent1');

        playfightAgentPrefab.color = 0x0000ff;
        playfightAgentPrefab.initialPosition = new Phaser.Math.Vector2(600, 300);

        let agent2 = playfightAgentPrefab.instantiate(this, 'agent2');

        /**
         *  Setup targets for the playfight agents
         */
        let playfightAgent1 = agent1.getComponent(PsyanimAdvancedPlayfightAgent);
        let playfightAgent2 = agent2.getComponent(PsyanimAdvancedPlayfightAgent);

        playfightAgent1.setTarget(agent2);
        playfightAgent2.setTarget(agent1);

        this.screenBoundary.wrap = false;
    }
}