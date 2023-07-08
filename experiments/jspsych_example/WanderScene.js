import PsyanimScene from '../../src/core/scene/PsyanimScene';

import PsyanimVehicle from '../../src/core/components/steering/PsyanimVehicle';
import PsyanimWanderBehavior from '../../src/core/components/steering/PsyanimWanderBehavior';
import PsyanimWanderAgent from '../../src/core/components/steering/agents/PsyanimWanderAgent';
import PsyanimSeekBehavior from '../../src/core/components/steering/PsyanimSeekBehavior';

import PsyanimConstants from '../../src/core/PsyanimConstants';

export default class WanderScene extends PsyanimScene {

    static KEY = 'Wander Scene';

    constructor() {

        super(WanderScene.KEY);
    }

    create() {

        super.create();

        let currentParameterSet = this.game.registry.get('psyanim_currentParameterSet');

        let nAgents = currentParameterSet.nAgents;

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
        }
    }
}