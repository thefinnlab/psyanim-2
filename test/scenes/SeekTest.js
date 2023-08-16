import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../src/core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';
import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController';

import PsyanimSeekBehavior from '../../src/core/components/steering/PsyanimSeekBehavior';
import PsyanimSeekAgent from '../../src/core/components/steering/agents/PsyanimSeekAgent';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';
import PsyanimSeekAgentPrefab from '../../src/core/prefabs/PsyanimSeekAgentPrefab';

export default class SeekTest extends PsyanimScene {

    constructor() {

        super('Seek Test');
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

        // create player
        let player = this.addEntity('player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, 
            width: 40, height: 20, 
            radius: 12, 
            color: 0x0000ff
        });

        player.addComponent(PsyanimPlayerController);

        // add agents to the scene
        let agentPrefab = new PsyanimSeekAgentPrefab({
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        agentPrefab.target = player;

        let agent1 = this.instantiatePrefab(agentPrefab, 'agent1', 600, 450);

        agentPrefab.shapeParams = {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 60, height: 30,
            color: 0xffff00            
        };

        agentPrefab.target = mouseTarget;
        agentPrefab.maxSpeed = 6;
        agentPrefab.maxAcceleration = 0.4;

        let agent2 = this.instantiatePrefab(agentPrefab, 'agent2', 200, 150);

        agentPrefab.shapeParams = {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            radius: 12,
            color: 0x87ceeb          
        };

        agentPrefab.target = agent2;
        agentPrefab.maxSpeed = 4;
        agentPrefab.maxAcceleration = 0.2;

        let agent3 = this.instantiatePrefab(agentPrefab, 'agent3', 200, 450);
    }
}