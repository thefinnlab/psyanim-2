import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimPlayfightAgentPrefab from '../../src/core/prefabs/PsyanimPlayfightAgentPrefab';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';
import PsyanimPlayfightBehavior from '../../src/core/components/steering/PsyanimPlayfightBehavior';

export default class PsyanimPlayfightTest extends PsyanimScene {

    constructor() {

        super('Playfight Test');
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

        // setup playfight agents
        let agentPrefab = new PsyanimPlayfightAgentPrefab({
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            base: 16, altitude: 32, radius: 12, color: 0xff0000
        });

        let agent1 = this.instantiatePrefab(agentPrefab, 'agent1', 200, 300);

        agentPrefab.debug = true;
        agentPrefab.shapeParams.color = 0x0000ff;

        let agent2 = this.instantiatePrefab(agentPrefab, 'agent2', 600, 300);

        /**
         *  Setup targets for the playfight agents
         */
        let playfight1 = agent1.getComponent(PsyanimPlayfightBehavior);
        let playfight2 = agent2.getComponent(PsyanimPlayfightBehavior);

        playfight1.target = agent2;
        playfight2.target = agent1;

        this.screenBoundary.wrap = false;
    }
}