import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimEntity from '../../core/PsyanimEntity';

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

export default class SeekTest extends PsyanimScene {

    constructor() {

        super('FleeTest');
    }

    create() {

        super.create();

        // setup mouse follow target
        let mouseTarget = this.addEntity('mouseFollowTarget', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 4,
            color: 0x00ff00
        });

        mouseTarget.addComponent(PsyanimMouseFollowTarget, { radius: 4 });

        // add agents with vehicle components to this scene
        let agent1 = this.addEntity('agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        let agent2 = this.addEntity('agent2', 200, 150, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 60, height: 30,
            color: 0xffff00            
        });

        let vehicle1 = agent1.addComponent(PsyanimVehicle);
        let vehicle2 = agent2.addComponent(PsyanimVehicle);

        vehicle1.target = mouseTarget;
        vehicle1.setState(PsyanimVehicle.STATE.FLEE);
        vehicle1.maxSpeed = 4;

        vehicle2.target = mouseTarget;
        vehicle2.setState(PsyanimVehicle.STATE.FLEE);
        vehicle2.maxSpeed = 3;
        vehicle2.nSamplesForLookSmoothing = 10;
    }
}