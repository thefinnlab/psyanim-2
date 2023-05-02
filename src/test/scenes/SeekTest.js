import Phaser from 'phaser';

import PsyanimScene from '../../scenes/PsyanimScene';

import PsyanimConstants from '../../entities/PsyanimConstants';
import PsyanimMouseFollowTarget from '../../entities/controllers/PsyanimMouseFollowTarget';
import PsyanimPlayerController from '../../entities/controllers/PsyanimPlayerController';
import PsyanimVehicle from '../../entities/steering/PsyanimVehicle';

export default class SeekTest extends PsyanimScene {

    constructor() {

        super('Seek Test');
    }

    create() {

        super.create();

        // setup mouse follow target
        let mouseFollowTarget = new PsyanimMouseFollowTarget(this);

        // create player
        let player = new PsyanimPlayerController(this, 'player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, 
            width: 40, height: 20, 
            radius: 12, 
            color: 0x0000ff
        });

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

        let vehicle3 = new PsyanimVehicle(this, 'agent3', 200, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            radius: 12,
            color: 0x87ceeb          
        });

        vehicle1.target = player;
        vehicle1.setState(PsyanimVehicle.STATE.SEEK);
        vehicle1.maxSpeed = 5;

        vehicle2.target = vehicle3;
        vehicle2.setState(PsyanimVehicle.STATE.SEEK);
        vehicle2.maxSpeed = 4;
        vehicle2.nSamplesForSmoothing = 10;

        vehicle3.target = mouseFollowTarget;
        vehicle3.setState(PsyanimVehicle.STATE.SEEK);
        vehicle3.maxSpeed = 5;

        let vehicles = [vehicle1, vehicle2, vehicle3];

        this.addEntity(mouseFollowTarget);
        this.addEntity(player);

        vehicles.forEach(v => this.addEntity(v));
    }
}