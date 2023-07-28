import Phaser from 'phaser';

import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';
import PsyanimWanderBehavior from '../../src/core/components/steering/PsyanimWanderBehavior';
import PsyanimWanderAgent from '../../src/core/components/steering/agents/PsyanimWanderAgent';
import PsyanimSeekBehavior from '../../src/core/components/steering/PsyanimSeekBehavior';

import PsyanimConstants from '../../src/core/PsyanimConstants';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

export default class WanderTest extends PsyanimScene {

    constructor() {

        super('WanderTest');
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

        let nAgents = 20;

        for (let i = 0; i < nAgents; ++i)
        {
            let deltaX = (Math.random() * 2 - 1) * 350;
            let deltaY = (Math.random() * 2 - 1) * 250;

            let agent = this.addEntity('agent' + i, 400 + deltaX, 300 + deltaY, {
                textureKey: 'wanderTestRectangle',
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                base: 16, altitude: 32, 
                color: 0xffc0cb            
            });
    
            let wanderVehicle = agent.addComponent(PsyanimVehicle);

            let seek = agent.addComponent(PsyanimSeekBehavior);

            let wander = agent.addComponent(PsyanimWanderBehavior);   
            wander.vehicle = wanderVehicle;
            
            wander.maxSpeed = 3;
            wander.radius = 50;
            wander.maxAngleChangePerFrame = 20;

            wander.seekBehavior = seek;

            let wanderAgent = agent.addComponent(PsyanimWanderAgent);
            wanderAgent.vehicle = wanderVehicle;
            wanderAgent.wanderBehavior = wander;

            // let wanderDebug = agent.addComponent(PsyanimWanderDebug);
            // wanderDebug.wanderBehavior = wander;
        }
    }
}