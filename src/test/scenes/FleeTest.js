import Phaser from 'phaser';

import PsyanimScene from '../../core/scene/PsyanimScene';

import PsyanimConstants from '../../core/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../core/components/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../core/components/steering/PsyanimVehicle';

export default class SeekTest extends PsyanimScene {

    constructor() {

        super('Flee Test');
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

        let vehicle2 = new PsyanimVehicle(this, 'agent2', 200, 150, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 60, height: 30,
            color: 0xffff00            
        });

        vehicle1.target = mouseFollowTarget;
        vehicle1.setState(PsyanimVehicle.STATE.FLEE);
        vehicle1.maxSpeed = 4;

        vehicle2.target = mouseFollowTarget;
        vehicle2.setState(PsyanimVehicle.STATE.FLEE);
        vehicle2.maxSpeed = 3;
        vehicle2.nSamplesForLookSmoothing = 10;

        this.addEntity(mouseFollowTarget);
        this.addEntity(vehicle1);
        this.addEntity(vehicle2);
    }
}