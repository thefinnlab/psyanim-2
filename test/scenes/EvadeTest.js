import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';
import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';
import PsyanimEvadeAgentPrefab from '../../src/core/prefabs/PsyanimEvadeAgentPrefab';

export default class EvadeTest extends PsyanimScene {

    static KEY = 'Evade Test';

    constructor() {

        super(EvadeTest.KEY);
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // create player
        let player = this.addEntity('player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, 
            width: 40, height: 20, 
            radius: 12, 
            color: 0x0000ff
        });

        player.addComponent(PsyanimPlayerController);

        // create evade agent
        let agentPrefab = new PsyanimEvadeAgentPrefab({
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, color: 0x00ff00         
        });

        agentPrefab.target = player;

        let agent = this.instantiatePrefab(agentPrefab, 'agent1', 600, 450);
    }
}