import Phaser from 'phaser';

import PsyanimScene from '../../scenes/PsyanimScene';

import PsyanimConstants from '../../gameobjects/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../gameobjects/controllers/PsyanimMouseFollowTarget';
import PsyanimVehicle from '../../gameobjects/steering/PsyanimVehicle';

export default class SeekTest extends PsyanimScene {

    constructor() {

        super('Flee Test');
    }

    init() {
        super.init();
    }

    preload() {
        super.preload();
    }

    create() {

        super.create();

        // setup mouse follow target
        this.mouseFollowTarget = new PsyanimMouseFollowTarget(this);

        // add agents as vehicles to this scene
        this.vehicle1 = new PsyanimVehicle(this, 'agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });

        this.vehicle2 = new PsyanimVehicle(this, 'agent2', 200, 150, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 60, height: 30,
            color: 0xffff00            
        });

        this.vehicle1.target = this.mouseFollowTarget;
        this.vehicle1.setState(PsyanimVehicle.STATE.FLEE);
        this.vehicle1.maxSpeed = 4;

        this.vehicle2.target = this.mouseFollowTarget;
        this.vehicle2.setState(PsyanimVehicle.STATE.FLEE);
        this.vehicle2.maxSpeed = 3;
        this.vehicle2.nSamplesForLookSmoothing = 10;
    }

    update(t, dt) {
        super.update(t, dt);

        this.mouseFollowTarget.update(t, dt);

        this.vehicle1.update(t, dt);
        this.vehicle2.update(t, dt);
    }
}