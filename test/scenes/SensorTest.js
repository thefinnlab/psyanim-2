import Phaser from 'phaser';

import PsyanimScene from '../../src/core/PsyanimScene';

import PsyanimConstants from '../../src/core/PsyanimConstants';
import PsyanimPlayerController from '../../src/core/components/controllers/PsyanimPlayerController';
import PsyanimSensor from '../../src/core/components/physics/PsyanimSensor';

import PsyanimPhysicsSettingsController from '../../src/core/components/controllers/PsyanimPhysicsSettingsController';
import PsyanimSceneChangeController from '../../src/core/components/controllers/PsyanimSceneController';

import PsyanimSceneTitle from '../../src/core/components/ui/PsyanimSceneTitle';
import SensorTestManager from '../components/SensorTestManager';

export default {
    key: 'Sensor Test',
    entities: [
        {
            name: 'sceneControls',
            components: [
                { type: PsyanimSceneTitle },
                { type: PsyanimPhysicsSettingsController },
                { type: PsyanimSceneChangeController }
            ]
        },
        {
            name: 'testManager',
            components: [
                {
                    type: SensorTestManager,
                    params: {
                        sensor: {
                            entityName: 'player',
                            componentType: PsyanimSensor
                        }
                    }
                }
            ]
        },
        {
            name: 'wall',
            initialPosition: { x: 650, y: 200 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE,
                width: 100, height: 150, color: 0xff00ff,
                depth: 1
            },
            matterOptions: {
                isStatic: true
            }
        },
        {
            name: 'killzone1',
            initialPosition: { x: 600, y: 200 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.RECTANGLE,
                width: 100, height: 300, color: 0xff0000
            },
            matterOptions: {
                isSensor: true
            }
        },
        {
            name: 'player',
            initialPosition: { x: 400, y: 300 },
            shapeParams: {
                shapeType: PsyanimConstants.SHAPE_TYPE.TRIANGLE,
                base: 16, altitude: 32, color: 0x0000ff    
            },
            components: [
                { type: PsyanimPlayerController },
                {
                    type: PsyanimSensor,
                    params: {
                        bodyShapeParams: {
                            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
                            radius: 75,
                        }
                    }
                }
            ]
        },
    ]
};

class SensorTest extends PsyanimScene {

    static KEY = 'SensorTest';

    constructor() {

        super(SensorTest.KEY);
    }

    create() {

        super.create();

        // setup scene controls
        this.addEntity('sceneControls')
            .addComponent(PsyanimSceneTitle).entity
            .addComponent(PsyanimPhysicsSettingsController).entity
            .addComponent(PsyanimSceneChangeController);

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
            base: 16, altitude: 32, color: 0x0000ff
        });

        this.player.addComponent(PsyanimPlayerController);
        
        let sensor = this.player.addComponent(PsyanimSensor);

        sensor.setBody({
            shapeType: PsyanimConstants.SHAPE_TYPE.CIRCLE,
            radius: 75,
        });
    }
}