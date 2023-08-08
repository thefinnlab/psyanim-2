import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController';
import PsyanimSensor from '../../src/core/components/physics/PsyanimSensor';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';

import AfterCreateTest from '../components/AfterCreateTest';

export default class SensorTest extends PsyanimScene {

    constructor() {

        super('SensorTest');
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController).entity
            .addComponent(AfterCreateTest);

        let wall = this.addEntity('wall', 650, 200, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE,
            width: 100, height: 150,
            color: 0xff00ff
        });

        wall.depth = 1;
        wall.body.isStatic = true;

        let killzone1 = this.addEntity('killzone1', 600, 200, {
            shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE,
            width: 100, height: 300,
            color: 0xff0000
        });

        killzone1.body.isSensor = true;

        // create player
        this.player = this.addEntity('player', 400, 300, {
            shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
            base: 16, altitude: 32, 
            width: 40, height: 20, 
            radius: 12, 
            color: 0x0000ff
        });

        this.player.addComponent(PsyanimPlayerController);
        
        let sensor = this.player.addComponent(PsyanimSensor);

        sensor.setBody({
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 75,
        });

        sensor.events.on('triggerEnter', (entity) => {
            console.log(entity.name + ' has ENTERED the building...');
        });

        sensor.events.on('triggerExit', (entity) => {
            console.log(entity.name + ' has EXITED the building...');
        });
    }
}