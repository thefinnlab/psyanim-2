import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimWander from '../../core/components/steering/PsyanimWander';

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';
import PsyanimPlayerController from '../../core/components/controllers/PsyanimPlayerController';

export default class WanderTest extends PsyanimScene {

    constructor() {

        super('WanderTest');
    }

    create() {

        super.create();

        // add agents with vehicle components to this scene
        let agent1 = this.addEntity('agent1', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        agent1.addComponent(PsyanimWander);

        let wander = agent1.getComponent(PsyanimWander);
    }
}