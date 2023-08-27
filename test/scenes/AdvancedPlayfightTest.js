import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';
import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimAdvancedPlayfightAgent from '../../src/core/components/steering/agents/PsyanimAdvancedPlayfightAgent';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimAdvancedPlayfightAgentPrefab from '../../src/core/prefabs/PsyanimAdvancedPlayfightAgentPrefab';
import PsyanimAdvancedPlayfightBehavior from '../../src/core/components/steering/PsyanimAdvancedPlayfightBehavior';

export default class AdvancedPlayfightTest extends PsyanimScene {

    static KEY = 'Advanced Playfight Test';

    constructor() {

        super(AdvancedPlayfightTest.KEY);
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
        let playfightAgentPrefab = new PsyanimAdvancedPlayfightAgentPrefab({
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            radius: 12, color: 0xff0000
        });

        playfightAgentPrefab.collisionFrequency = 2000;
        playfightAgentPrefab.breakDuration = 1650;

        let agent1 = this.instantiatePrefab(playfightAgentPrefab, 'agent1', 200, 300);

        agent1.getComponent(PsyanimAdvancedPlayfightBehavior).debug = false;

        playfightAgentPrefab.name = 'agent2';
        playfightAgentPrefab.shapeParams.color = 0x0000ff;
        playfightAgentPrefab.shapeParams.x = 600;
        playfightAgentPrefab.shapeParams.y = 300;

        let agent2 = this.instantiatePrefab(playfightAgentPrefab, 'agent2', 600, 300);

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