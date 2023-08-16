import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import PsyanimFleeAgentPrefab from '../../src/core/prefabs/PsyanimFleeAgentPrefab';
import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';

export default class FleeTest extends PsyanimScene {

    constructor() {

        super('Flee Test');
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        // setup mouse follow target
        let mouseTarget = this.addEntity('mouseFollowTarget', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4,
            color: 0x00ff00
        });

        mouseTarget.addComponent(PsyanimMouseFollowTarget, { radius: 4 });

        // add agents to this scene
        let agentPrefab = new PsyanimFleeAgentPrefab({
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        agentPrefab.target = mouseTarget;

        let agent1 = this.instantiatePrefab(agentPrefab, 'agent1', 600, 450);

        agentPrefab.maxSpeed = 5;

        agentPrefab.shapeParams = {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 60, height: 30,
            color: 0xffff00            
        };
        
        let agent2 = this.instantiatePrefab(agentPrefab, 'agent2', 200, 150);

        agent2.getComponent(PsyanimVehicle).nSamplesForLookSmoothing = 10;
    }
}