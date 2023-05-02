import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

export default class ArriveTest extends PsyanimScene {

    constructor() {

        super('Arrive Test');
    }

    create() {

        super.create();

        // setup mouse follow target
        let mouseFollowTarget = new PsyanimMouseFollowTarget(this);

        // add agents as vehicles to this scene
        let vehicle1 = new PsyanimVehicle(this, 'agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });
        
        vehicle1.target = mouseFollowTarget;
        vehicle1.setState(PsyanimVehicle.STATE.ARRIVE);
        vehicle1.maxSpeed = 8;

        // add entities to PsyanimScene so they are managed and receive updates
        this.addEntity(mouseFollowTarget)
        this.addEntity(vehicle1);
    }
}