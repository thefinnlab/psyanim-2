import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';
import PsyanimEntity from '../../core/PsyanimEntity';

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

export default class ArriveTest extends PsyanimScene {

    constructor() {

        super('ArriveTest');
    }

    create() {

        super.create();

        // setup mouse follow target
        let mouseFollowTarget = new PsyanimMouseFollowTarget(this);

        // add agents with vehicle components to this scene
        let agent1 = new PsyanimEntity(this, 'agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        let vehicle1 = agent1.addComponent(PsyanimVehicle);

        vehicle1.target = mouseFollowTarget;
        vehicle1.maxSpeed = 8;
        vehicle1.setState(PsyanimVehicle.STATE.ARRIVE);

        // add entities to PsyanimScene so they are managed and receive updates
        this.addEntity(mouseFollowTarget);
        this.addEntity(agent1);
    }
}