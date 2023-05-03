import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimWander from '../../core/components/steering/PsyanimWander';

import PsyanimConstants from '../../core/PsyanimConstants';

export default class WanderTest extends PsyanimScene {

    constructor() {

        super('WanderTest');
    }

    create() {

        super.create();

        let nAgents = 100;

        for (let i = 0; i < nAgents; ++i)
        {
            let deltaX = (Math.random() * 2 - 1) * 350;
            let deltaY = (Math.random() * 2 - 1) * 250;

            let agent = this.addEntity('agent' + i, 400 + deltaX, 300 + deltaY, {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
                base: 16, altitude: 32, 
                color: 0xffc0cb            
            });
    
            let wander = agent.addComponent(PsyanimWander);    
            wander.debug = false;
            wander.maxSpeed = 3;
            wander.radius = 50;
            wander.maxAngleChangePerFrame = 20;
        }
    }
}