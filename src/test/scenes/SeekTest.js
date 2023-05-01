import Phaser from 'phaser';

import PsyanimScene from '../../scenes/PsyanimScene';

import PsyanimConstants from '../../gameobjects/PsyanimConstants';
import MouseFollowTarget from '../../gameobjects/controllers/MouseFollowTarget';
import ScreenBoundary from '../../gameobjects/world/ScreenBoundary';
import PsyanimPlayerController from '../../gameobjects/controllers/PsyanimPlayerController';
import PsyanimVehicle from '../../gameobjects/steering/PsyanimVehicle';

export default class SeekTest extends PsyanimScene {

    constructor() {

        super('Seek Test');
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

        // create player
        this.player = new PsyanimPlayerController(this, 'player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, 
            width: 40, height: 20, 
            radius: 12, 
            color: 0x0000ff
        });

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

        this.vehicle3 = new PsyanimVehicle(this, 'agent3', 200, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            radius: 12,
            color: 0x87ceeb          
        });

        this.vehicle1.target = this.player;
        this.vehicle1.setState(PsyanimVehicle.STATE.SEEK);
        this.vehicle1.maxSpeed = 5;

        this.vehicle2.target = this.vehicle3;
        this.vehicle2.setState(PsyanimVehicle.STATE.SEEK);
        this.vehicle2.maxSpeed = 3;
        this.vehicle2.maxAcceleration = 0.02;

        this.vehicle3.target = this.mouseFollowTarget;
        this.vehicle3.setState(PsyanimVehicle.STATE.SEEK);
        this.vehicle3.maxSpeed = 4;

        this.vehicles = [this.vehicle1, this.vehicle2, this.vehicle3];
    }

    update(t, dt) {

        super.update(t, dt);

        this.mouseFollowTarget.update(t, dt);
        this.player.update(t, dt);

        this.vehicles.forEach(v => v.update(t, dt));
    }
}