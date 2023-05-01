import Phaser from 'phaser';

import PsyanimScene from '../../scenes/PsyanimScene';

import PsyanimConstants from '../../gameobjects/PsyanimConstants';
import MouseFollowTarget from '../../gameobjects/controllers/MouseFollowTarget';
import ScreenBoundary from '../../gameobjects/world/ScreenBoundary';
import PsyanimPlayerController from '../../gameobjects/controllers/PsyanimPlayerController';
import PsyanimVehicle from '../../gameobjects/steering/PsyanimVehicle';

export default class ArriveTest extends PsyanimScene {

    constructor() {

        super('Arrive Test');
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
        this.mouseFollowTarget = new MouseFollowTarget(this);

        // add agents as vehicles to this scene
        this.vehicle1 = new PsyanimVehicle(this, 'agent1', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 16, altitude: 32, 
            color: 0xffc0cb            
        });
        
        this.vehicle1.target = this.mouseFollowTarget;
        this.vehicle1.setState(PsyanimVehicle.STATE.ARRIVE);
        this.vehicle1.maxSpeed = 8;
    }

    shutdown() {

        super.shutdown();
    }

    update(t, dt) {

        super.update(t, dt);
        
        this.mouseFollowTarget.update(t, dt);

        this.vehicle1.update(t, dt);
    }
}