import Phaser from 'phaser';

import PsyanimConstants from '../../../gameobjects/PsyanimConstants';
import MouseFollowTarget from '../../../gameobjects/controllers/MouseFollowTarget';
import PsyanimGeomUtils from '../../../gameobjects/PsyanimGeomUtils';
import ScreenBoundary from '../../../gameobjects/world/ScreenBoundary';
import PsyanimPlayerController from '../../../gameobjects/controllers/PsyanimPlayerController';
import PsyanimVehicle from '../../../gameobjects/steering/PsyanimVehicle';

export default class MainScene extends Phaser.Scene {

    constructor() {

        super('main');
    }

    init() {
    }

    preload() {

    }

    create() {

        // setup wrapping with screen boundary
        this.screenBoundary = new ScreenBoundary(this);

        // setup mouse follow target
        this.mouseFollowTarget = new MouseFollowTarget(this);

        // create player
        this.player = new PsyanimPlayerController(this, 'player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 30, altitude: 60, 
            width: 40, height: 20, 
            radius: 12, 
            color: 0x0000ff
        });

        // add 3 vehicles with different geometry to the scene
        let vehicle1 = new PsyanimVehicle(this, 'agent1', 200, 150, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE, 
            width: 60, height: 30,
            color: 0xffff00            
        });

        let vehicle2 = new PsyanimVehicle(this, 'agent2', 200, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE, 
            radius: 12,
            color: 0x87ceeb          
        });

        let vehicle3 = new PsyanimVehicle(this, 'agent3', 600, 450, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE, 
            base: 30, altitude: 60, 
            color: 0xffc0cb            
        });
    }

    update(t, dt) {
    }
}