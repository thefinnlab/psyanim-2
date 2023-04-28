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

        // setup wrapping with screen boundary
        this.screenBoundary = new ScreenBoundary(this);

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
    }

    update(t, dt) {

        super.update(t, dt);

        this.mouseFollowTarget.update(t, dt);
        this.player.update(t, dt);
        this.vehicle1.update(t, dt);
    }
}